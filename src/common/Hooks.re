let useIsomorphicLayoutEffect0 =
  switch ([%external window]) {
  | Some(_) => React.useLayoutEffect0
  | None => React.useEffect0
  };
