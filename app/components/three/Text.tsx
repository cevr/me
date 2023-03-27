import type { GroupProps } from "@react-three/fiber";
import { extend, useLoader } from "@react-three/fiber";
import * as React from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import { FontLoader, TextGeometry } from "three-stdlib";

type TextProps = {
  children: string;
  vAlign?: "center" | "top";
  hAlign?: "center" | "right";
  size?: number;
  color?: string;
} & GroupProps;

export function Text({
  children,
  vAlign = "center",
  hAlign = "center",
  size = 1.5,
  color = "#000000",
  ...props
}: TextProps) {
  extend({ TextGeometry });
  const font = useLoader(FontLoader as any, "/fonts/yahei.json");
  const config = React.useMemo(
    () => ({
      font,
      size: 16,
      height: 6,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 16,
    }),
    [font],
  );
  const mesh = React.useRef<Mesh | null>(null);

  React.useLayoutEffect(() => {
    const size = new THREE.Vector3();
    if (mesh.current) {
      mesh.current.geometry.computeBoundingBox();
      mesh.current.geometry.boundingBox!.getSize(size);
      mesh.current.position.x = hAlign === "center" ? -size.x / 2 : hAlign === "right" ? 0 : -size.x;
      mesh.current.position.y = vAlign === "center" ? -size.y / 2 : vAlign === "top" ? 0 : -size.y;
    }
  }, [children, hAlign, vAlign]);

  return (
    <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry args={[children, config]} />
        <meshStandardMaterial color="salmon" />
      </mesh>
    </group>
  );
}
