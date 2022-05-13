import { useGLTF } from "@react-three/drei";
import type { SceneProps } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import "framer-motion";
import * as React from "react";
import type { Group, Mesh } from "three";
import * as THREE from "three";
import { MeshPhongMaterial } from "three";

import { useComposedRefs } from "~/lib/useComposedRef";

const material = new MeshPhongMaterial({
  color: "#ffdd00",
  emissive: "#ff9500",
  specular: "#fff",
  shininess: 100,
  transparent: true,
});

function generateRandomFactor() {
  const random = Math.random();
  const randomFactors = [0.5 + Math.random(), 0.25 + Math.random(), 1 + Math.random() - 0.5];
  return randomFactors[Math.floor(random * randomFactors.length)];
}

type StarProps = SceneProps & {
  hoveredProjectId: React.MutableRefObject<string | null>;
  projectId: string;
  initialRotationY: number;
};

export const Star = React.forwardRef<Group, StarProps>(function Star(
  { initialRotationY, hoveredProjectId, projectId, ...props },
  ref,
) {
  const model = useGLTF("/models/star-icon-min.glb") as any;
  const ownRef = React.useRef<Group | null>(null);
  const mesh = React.useRef<Mesh | null>(null);
  const composedRef = useComposedRefs<Group | null>(ref, ownRef);
  const factor = React.useRef(generateRandomFactor());
  const start = React.useRef(Math.random() * 5000);
  const scaleVector = React.useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (mesh.current && ownRef.current) {
      mesh.current.position.y = Math.sin(start.current + state.clock.elapsedTime * 0.1) * 4;
      mesh.current.rotation.x = Math.PI / 2 + (Math.sin(start.current + state.clock.elapsedTime * 0.1) * Math.PI) / 10;
      mesh.current.rotation.y = (Math.sin(start.current + state.clock.elapsedTime * 0.1) * Math.PI) / 2;
      ownRef.current.rotation.y +=
        Math.sin((delta * factor.current) / 2) * Math.cos((delta * factor.current) / 2) * 0.25;
      const projectIsHovered = hoveredProjectId.current !== null;
      const isProjectStar = projectId === hoveredProjectId.current;
      const scale = !projectIsHovered ? 0.25 : isProjectStar ? 0.5 : 0;
      mesh.current.scale.lerp(scaleVector.current.set(scale, scale, scale), 0.1);
      const material = mesh.current.material as MeshPhongMaterial;
      material.opacity = !projectIsHovered || isProjectStar ? 1 : THREE.MathUtils.lerp(1, 0, 0.1);
    }
  });

  return (
    <group dispose={null} ref={composedRef as any} rotation-y={initialRotationY}>
      <scene {...props}>
        <mesh scale={0.25} ref={mesh} geometry={model.nodes.Star.geometry} material={material} />
      </scene>
    </group>
  );
});
