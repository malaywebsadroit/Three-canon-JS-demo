import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "../Hooks/useKeyboardControls";
import { Vector3 } from "three";

export default function Player() {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 2, 0],
    args: [1],
    material: { friction: 0.5, restitution: 0.2 },
  }));

  const keys = useKeyboardControls();
  const velocity = new Vector3();

  api.velocity.subscribe((v) => velocity.fromArray(v));
  useFrame(() => {

    const moveSpeed = 5;
    let direction = new Vector3();

    if (keys["KeyW"]) direction.z -= 1;
    if (keys["KeyS"]) direction.z += 1;
    if (keys["KeyA"]) direction.x -= 1;
    if (keys["KeyD"]) direction.x += 1;

    direction.normalize().multiplyScalar(moveSpeed);
    api.velocity.set(direction.x, velocity.y, direction.z);
  });

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
