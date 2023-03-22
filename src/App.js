import "./styles.css";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import circleImg from "./circle.png";
import * as THREE from "three";
import { useMemo, useRef } from "react";
function Points() {
  const CircleImg = useLoader(THREE.TextureLoader, circleImg);
  const count = 1000; // number point accross one axis ini akan generate point 10.00 dimana count hanya 100 karena multiply
  let positions = useMemo(() => {
    let positions = [];
    for (let zi = 0; zi < count; zi++) {
      const x = Math.random() * 600 - 300;
      const y = Math.random() * 600 - 300;
      const z = Math.random() * 600 - 300;
      positions.push(x, y, z);
    }
    return new Float32Array(positions); //merupakan array yang sesuai dengan buffer
  }, []);

  let posRef = useRef();

  useFrame(() => {
    const positions = posRef.current.array;
    for (let index = 0; index < positions.length; index += 3) {
      positions[index] += 4;
      if (positions[index] > 200) {
        positions[index] = -200;
      }
      posRef.current.needsUpdate = true;
    }
  });
  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          ref={posRef}
          attach="attributes-position" //attribute parameter yang akan dikontrol
          array={positions}
          count={positions.length / 3} //
          itemSize={3} //dikeranakan telah diketahui bahwa tiap arraytype axis akan berisi 3 value pada 1d array
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        map={CircleImg}
        color={0xffffff}
        sizes={0.7}
        sizeAttenuation //merupakan parameter yang menscale object berdasarkan perspective camera
        transparent={false}
        alphaTest={0.5} //merupakan thresshold saat rendering untuk mencega bila opacity dibawah value alphatest
        opacity={1.0}
      />
    </points>
  );
}

function AnimationCanvas() {
  return (
    <Canvas camera={{ position: [100, 10, 0], fov: 75 }}>
      <Suspense fallback={false}>
        <Points />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}

export default function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <AnimationCanvas />
      </Suspense>
    </div>
  );
}
