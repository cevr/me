import { Html, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as React from 'react';
import type { Group } from 'three';

import { KaizenText } from './KaizenText';
import { Star } from './Star';

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'sm' | 'md' | 'lg'>('lg');
  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setBreakpoint('sm');
      } else if (window.innerWidth < 768) {
        setBreakpoint('md');
      } else {
        setBreakpoint('lg');
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return breakpoint;
}

type KaizenCanvasProps = {
  stars: {
    projectId: string;
    id: string;
  }[];
  hoveredProjectId: React.MutableRefObject<string | null>;
};

export function KaizenCanvas({ stars, hoveredProjectId }: KaizenCanvasProps) {
  let [textRef, setTextRef] = React.useState<Group | null>(null);
  const breakpoint = useBreakpoint();

  return (
    <Canvas
      camera={{ position: [0, 0, 15] }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      <Stars />

      <ambientLight
        intensity={1}
        color="#fababa"
      />
      {breakpoint !== 'sm' ? (
        <React.Suspense fallback={<Progress />}>
          <group position={[-6, 1, 0]}>
            {textRef && (
              <directionalLight
                intensity={2}
                target={textRef}
              />
            )}
            <pointLight
              intensity={1}
              position={[0, 1, 2]}
            />
            <KaizenText ref={setTextRef} />
            {stars.map((star) => (
              <StarInitializer
                star={star}
                key={star.id}
                hoveredProjectId={hoveredProjectId}
              />
            ))}
          </group>
        </React.Suspense>
      ) : null}
    </Canvas>
  );
}

function Progress() {
  return (
    <Html
      center
      position={[-6, 0, 0]}
    >
      <motion.div
        className="size-12 rounded-[50%] border-8 border-gray-600 border-t-[salmon]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
    </Html>
  );
}

type StarInitializerProps = {
  star: {
    projectId: string;
    id: string;
  };
  hoveredProjectId: React.MutableRefObject<string | null>;
};

function StarInitializer({ star, hoveredProjectId }: StarInitializerProps) {
  const props = React.useRef({
    x: (4 + Math.random() * 8) * (Math.round(Math.random()) ? -1 : 1),
    y: -2 + Math.random() * 4,
    z: -0.25 + Math.random() * 1,
    rotationY: Math.random() * Math.PI * 2,
  });
  const { x, y, z, rotationY } = props.current;

  return (
    <Star
      position={[x, y, z]}
      rotation={[0, x > 0 ? Math.PI : 0, 0]}
      hoveredProjectId={hoveredProjectId}
      projectId={star.projectId}
      initialRotationY={rotationY}
    />
  );
}
