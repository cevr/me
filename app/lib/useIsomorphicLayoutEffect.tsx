import { useEffect, useLayoutEffect } from "react";

export let useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;