/* Real Poly Haven PBR model + React Three Fiber / Rapier rope physics.
   Interaction approach follows the Bubarando Services/Lanyard component. */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";

/* CC0 model by Bhargav Kubal, published at
   https://polyhaven.com/a/brass_diya_lantern
   Direct GLB mirror: https://www.innerscene.com/tools/library/3d-parts/brass-diya-lantern-5bcf5825
   The asset is remote rather than embedded in the JavaScript bundle. */
const MODEL_URL =
  "https://files.innerscene.com/library/brass-diya-lantern-5bcf5825/847983add09e9aa080a4/polyhaven-brass-diya-lantern.glb";

const UP = new THREE.Vector3(0, 1, 0);
const WORLD_PLANE_NORMAL = new THREE.Vector3(0, 0, 1);

function LightingEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room);
    const previous = scene.environment;
    scene.environment = environment.texture;

    return () => {
      scene.environment = previous;
      environment.dispose();
      generator.dispose();
      room.dispose();
    };
  }, [gl, scene]);

  return null;
}

function LanternModel({ onModelReady }) {
  const gltf = useGLTF(MODEL_URL);
  const instance = useMemo(() => {
    const model = gltf.scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(model);
    const dimensions = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = dimensions.y > 0 ? 2.25 / dimensions.y : 1;

    model.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = false;
        object.receiveShadow = false;
      }
    });

    return {
      model,
      scale,
      position: [-center.x * scale, -center.y * scale, -center.z * scale],
    };
  }, [gltf.scene]);

  useEffect(() => {
    onModelReady?.();
  }, [onModelReady]);

  return (
    <group scale={instance.scale} position={instance.position}>
      <primitive object={instance.model} />
    </group>
  );
}

function setRodBetween(mesh, first, second) {
  if (!mesh) return;

  const direction = new THREE.Vector3().subVectors(second, first);
  const length = direction.length();
  if (length < 0.001) return;

  mesh.position.copy(first).addScaledVector(direction, 0.5);
  mesh.quaternion.setFromUnitVectors(UP, direction.normalize());
  mesh.scale.set(1, length, 1);
}

function GoldenLink({ rodRef }) {
  return (
    <mesh ref={rodRef}>
      <cylinderGeometry args={[0.012, 0.012, 1, 7]} />
      <meshStandardMaterial color="#d6ab4b" metalness={0.91} roughness={0.24} />
    </mesh>
  );
}

function SuspendedLantern({ onModelReady, reducedMotion }) {
  const fixed = useRef(null);
  const first = useRef(null);
  const second = useRef(null);
  const lantern = useRef(null);
  const rope1 = useRef(null);
  const rope2 = useRef(null);
  const rope3 = useRef(null);
  const dragging = useRef(null);
  const [isDragged, setIsDragged] = useState(false);
  const { gl, camera } = useThree();

  const plane = useMemo(() => new THREE.Plane(WORLD_PLANE_NORMAL, 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const rigidBodyProps = {
    colliders: false,
    canSleep: true,
    angularDamping: 2.5,
    linearDamping: 1.5,
  };

  useRopeJoint(fixed, first, [[0, 0, 0], [0, 0, 0], 0.54]);
  useRopeJoint(first, second, [[0, 0, 0], [0, 0, 0], 0.52]);
  useSphericalJoint(second, lantern, [[0, 0, 0], [0, 1.12, 0]]);

  const endDrag = useCallback((event) => {
    if (event?.target?.hasPointerCapture?.(event.pointerId)) {
      event.target.releasePointerCapture(event.pointerId);
    }
    dragging.current = null;
    setIsDragged(false);
    gl.domElement.style.cursor = "auto";
    if (lantern.current && !reducedMotion) {
      lantern.current.applyImpulse({ x: 0.15, y: 0, z: 0.08 }, true);
    }
  }, [gl, reducedMotion]);

  useEffect(() => {
    return () => {
      gl.domElement.style.cursor = "auto";
    };
  }, [gl]);

  useFrame((state) => {
    if (!fixed.current || !first.current || !second.current || !lantern.current) return;

    const p0 = fixed.current.translation();
    const p1 = first.current.translation();
    const p2 = second.current.translation();
    const p3 = lantern.current.translation();
    const q = lantern.current.rotation();

    const fixedPoint = new THREE.Vector3(p0.x, p0.y, p0.z);
    const a = new THREE.Vector3(p1.x, p1.y, p1.z);
    const b = new THREE.Vector3(p2.x, p2.y, p2.z);
    const top = new THREE.Vector3(0, 1.12, 0)
      .applyQuaternion(new THREE.Quaternion(q.x, q.y, q.z, q.w))
      .add(new THREE.Vector3(p3.x, p3.y, p3.z));

    setRodBetween(rope1.current, fixedPoint, a);
    setRodBetween(rope2.current, a, b);
    setRodBetween(rope3.current, b, top);

    if (dragging.current && isDragged) {
      raycaster.setFromCamera(state.pointer, camera);
      plane.constant = -dragging.current.z;
      if (raycaster.ray.intersectPlane(plane, hit)) {
        lantern.current.setNextKinematicTranslation({
          x: THREE.MathUtils.clamp(hit.x + dragging.current.offsetX, -2.0, 2.0),
          y: THREE.MathUtils.clamp(hit.y + dragging.current.offsetY, -1.7, 1.55),
          z: dragging.current.z,
        });
      }
    }
  });

  return (
    <>
      <RigidBody ref={fixed} type="fixed" colliders={false} position={[0, 2.5, 0]} />
      <RigidBody ref={first} {...rigidBodyProps} position={[0, 1.97, 0]}>
        <BallCollider args={[0.035]} />
      </RigidBody>
      <RigidBody ref={second} {...rigidBodyProps} position={[0, 1.47, 0]}>
        <BallCollider args={[0.035]} />
      </RigidBody>
      <GoldenLink rodRef={rope1} />
      <GoldenLink rodRef={rope2} />
      <GoldenLink rodRef={rope3} />

      <RigidBody
        ref={lantern}
        {...rigidBodyProps}
        position={[0, 0.35, 0]}
        type={isDragged ? "kinematicPosition" : "dynamic"}
        mass={0.9}
      >
        <CuboidCollider args={[0.28, 0.84, 0.28]} />
        <group
          onPointerOver={(event) => {
            event.stopPropagation();
            gl.domElement.style.cursor = isDragged ? "grabbing" : "grab";
          }}
          onPointerOut={() => {
            if (!dragging.current) gl.domElement.style.cursor = "auto";
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
            event.target.setPointerCapture(event.pointerId);
            const pos = lantern.current.translation();
            dragging.current = {
              offsetX: pos.x - event.point.x,
              offsetY: pos.y - event.point.y,
              z: pos.z,
            };
            setIsDragged(true);
            gl.domElement.style.cursor = "grabbing";
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <LanternModel onModelReady={onModelReady} />
        </group>
      </RigidBody>
    </>
  );
}

export default function HangingLanternScene({ onModelReady, reducedMotion }) {
  const onReady = useCallback(() => onModelReady?.(), [onModelReady]);

  return (
    <div className="sib-lantern-webgl">
      <Canvas
        camera={{ position: [0, 0.25, 7.4], fov: 35, near: 0.1, far: 50 }}
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <LightingEnvironment />
        <ambientLight intensity={1.4} />
        <hemisphereLight args={["#ffeed4", "#807456", 2]} />
        <directionalLight position={[2.8, 4.2, 5]} intensity={3.2} color="#fff5d9" />
        <directionalLight position={[-3, 1.5, -2]} intensity={1.5} color="#f6c770" />
        <pointLight position={[0, 0.4, 2]} intensity={12} distance={5.5} decay={2} color="#ffcb68" />
        <Physics gravity={reducedMotion ? [0, 0, 0] : [0, -13, 0]} timeStep={1 / 60}>
          <SuspendedLantern onModelReady={onReady} reducedMotion={reducedMotion} />
        </Physics>
      </Canvas>
    </div>
  );
}
