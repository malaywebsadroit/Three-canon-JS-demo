import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import CannonDebugger from "cannon-es-debugger";

export default function App() {
  const mountRef = useRef(null);
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const sphereRef = useRef();
  const sphereBodyRef = useRef();
  const physicWorldRef = useRef();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  // Animation cube
  const animationFunctionCube = useRef([]);

  useEffect(() => {
    // --- Initialize ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });
    physicWorldRef.current = world;

    // --- Lighting ---
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 5);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff, 2); // soft white light
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // Cannon debugger
    const cannonDebugger = new CannonDebugger(scene, physicWorldRef.current);

    // --- Ground Mesh ---
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({
        color: 0x888888,
        side: THREE.DoubleSide,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- Ground Physics ---
    const groundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    // const heightFild = getHeightFild();
    // groundBody.addShape(heightFild);
    world.addBody(groundBody);

    // --- Sphere Mesh ---
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xffff00 })
    );
    sphere.position.set(0, 10, 0);
    sphere.castShadow = true;
    scene.add(sphere);
    sphereRef.current = sphere;

    // --- Sphere Physics ---
    const sphereBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(1),
      position: new CANNON.Vec3(0, 10, 0),
    });
    world.addBody(sphereBody);
    sphereBodyRef.current = sphereBody;

    // --- Resize Handling ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- Arrow Key Movement ---
    const onKeyDown = (e) => {
      const speed = 5;
      const body = sphereBodyRef.current;
      if (!body) return;

      if (e.key === "ArrowRight") body.velocity.x = speed;
      if (e.key === "ArrowLeft") body.velocity.x = -speed;
      if (e.key === "ArrowUp") body.velocity.z = -speed;
      if (e.key === "ArrowDown") body.velocity.z = speed;
    };
    document.addEventListener("keydown", onKeyDown);

    for (let i = 0; i < 10; i++) {
      createQube(i * 3, 0, 0, 2, 2, 2);
      // console.log("animationFunctionCube", animationFunctionCube.current);
    }

    //
    const plainAbove = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 0.2),
      new THREE.MeshStandardMaterial({
        color: "#0ae023ff",
        side: THREE.DoubleSide,
      })
    );

    plainAbove.position.set(0, 4, 0);
    plainAbove.rotation.x = -Math.PI / 2;
    plainAbove.receiveShadow = true;
    scene.add(plainAbove);

    const plainAboveBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 4, 0),
      shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.1)),
    });
    plainAboveBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(plainAboveBody);

    // --- Animation Loop ---
    const animate = () => {
      requestAnimationFrame(animate);

      world.fixedStep();
      cannonDebugger.update();
      sphere.position.copy(sphereBody.position);
      animationFunctionCube.current.forEach(({ qube, qubeBody }) => {
        qube.position.copy(qubeBody.position);
        // console.log("qubeBody", qubeBody, qube);
      });
      // Camera follow
      // const offset = new THREE.Vector3(0, 2, -6);
      // const desiredPosition = new THREE.Vector3()
      //   .copy(sphere.position)
      //   .add(offset);
      // camera.position.lerp(desiredPosition, 0.1);
      // camera.lookAt(sphere.position);

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("click", onClick);

    // --- Cleanup ---
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
      controls.dispose();
      renderer.dispose();
      animationFunctionCube.current = [];
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        mountRef.current.innerHTML = "";
      }
    };
  }, []);

  const getHeightFild = () => {
    const matrix = [];
    const sizeX = 20;
    const sizeY = 20;

    for (let i = 0; i < sizeX; i++) {
      matrix.push([]);
      for (let j = 0; j < sizeY; j++) {
        const height = Math.random() * 10; // or random, Perlin noise, etc.
        matrix[i].push(height);
      }
    }

    return new CANNON.Heightfield(matrix, {
      elementSize: 1, // distance between points
    });
  };

  const onClick = (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef.current);

    // Intersect with objects in the scene
    const intersects = raycaster.intersectObjects(
      sceneRef.current.children,
      true
    );

    if (intersects.length > 0) {
      const hit = intersects[0];
      console.log("Clicked object:", hit.object);
      console.log("3D point clicked:", hit.point); // Vector3

      const targetVec3 = new CANNON.Vec3(hit.point.x, hit.point.y, hit.point.z);
      // applyForceTowardTarget(sphereBodyRef.current, targetVec3);
      createQube({ mass: 1, x: hit.point.x, y: hit.point.y + 0.5, z: hit.point.z, height: 1, width: 1, depth: 1 });
    }
  };

  function applyForceTowardTarget(body, targetVec3, forceMagnitude = 100) {
    // Calculate direction from the body to the target
    const forceDirection = new CANNON.Vec3(
      targetVec3.x - body.position.x,
      1,
      targetVec3.z - body.position.z
    );
    // Normalize the direction vector
    forceDirection.normalize();

    // Scale by desired magnitude
    const force = forceDirection.scale(body.mass * forceMagnitude);
    console.log(force, body);

    // Apply force to the body
    body.applyForce(force, body.position);
  }

  // Create qube using height width with physics body
  function createQube({ x, y, z, height = 1, width = 1, depth = 1, mass = 1 }) {
    const qube = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshNormalMaterial()
    );
    qube.position.set(x, y, z);
    sceneRef.current.add(qube);

    const qubeBody = new CANNON.Body({
      mass: mass,
      shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
      position: new CANNON.Vec3(x, y, z),
    });
    physicWorldRef.current.addBody(qubeBody);
    animationFunctionCube.current.push({
      qube,
      qubeBody,
    });
  }

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
