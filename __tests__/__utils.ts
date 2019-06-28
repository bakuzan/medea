export function spyCall(
  s: jest.SpyInstance<any, [any?, ...any[]]>,
  i = 0,
  j = 0
) {
  return s.mock.calls[i][j];
}

export function spyResult(s: jest.SpyInstance<any, [any?, ...any[]]>, i = 0) {
  console.log(s.mock.results);
  return s.mock.results[i].value;
}
