"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, Sparkles, useFBX, Center } from "@react-three/drei";
import * as THREE from "three";

const GOLD = "#d9b779";
const WALNUT = "#6b4226";

/**
 * The source FBX (public/models/computer-desk.fbx) has no usable
 * material/texture links — its parts are just unnamed boxes plus one
 * "Semi_Transparent" mesh. Rather than a wood texture (none is wired up in
 * the file), each part gets a brand-palette material chosen by its shape:
 * long/thin boxes read as legs or frame -> gold metal; bulkier boxes read
 * as panels/top -> walnut. The transparent mesh gets a light glass look.
 */
function brandMaterialFor(mesh: THREE.Mesh): THREE.Material {
  if (mesh.name === "Semi_Transparent") {
    return new THREE.MeshPhysicalMaterial({
      color: "#dfe7ea",
      transparent: true,
      opacity: 0.35,
      roughness: 0.08,
      metalness: 0,
    });
  }

  mesh.geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  mesh.geometry.boundingBox!.getSize(size);
  const dims = [size.x, size.y, size.z].sort((a, b) => a - b);
  const isLegLike = dims[0] > 0 && dims[2] / dims[0] > 6;

  return new THREE.MeshStandardMaterial({
    color: isLegLike ? GOLD : WALNUT,
    roughness: isLegLike ? 0.3 : 0.45,
    metalness: isLegLike ? 0.85 : 0.08,
    emissive: isLegLike ? GOLD : "#000000",
    emissiveIntensity: isLegLike ? 0.06 : 0,
  });
}

function DeskModel() {
  const fbx = useFBX("/models/computer-desk.fbx");

  const model = useMemo(() => {
    fbx.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = brandMaterialFor(child as THREE.Mesh);
      }
    });
    return fbx;
  }, [fbx]);

  return (
    <Center>
      <primitive object={model} scale={0.022} rotation={[0.04, 0.55, 0]} />
    </Center>
  );
}

function AccentRing() {
  return (
    <Float speed={1.3} rotationIntensity={0.6} floatIntensity={1.3}>
      <mesh position={[1.9, -0.85, 1]} rotation={[1.2, 0.3, 0]}>
        <torusGeometry args={[0.28, 0.045, 24, 64]} />
        <meshStandardMaterial
          color={GOLD}
          roughness={0.2}
          metalness={0.9}
          emissive={GOLD}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

/** Rendered inside <Canvas> — holds the slow ambient rotation/sway. */
function SceneContents({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || reduceMotion) return;
    g.rotation.y += delta * 0.08;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.5}>
        <Suspense fallback={null}>
          <DeskModel />
        </Suspense>
      </Float>
      <AccentRing />
    </group>
  );
}

export function ShowroomScene() {
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.3, 6.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.5} color="#fff4e0" />
      <directionalLight position={[-4, -1, -3]} intensity={0.35} color={GOLD} />
      <pointLight position={[0, -1, 4]} intensity={0.4} color={GOLD} />

      <SceneContents reduceMotion={reduceMotion} />

      {!reduceMotion && (
        <Sparkles count={36} scale={[6, 4, 4]} size={2} speed={0.25} opacity={0.3} color={GOLD} />
      )}

      <ContactShadows position={[0, -1.7, 0]} opacity={0.4} scale={9} blur={2.6} far={3} color="#000000" />
    </Canvas>
  );
}
