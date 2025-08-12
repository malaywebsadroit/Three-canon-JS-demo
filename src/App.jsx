import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import CannonDebugger from "cannon-es-debugger";
import "./App.css";
import FunctionsModal from "./components/FunctionsModal/FunctionsModal";
import CanvasScene from "./components/CanvasScene";

export default function App() {
  return <CanvasScene />;
}

// export default function App() {
//   const mountRef = useRef(null);
//   const sceneRef = useRef();
//   const cameraRef = useRef();
//   const rendererRef = useRef();
//   const controlsRef = useRef();
//   const sphereRef = useRef();
//   const sphereBodyRef = useRef();
//   const physicWorldRef = useRef();
//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();
//   const animationFunctionCube = useRef([]); // Animation cube
//   let activeOption = null;
//   const objectModifierRef = useRef();
//   const [objectModifier, setObjectModifier] = useState({});
//   const [currentFeature, setCurrentFeature] = useState(null);

//   useEffect(() => {
//     // --- Initialize ---
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 5, 10);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       canvas: mountRef.current,
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     rendererRef.current = renderer;

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controlsRef.current = controls;

//     const world = new CANNON.World({
//       gravity: new CANNON.Vec3(0, -9.82, 0),
//     });
//     physicWorldRef.current = world;

//     // --- Lighting ---
//     const light = new THREE.DirectionalLight(0xffffff, 5);
//     light.position.set(0, 10, 5);
//     scene.add(light);
//     const lightHelper = new THREE.DirectionalLightHelper(light, 5);
//     scene.add(lightHelper);

//     const pointLight = new THREE.PointLight(0xffffff, 2); // soft white light
//     pointLight.position.set(0, 3, 0);
//     scene.add(pointLight);

//     // Cannon debugger
//     // const cannonDebugger = new CannonDebugger(scene, physicWorldRef.current);

//     // --- Ground Mesh ---
//     const ground = new THREE.Mesh(
//       new THREE.PlaneGeometry(100, 100),
//       new THREE.MeshStandardMaterial({
//         color: 0x888888,
//         side: THREE.DoubleSide,
//       })
//     );
//     ground.rotation.x = -Math.PI / 2;
//     ground.receiveShadow = true;
//     scene.add(ground);

//     // --- Ground Physics ---
//     const groundBody = new CANNON.Body({
//       mass: 0,
//       shape: new CANNON.Plane(),
//     });
//     groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
//     // const heightFild = getHeightFild();
//     // groundBody.addShape(heightFild);
//     world.addBody(groundBody);

//     // --- Sphere Mesh ---
//     const sphere = new THREE.Mesh(
//       new THREE.SphereGeometry(1, 32, 32),
//       new THREE.MeshStandardMaterial({ color: 0xffff00 })
//     );
//     sphere.position.set(0, 10, 0);
//     sphere.castShadow = true;
//     scene.add(sphere);
//     sphereRef.current = sphere;

//     // --- Sphere Physics ---
//     const sphereBody = new CANNON.Body({
//       mass: 1,
//       shape: new CANNON.Sphere(1),
//       position: new CANNON.Vec3(0, 10, 0),
//     });
//     world.addBody(sphereBody);
//     sphereBodyRef.current = sphereBody;

//     // --- Resize Handling ---
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener("resize", handleResize);

//     // --- Arrow Key Movement ---
//     const onKeyDown = (e) => {
//       const speed = 5;
//       const body = sphereBodyRef.current;
//       if (!body) return;

//       if (e.key === "ArrowRight") body.velocity.x = speed;
//       if (e.key === "ArrowLeft") body.velocity.x = -speed;
//       if (e.key === "ArrowUp") body.velocity.z = -speed;
//       if (e.key === "ArrowDown") body.velocity.z = speed;
//     };
//     document.addEventListener("keydown", onKeyDown);

//     createQube({ x: 0, y: 2, z: 2, height: 0.1, width: 4, depth: 2, mass: 0 });

//     // --- Animation Loop ---
//     const animate = () => {
//       requestAnimationFrame(animate);

//       world.fixedStep();
//       // cannonDebugger.update();
//       sphere.position.copy(sphereBody.position);
//       animationFunctionCube.current.forEach(({ qube, qubeBody }) => {
//         qube.position.copy(qubeBody.position);
//         // console.log("qubeBody", qubeBody, qube);
//       });
//       // Camera follow
//       // const offset = new THREE.Vector3(0, 2, -6);
//       // const desiredPosition = new THREE.Vector3()
//       //   .copy(sphere.position)
//       //   .add(offset);
//       // camera.position.lerp(desiredPosition, 0.1);
//       // camera.lookAt(sphere.position);

//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     window.addEventListener("click", onClick);

//     // --- Cleanup ---
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       document.removeEventListener("keydown", onKeyDown);
//       window.removeEventListener("click", onClick);
//       controls.dispose();
//       renderer.dispose();
//       animationFunctionCube.current = [];
//       if (mountRef.current) {
//         mountRef.current.removeChild(renderer.domElement);
//         mountRef.current.innerHTML = "";
//       }
//     };
//   }, []);

//   const getHeightFild = () => {
//     const matrix = [];
//     const sizeX = 20;
//     const sizeY = 20;

//     for (let i = 0; i < sizeX; i++) {
//       matrix.push([]);
//       for (let j = 0; j < sizeY; j++) {
//         const height = Math.random() * 10; // or random, Perlin noise, etc.
//         matrix[i].push(height);
//       }
//     }

//     return new CANNON.Heightfield(matrix, {
//       elementSize: 1, // distance between points
//     });
//   };

//   const onClick = (event) => {
//     if (activeOption === null) return null;
//     // Convert mouse position to normalized device coordinates (-1 to +1)
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     raycaster.setFromCamera(mouse, cameraRef.current);

//     // Intersect with objects in the scene
//     const intersects = raycaster.intersectObjects(
//       sceneRef.current.children,
//       true
//     );

//     if (intersects.length > 0) {
//       const hit = intersects[0];
//       switch (activeOption) {
//         case "createQube":
//           console.log(objectModifierRef.current);
//           createQube({
//             ...objectModifierRef.current,
//             x: hit.point.x,
//             y:
//               hit.point.y +
//               (objectModifierRef.current?.y
//                 ? objectModifierRef.current?.y
//                 : 0.5),
//             z: hit.point.z,
//           });
//           break;

//         case "applyForceTowardTarget":
//           const targetVec3 = new CANNON.Vec3(
//             hit.point.x,
//             hit.point.y,
//             hit.point.z
//           );
//           applyForceTowardTarget(sphereBodyRef.current, targetVec3);
//           break;

//         case "throwBall":
//           throwObject(
//             createSphere({
//               x: cameraRef.current.position.x,
//               y: cameraRef.current.position.y,
//               z: cameraRef.current.position.z,
//               radius: 0.5,
//               mass: 0.4,
//             }),
//             10,
//             new CANNON.Vec3(
//               cameraRef.current.position.x,
//               cameraRef.current.position.y,
//               cameraRef.current.position.z
//             ),
//             new CANNON.Vec3(hit.point.x, hit.point.y, hit.point.z)
//           );
//           break;

//         default:
//           break;
//       }
//     }
//   };

//   function applyForceTowardTarget(body, targetVec3, forceMagnitude = 100) {
//     // Calculate direction from the body to the target
//     const forceDirection = new CANNON.Vec3(
//       targetVec3.x - body.position.x,
//       1,
//       targetVec3.z - body.position.z
//     );
//     // Normalize the direction vector
//     forceDirection.normalize();

//     // Scale by desired magnitude
//     const force = forceDirection.scale(body.mass * forceMagnitude);
//     console.log(force, body);

//     // Apply force to the body
//     body.applyForce(force, body.position);
//   }

//   // Create qube using height width with physics body
//   function createQube({ x, y, z, height = 1, width = 1, depth = 1, mass = 1 }) {
//     const qube = new THREE.Mesh(
//       new THREE.BoxGeometry(width, height, depth),
//       new THREE.MeshStandardMaterial()
//     );
//     qube.position.set(x, y, z);
//     sceneRef.current.add(qube);

//     const qubeBody = new CANNON.Body({
//       mass: mass,
//       shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
//       position: new CANNON.Vec3(x, y, z),
//     });
//     physicWorldRef.current.addBody(qubeBody);
//     animationFunctionCube.current.push({
//       qube,
//       qubeBody,
//     });
//   }

//   // Throw function
//   function throwObject(object, force, startPos, destPos) {
//     // 1. Set start position
//     object.position.set(startPos.x, startPos.y, startPos.z);

//     // 2. Calculate direction
//     const direction = new CANNON.Vec3(
//       destPos.x - startPos.x,
//       destPos.y - startPos.y,
//       destPos.z - startPos.z
//     );

//     direction.normalize();

//     // 3. Apply force (impulse)
//     const impulse = direction.scale(force);

//     object.velocity.set(impulse.x, impulse.y, impulse.z);
//   }

//   function createSphere({ x, y, z, radius = 1, mass = 1 }) {
//     const sphere = new THREE.Mesh(
//       new THREE.SphereGeometry(radius, 32, 32),
//       new THREE.MeshStandardMaterial()
//     );
//     sphere.position.set(x, y, z);
//     sceneRef.current.add(sphere);

//     const sphereBody = new CANNON.Body({
//       mass: mass,
//       shape: new CANNON.Sphere(radius),
//       position: new CANNON.Vec3(x, y, z),
//     });
//     physicWorldRef.current.addBody(sphereBody);
//     animationFunctionCube.current.push({
//       qube: sphere,
//       qubeBody: sphereBody,
//     });
//     return sphereBody;
//   }

//   function handelFunctionClick(functionName, event) {
//     // console.log(functionName, functionOptionBTN);
//     const functionOptionBTN = document.body.querySelectorAll(".function-btn");
//     Array.from(functionOptionBTN).forEach((btn) => {
//       btn.classList.remove("active-btn");
//     });
//     if (activeOption === functionName) {
//       activeOption = null;
//       event.target.classList.remove("active-btn");
//       return;
//     }
//     event.target.classList.add("active-btn");
//     activeOption = null;
//     setTimeout(() => {
//       switch (functionName) {
//         case "createQube":
//           setObjectModifier({
//             mass: 10,
//             height: 1,
//             width: 1,
//             depth: 1,
//           });
//           break;

//         default:
//           break;
//       }
//       activeOption = functionName;
//       setCurrentFeature(functionName);
//     }, 500);
//   }

//   function handelModefierForm(event) {
//     let value =
//       event.target.name !== "color"
//         ? Number(event.target.value)
//         : event.target.value;
//     setObjectModifier({
//       ...objectModifier,
//       [event.target.name]: value,
//     });
//     objectModifierRef.current = {
//       ...objectModifier,
//       [event.target.name]: value,
//     };
//   }

//   return (
//     <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
//       <div
//         style={{
//           position: "absolute",
//           margin: "0 auto",
//           display: "flex",
//           gap: "10px",
//           padding: "1rem",
//         }}
//       >
//         <button
//           className="function-btn"
//           type="button"
//           onClick={(event) => handelFunctionClick("createQube", event)}
//         >
//           Create Qube
//         </button>
//         <button
//           className="function-btn"
//           type="button"
//           onClick={(event) => handelFunctionClick("throwBall", event)}
//         >
//           Throw Ball
//         </button>
//         <button
//           className="function-btn"
//           type="button"
//           onClick={(event) =>
//             handelFunctionClick("applyForceTowardTarget", event)
//           }
//         >
//           Apply Force
//         </button>
//       </div>
//       <canvas ref={mountRef} style={{ width: "100%", height: "100%" }} />
//       <FunctionsModal>
//         {currentFeature === "createQube" && (
//           <>
//             <div className="input-con">
//               <label>Height</label>
//               <input
//                 type="number"
//                 name="height"
//                 value={objectModifier.height}
//                 onChange={handelModefierForm}
//               />
//             </div>
//             <div className="input-con">
//               <label>Width</label>
//               <input
//                 name="width"
//                 type="number"
//                 value={objectModifier.width}
//                 onChange={handelModefierForm}
//               />
//             </div>
//             <div className="input-con">
//               <label>Depth</label>
//               <input
//                 name="depth"
//                 type="number"
//                 value={objectModifier.depth}
//                 onChange={handelModefierForm}
//               />
//             </div>
//             <div className="input-con">
//               <label>Mass</label>
//               <input
//                 name="mass"
//                 type="number"
//                 value={objectModifier.mass}
//                 onChange={handelModefierForm}
//               />
//             </div>
//             <div className="input-con">
//               <label>Color</label>
//               <input
//                 color="color"
//                 type="color"
//                 value={objectModifier.color}
//                 onChange={handelModefierForm}
//               />
//             </div>
//           </>
//         )}
//       </FunctionsModal>
//     </div>
//   );
// }
