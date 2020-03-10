export function spyCall(
  s: jest.SpyInstance<any, [any?, ...any[]]>,
  i = 0,
  j = 0
) {
  return s.mock.calls[i][j];
}

export function resetSpys(
  ...spys: Array<jest.SpyInstance<any, [any?, ...any[]]>>
) {
  spys.forEach((s) => s.mockReset());
}

export function restoreSpys(
  ...spys: Array<jest.SpyInstance<any, [any?, ...any[]]>>
) {
  spys.forEach((s) => s.mockRestore());
}
