import * as React from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Vector3 } from "three";

import { useComposedRefs, useLookAtMouse } from "~/lib/utils";

import { Text } from "./Text";

const originalPosition = new Vector3(0, 0.5, 10);

export const KaizenText = React.forwardRef(function KaizenText(_, forwardedRef) {
  const ref = React.useRef<Group | null>(null);
  const composedRef = useComposedRefs(ref, forwardedRef);

  useLookAtMouse(ref, originalPosition);

  useFrame((state) => {
    const clock = state.clock;
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.getElapsedTime()) * 0.3;
    }
  });

  return (
    <group ref={composedRef} rotation={[0, 0.5, 0]}>
      <Text name="kaizen" castShadow receiveShadow>
        改善
      </Text>
      <Text name="kaizen-roman" castShadow receiveShadow size={0.5} position={[0, -3, 0]}>
        kaizen
      </Text>
    </group>
  );
});
