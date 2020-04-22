import { spyCall } from './__utils';

import { createClient } from '../src';

const output = {
  _: [],
  help: true,
  two: true,
  m: 'hello'
};

jest.mock('minimist', () => {
  return jest.fn((v: string[], o) => {
    if (o) {
      return v.reduce((p, c) => ({ ...p, [c]: true }), {});
    }

    return v.length ? output : { _: [] };
  });
});

describe('createClient', () => {
  const validateSpy = jest.fn();
  const consoleSpy = jest.spyOn(console, 'log');

  const NAME = 'Medea';
  const values = ['', '', 'help', 'two', 'm'];
  let cli = createClient(NAME);

  beforeEach(() => {
    cli = createClient(NAME)
      .addOption({
        option: 'help',
        shortcut: 'h',
        description: 'Display the help text'
      })
      .addOption({
        option: 'two',
        shortcut: 't',
        description: 'The second option',
        validate: validateSpy
      })
      .addOption({
        option: 'final',
        shortcut: '',
        description: 'The final option'
      })
      .addOption({
        option: 'medea',
        shortcut: 'm',
        description: 'test option'
      });

    consoleSpy.mockReset();
    validateSpy.mockReset();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('should return name', () => {
    expect(cli.getClientName()).toEqual(NAME);
  });

  it('should have stored options map', () => {
    expect(cli.getOptions() instanceof Map).toBeTruthy();
  });

  it('should have stored option', () => {
    cli.addOption({ option: 'test', description: 'yo' });

    expect(cli.getOptions().get('test')).toEqual({
      option: 'test',
      description: 'yo'
    });
  });

  it('should call console.log with formatted welcome string', () => {
    cli.welcome();

    expect(consoleSpy).toHaveBeenCalled();
    expect(spyCall(consoleSpy).includes(NAME)).toBeTruthy();
  });

  it('should call console.log with formatted welcome string (windowColumns provided)', () => {
    const med = createClient('test', { windowColumns: 25 });
    med.welcome();

    expect(consoleSpy).toHaveBeenCalled();
    expect(spyCall(consoleSpy).includes('test')).toBeTruthy();
  });

  it('should call console.log for each option in logged options', () => {
    cli.log('two');
    expect(consoleSpy).toHaveBeenCalledTimes(3);

    consoleSpy.mockReset();

    cli.log('two', ['shortcut', 'option']);
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(spyCall(consoleSpy, 0, 1)).toEqual('two');
  });

  it('should not call console.log when key does not exist', () => {
    cli.log('JEST');
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should call console.log for each option plus format lines', () => {
    cli.helpText();

    const len = cli.getOptions().size;

    const helpTextLogs = 5;
    const logLogs = (3 + 1) * len;

    expect(consoleSpy).toHaveBeenCalledTimes(helpTextLogs + logLogs);
  });

  it('should call console.log for each option plus format lines (windowColumns provided)', () => {
    const med = createClient('test', { windowColumns: 25 })
      .addOption({ option: 'one', description: 'test' })
      .addOption({ option: 'two', description: 'test' });

    med.helpText();

    const len = med.getOptions().size;

    const helpTextLogs = 5;
    const logLogs = (2 + 1) * len;

    expect(consoleSpy).toHaveBeenCalledTimes(helpTextLogs + logLogs);
  });

  it('should throw error if key does not exist', () => {
    expect(() => cli.validate('jest')).toThrow();
  });

  it('should return true if no validate to call', () => {
    const result = cli.validate('help');

    expect(result).toBeTruthy();
  });

  it('should call validate with data', () => {
    const data = 'somedata';
    const option = {
      option: 'zim',
      shortcut: 'z',
      description: 'zim option',
      validate: validateSpy.mockReturnValue(true)
    };

    cli.addOption(option);

    const result = cli.validate('zim', data);

    expect(validateSpy).toHaveBeenCalledWith(option, undefined, data);
    expect(result).toBe(true);
  });

  it('should store parsed args', () => {
    const result = cli.parse(values);

    expect(result.getArgs()).toEqual(output);
  });

  it('should check if any args are stored', () => {
    expect(cli.parse([]).any()).toEqual(false);
    expect(cli.parse(values).any()).toEqual(true);
  });

  it('should check if key exists', () => {
    const args = cli.parse(values);

    expect(args.has('two')).toEqual(true);
    expect(args.has('medea')).toEqual(true);
    expect(() => args.has('jester')).toThrow();
  });

  it('should check if key exists (no shortcut)', () => {
    jest.mock('minimist', () => ({ medea: true }));

    const med = createClient('test').addOption({
      option: 'medea',
      description: 'testing'
    });

    med.parse(['', '', 'medea'], {});

    expect(med.has('medea')).toEqual(true);
    expect(() => med.has('jest')).toThrow();
  });

  it('should return values', () => {
    const args = cli.parse(values);

    expect(args.get()).toEqual(output);
  });

  it('should return value of key', () => {
    const args = cli.parse(values);

    expect(args.get('two')).toEqual(true);
    expect(args.get('medea')).toEqual('hello');
    expect(args.get('jester')).toEqual(undefined);
  });

  it('should return value of key (no shortcut)', () => {
    const med = createClient('test').addOption({
      option: 'medea',
      description: 'testing'
    });

    med.parse(['', '', 'medea'], {});

    expect(med.get('medea')).toEqual(true);
    expect(med.get('jest')).toEqual(undefined);
  });

  it('should return empty array when no required options ', () => {
    expect(cli.missingRequiredOptions()).toEqual([]);
  });

  it('should return empty array when no missing required options ', () => {
    const med = createClient('test')
      .addOption({
        option: 'two',
        description: 'testing required',
        required: true
      })
      .addOption({
        option: 'medea',
        shortcut: 'm',
        description: 'testing required',
        required: () => true
      });

    med.parse(['', '', 'two', 'medea'], {});

    expect(med.missingRequiredOptions()).toEqual([]);
  });

  it('should return empty array when no missing required options (shortcut)', () => {
    const med = createClient('test').addOption({
      option: 'medea',
      shortcut: 'm',
      description: 'testing required',
      required: () => true
    });

    med.parse(['', '', 'two', 'm'], {});

    expect(med.missingRequiredOptions()).toEqual([]);
  });

  it('should return missing required options ', () => {
    const requiredOption = {
      option: 'required',
      description: 'testing required',
      required: true
    };

    cli.addOption(requiredOption);

    expect(cli.missingRequiredOptions()).toEqual([requiredOption]);
  });
});
