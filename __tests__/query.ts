import { query } from '../src';

jest.spyOn(global, 'fetch').mockImplementation((endp) => {
  let value: any = null;
  let data = { jest: 'medea' };

  switch (endp) {
    case 'data':
      value = { data };
      break;
    case 'errors':
      value = { errors: [{ message: 'error' }] };
      break;
    case 'throw':
      throw new Error('thrown error');
    default:
      value = data;
      break;
  }

  return Promise.resolve({
    json: () => value
  } as Response);
});

describe('query', () => {
  const consoleSpy = jest.spyOn(console, 'log');

  beforeEach(() => {
    consoleSpy.mockReset();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('should call fetch successfully', async () => {
    let result = await query('endpoint');
    expect(result).toEqual({ success: true, data: { jest: 'medea' } });

    result = await query('data', { body: JSON.stringify({ test: 'payload' }) });
    expect(result).toEqual({ success: true, data: { jest: 'medea' } });
  });

  it('should call fetch successfully - with errors', async () => {
    let result = await query('errors');

    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: { message: 'error' } });

    consoleSpy.mockReset();

    result = await query('errors', { shouldLog: false });

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: { message: 'error' } });
  });

  it('should call fetch unsuccessfully', async () => {
    let result = await query('throw');

    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: new Error('thrown error')
    });

    consoleSpy.mockReset();

    result = await query('throw', { shouldLog: false });

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: new Error('thrown error')
    });
  });
});
