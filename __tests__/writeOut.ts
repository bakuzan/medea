jest.mock('../src/utils');
import { restoreSpys, resetSpys } from './__utils';

import { writeOut } from '../src';
import * as utils from '../src/utils';

describe('writeOut', () => {
  it('should return successfully', async () => {
    const data = 'medea';
    const expected = { success: true };

    const consoleLog = jest
      .spyOn(console, 'log')
      .mockImplementation(() => null);

    const write = jest
      .spyOn(utils, 'writeFileAsync')
      .mockImplementation(() => Promise.resolve());

    let result = await writeOut('fakefile', data);

    expect(write).toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalled();
    expect(result).toEqual(expected);

    resetSpys(consoleLog, write);

    result = await writeOut('fakefile', data, false);

    expect(write).toHaveBeenCalled();
    expect(consoleLog).not.toHaveBeenCalled();
    expect(result).toEqual(expected);

    restoreSpys(consoleLog, write);
  });

  it('should return unsuccessfully', async () => {
    const data = 'medea';
    const expected = { success: false, error: new Error('thrown error') };

    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null);

    const write = jest
      .spyOn(utils, 'writeFileAsync')
      .mockImplementation(() => Promise.reject(new Error('thrown error')));

    let result = await writeOut('fakefile', data);

    expect(write).toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalled();
    expect(result).toEqual(expected);

    resetSpys(consoleError, write);
    write.mockImplementation(() => Promise.reject(new Error('thrown error')));

    result = await writeOut('fakefile', data, false);

    expect(write).toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(result).toEqual(expected);

    restoreSpys(consoleError, write);
  });
});
