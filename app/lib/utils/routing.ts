export function addToSearchParams(searchParams: URLSearchParams, params: Record<string, string> | [string, string][]) {
  const newSearchParams = new URLSearchParams(searchParams);
  if (Array.isArray(params)) {
    params.forEach(([key, value]) => {
      newSearchParams.set(key, value);
    });
  }
  Object.entries(params).forEach(([key, value]) => {
    newSearchParams.set(key, value);
  });
  return newSearchParams;
}
