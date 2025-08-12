import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import Ground from "./Ground";
import Player from "./Player";

export default function CanvasScene() {
  return (
    <div className="h-[90vh] w-[90vw] mt-[5vh] ml-[5vh]">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 90 }}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          castShadow
          position={[10, 10, 5]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Sky sunPosition={[100, 20, 100]} />
        <OrbitControls />

        {/* Physics World */}
        <Physics gravity={[0, -9.82, 0]}>
          <Ground />
          <Player />
        </Physics>
      </Canvas>
    </div>
  );
}
