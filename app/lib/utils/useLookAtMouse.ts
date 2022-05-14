import { useThree } from "@react-three/fiber";
import * as React from "react";
import type { Group } from "three";
import { Plane, Raycaster, Vector2, Vector3 } from "three";
const raycaster = new Raycaster();
const intersectPoint = new Vector3();
const plane = new Plane(new Vector3(0, 0, 1), -10);
const mouse = new Vector2();

export function useLookAtMouse(ref: React.RefObject<Group>, originalPosition: Vector3) {
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
      ref.current?.lookAt(originalPosition);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera]);
}
