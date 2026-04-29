import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Float, Line, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

type Pointer = {
  x: number
  y: number
}

type VolcanoSceneProps = {
  progress: number
  pointer: Pointer
}

const rackPositions = [
  [-3.3, -0.55, -1.35],
  [-2.75, -0.55, -1.05],
  [-2.2, -0.55, -0.75],
  [2.15, -0.55, -1.1],
  [2.72, -0.55, -0.82],
  [3.28, -0.55, -0.54],
]

const sensorNodes = [
  [-4.6, -0.7, 1.1],
  [-3.6, -0.66, 2.05],
  [-2.2, -0.63, 1.72],
  [2.25, -0.63, 1.9],
  [3.75, -0.68, 1.42],
  [4.7, -0.72, 0.58],
]

function CameraRig({ progress, pointer }: VolcanoSceneProps) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())

  useFrame(() => {
    const scroll = THREE.MathUtils.clamp(progress, 0, 1)
    const phase = scroll < 0.38 ? scroll / 0.38 : (scroll - 0.38) / 0.62
    const first = new THREE.Vector3(0, 1.5, 7.6)
    const second = new THREE.Vector3(2.9, 1.05, 5.3)
    const third = new THREE.Vector3(-3.15, 1.9, 5.8)
    const lookA = new THREE.Vector3(0, 0.1, 0)
    const lookB = new THREE.Vector3(0.45, -0.08, -0.18)
    const lookC = new THREE.Vector3(-0.15, -0.03, 0.2)

    if (scroll < 0.38) {
      target.current.copy(first).lerp(second, phase)
      targetLook.current.copy(lookA).lerp(lookB, phase)
    } else {
      target.current.copy(second).lerp(third, THREE.MathUtils.clamp(phase, 0, 1))
      targetLook.current.copy(lookB).lerp(lookC, THREE.MathUtils.clamp(phase, 0, 1))
    }

    target.current.x += pointer.x * 0.23
    target.current.y += pointer.y * -0.12
    targetLook.current.x += pointer.x * 0.08
    targetLook.current.y += pointer.y * -0.04

    camera.position.lerp(target.current, 0.045)
    camera.lookAt(targetLook.current)
  })

  return null
}

function Terrain() {
  const ground = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ground.current) return
    ground.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.012
  })

  return (
    <group>
      <mesh ref={ground} position={[0, -0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6.4, 96]} />
        <meshStandardMaterial
          color="#141814"
          roughness={0.96}
          metalness={0.1}
          emissive="#1d2d16"
          emissiveIntensity={0.22}
        />
      </mesh>
      <mesh position={[0, -0.12, 0]} rotation={[0, 0.12, 0]}>
        <coneGeometry args={[2.25, 2.35, 112, 8, true]} />
        <meshStandardMaterial
          color="#20221c"
          roughness={0.86}
          metalness={0.04}
          emissive="#281006"
          emissiveIntensity={0.42}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.12, 18, 112]} />
        <meshStandardMaterial
          color="#342a20"
          roughness={0.74}
          emissive="#ff6a1b"
          emissiveIntensity={0.95}
        />
      </mesh>
      <mesh position={[0, 0.97, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.52, 0.42, 0.07, 80]} />
        <meshStandardMaterial
          color="#ff9b2b"
          emissive="#ff5f1f"
          emissiveIntensity={3.1}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <pointLight color="#ff7a2f" intensity={22} distance={6.5} decay={2.2} />
      </mesh>
    </group>
  )
}

function LavaPulse() {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = time * 0.23
      group.current.scale.setScalar(1 + Math.sin(time * 1.8) * 0.035)
    }
    if (ring.current) {
      const scale = 1.08 + Math.sin(time * 1.45) * 0.22
      ring.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group ref={group}>
      <mesh ref={ring} position={[0, 0.94, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.01, 8, 128]} />
        <meshBasicMaterial color="#f7ff8a" transparent opacity={0.34} />
      </mesh>
      <Sparkles
        count={80}
        speed={0.45}
        scale={[2.1, 1.8, 2.1]}
        size={2.6}
        color="#ffb756"
        position={[0, 1.18, 0]}
      />
    </group>
  )
}

function GpuRacks() {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.children.forEach((child, index) => {
      child.position.y = -0.52 + Math.sin(clock.elapsedTime * 1.2 + index) * 0.035
    })
  })

  return (
    <group ref={group}>
      {rackPositions.map(([x, y, z], index) => (
        <group key={`${x}-${z}`} position={[x, y, z]} rotation={[0, index < 3 ? -0.45 : 0.42, 0]}>
          <mesh>
            <boxGeometry args={[0.44, 1.16, 0.28]} />
            <meshStandardMaterial
              color="#1b231e"
              roughness={0.42}
              metalness={0.5}
              emissive="#122b18"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[0, 0.03, -0.148]}>
            <boxGeometry args={[0.32, 0.78, 0.018]} />
            <meshStandardMaterial color="#bce85a" emissive="#9ddc36" emissiveIntensity={1.6} />
          </mesh>
          <mesh position={[0, -0.47, -0.17]}>
            <boxGeometry args={[0.36, 0.03, 0.03]} />
            <meshBasicMaterial color={index % 2 ? '#ff9a45' : '#d8f86f'} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function SensorGrid() {
  return (
    <group>
      {sensorNodes.map(([x, y, z], index) => (
        <group key={`${x}-${z}`} position={[x, y, z]}>
          <Float speed={1.4 + index * 0.08} rotationIntensity={0.16} floatIntensity={0.18}>
            <mesh>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial
                color="#d7f86d"
                emissive="#9edb39"
                emissiveIntensity={2.4}
                roughness={0.36}
              />
            </mesh>
          </Float>
        </group>
      ))}
      {sensorNodes.map((node, index) => {
        const next = sensorNodes[(index + 1) % sensorNodes.length]
        return (
          <Line
            key={`${node[0]}-${next[0]}`}
            points={[node as [number, number, number], next as [number, number, number]]}
            color="#b9e85b"
            transparent
            opacity={0.22}
            lineWidth={1}
          />
        )
      })}
      {sensorNodes.map((node, index) => (
        <Line
          key={`hub-${index}`}
          points={[node as [number, number, number], [0, 0.9, 0]]}
          color={index % 2 ? '#ff9f4a' : '#b9e85b'}
          transparent
          opacity={0.12}
          lineWidth={1}
        />
      ))}
    </group>
  )
}

function Atmosphere() {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = 420
    const values = new Float32Array(count * 3)
    const pseudo = (seed: number, salt: number) => {
      const raw = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453
      return raw - Math.floor(raw)
    }

    for (let i = 0; i < count; i += 1) {
      const radius = 2.1 + pseudo(i, 1) * 5.1
      const angle = pseudo(i, 2) * Math.PI * 2
      values[i * 3] = Math.cos(angle) * radius
      values[i * 3 + 1] = -0.6 + pseudo(i, 3) * 3.2
      values[i * 3 + 2] = Math.sin(angle) * radius - 0.55
    }

    return values
  }, [])

  useFrame(({ clock }) => {
    if (!points.current) return
    points.current.rotation.y = clock.elapsedTime * 0.025
    points.current.position.y = Math.sin(clock.elapsedTime * 0.18) * 0.08
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#e1f779" transparent opacity={0.52} depthWrite={false} />
    </points>
  )
}

function RingFire() {
  const ring = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ring.current) return
    ring.current.rotation.y = clock.elapsedTime * 0.08
    ring.current.rotation.z = Math.sin(clock.elapsedTime * 0.22) * 0.04
  })

  return (
    <group ref={ring} position={[0, -0.82, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.25, 0.012, 8, 180]} />
        <meshBasicMaterial color="#c9f05c" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0.2]}>
        <torusGeometry args={[3.35, 0.01, 8, 160]} />
        <meshBasicMaterial color="#ff9340" transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, -0.22]}>
        <torusGeometry args={[2.35, 0.008, 8, 140]} />
        <meshBasicMaterial color="#e8ff87" transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

function Scene({ progress, pointer }: VolcanoSceneProps) {
  const sceneGroup = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!sceneGroup.current) return
    sceneGroup.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.035 + progress * 0.28
  })

  return (
    <>
      <color attach="background" args={['#050706']} />
      <fog attach="fog" args={['#050706', 6.5, 18]} />
      <CameraRig progress={progress} pointer={pointer} />
      <ambientLight intensity={0.34} />
      <directionalLight color="#eaff9a" position={[2.5, 4.6, 3.2]} intensity={1.4} />
      <pointLight color="#c9ef63" position={[-3, 1.5, 2.8]} intensity={6} distance={8} />
      <group ref={sceneGroup} position={[0.72, -0.16, 0]}>
        <Terrain />
        <LavaPulse />
        <GpuRacks />
        <SensorGrid />
        <RingFire />
        <Atmosphere />
      </group>
      <EffectComposer>
        <Bloom intensity={0.82} luminanceThreshold={0.38} luminanceSmoothing={0.25} mipmapBlur />
        <Vignette darkness={0.42} offset={0.25} />
      </EffectComposer>
    </>
  )
}

export function VolcanoScene({ progress, pointer }: VolcanoSceneProps) {
  return (
    <div className="world-canvas" aria-hidden="true">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 1.7]}
        camera={{ position: [0, 1.5, 7.6], fov: 42, near: 0.1, far: 60 }}
      >
        <Scene progress={progress} pointer={pointer} />
      </Canvas>
    </div>
  )
}
