import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Sphere, MeshDistortMaterial, Stars } from "@react-three/drei";
import { Suspense } from "react";

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#22c55e" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#0ea5e9" />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
            <Sphere args={[1, 64, 64]} position={[2, 0, 0]} scale={1.2}>
              <MeshDistortMaterial
                color="#22c55e"
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.2}
                metalness={0.8}
                wireframe={true}
              />
            </Sphere>
          </Float>

          <Float speed={2} rotationIntensity={2} floatIntensity={1}>
            <Sphere args={[1, 32, 32]} position={[-2.5, 1, -2]} scale={0.8}>
              <MeshDistortMaterial
                color="#0ea5e9"
                attach="material"
                distort={0.3}
                speed={1.5}
                roughness={0.5}
                metalness={0.5}
                opacity={0.6}
                transparent
              />
            </Sphere>
          </Float>

          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
