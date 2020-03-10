import { restoreSpys, resetSpys } from './__utils';

import { readIn } from '../src';
import * as utils from '../src/utils';

describe('readIn', () => {
  it('should return file data successfully', async () => {
    const data = 'medea';
    const expected = { success: true, data };

    const access = jest
      .spyOn(utils, 'accessAsync')
      .mockImplementation(() => Promise.resolve(undefined));

    const read = jest
      .spyOn(utils, 'readFileAsync')
      .mockImplementation(() => Promise.resolve(data));

    let result = await readIn('fakefile');

    expect(access).toHaveBeenCalled();
    expect(read).toHaveBeenCalled();
    expect(result).toEqual(expected);

    restoreSpys(access, read);
  });

  it('should set access types', async () => {
    const filename = 'fakefile';
    const data = 'medea';
    const expected = { success: true, data };

    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const access = jest
      .spyOn(utils, 'accessAsync')
      .mockImplementation(() => Promise.resolve(undefined));

    const read = jest
      .spyOn(utils, 'readFileAsync')
      .mockImplementation(() => Promise.resolve(data));

    let result = await readIn(filename, { read: true, write: true });

    expect(access).toHaveBeenCalledWith(filename, 6);
    expect(read).toHaveBeenCalled();
    expect(result).toEqual(expected);

    resetSpys(access, read);

    result = await readIn(filename, { read: false, write: true });

    expect(access).toHaveBeenCalledWith(filename, 2);
    expect(read).toHaveBeenCalled();
    expect(result).toEqual({ ...expected, data: undefined });

    resetSpys(access, read);

    result = await readIn(filename, { read: false, write: false });

    expect(access).not.toHaveBeenCalled();
    expect(read).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: new Error('No access type provided.')
    });

    restoreSpys(access, read);
  });

  it('should catch thrown error', async () => {
    const expected = {
      success: false,
      error: new Error('test no access')
    };

    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null);

    const access = jest
      .spyOn(utils, 'accessAsync')
      .mockRejectedValue(new Error('test no access'));

    const read = jest
      .spyOn(utils, 'readFileAsync')
      .mockImplementation(() => Promise.resolve(''));

    let result = await readIn('fakefile');

    expect(consoleError).toHaveBeenCalled();
    expect(access).toHaveBeenCalled();
    expect(read).not.toHaveBeenCalled();
    expect(result).toEqual(expected);

    resetSpys(access, consoleError, read);
    access.mockRejectedValue(new Error('test no access'));

    result = await readIn('fakefile', { shouldLog: false });

    expect(consoleError).not.toHaveBeenCalled();
    expect(access).toHaveBeenCalled();
    expect(read).not.toHaveBeenCalled();
    expect(result).toEqual(expected);

    restoreSpys(access, consoleError, read);
  });
});
