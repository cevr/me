import type { ReactThreeFiber } from '@react-three/fiber';
import type { TextGeometry } from 'three-stdlib';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: ReactThreeFiber.Object3DNode<
        TextGeometry,
        typeof TextGeometry
      >;
    }
  }
}
