import { useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import type { Group } from "three";
import { Plane, Raycaster, Vector2, Vector3 } from "three";

import { useComposedRefs } from "~/lib/useComposedRef";

import { Text } from "./Text";

const raycaster = new Raycaster();
const intersectPoint = new Vector3();
const plane = new Plane(new Vector3(0, 0, 1), -10);
const mouse = new Vector2();

export const KaizenText = React.forwardRef(function KaizenText(_, forwardedRef) {
  const ref = React.useRef<Group | null>(null);
  const composedRef = useComposedRefs(ref, forwardedRef);
  const camera = useThree((three) => three.camera);

  React.useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      const pointer = mouse.set(x, y);
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, intersectPoint);
      ref.current?.lookAt(intersectPoint);
    }

    function handleMouseLeave() {
      ref.current?.lookAt(new Vector3(0, 0.5, 10));
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [camera]);

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
