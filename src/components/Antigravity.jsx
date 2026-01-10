/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const AntigravityInner = ({
  count = 300,
  magnetRadius = 200,
  ringRadius = 100,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 2,
  lerpSpeed = 0.1,
  color = '#FF9FFC',
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0.2,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10
}) => {
  const meshRef = useRef(null);
  const { viewport, size } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Convert pixel-based radius to Three.js world units
  const scaleFactor = viewport.width / size.width;
  const magnetRadiusWorld = magnetRadius * scaleFactor;
  const ringRadiusWorld = ringRadius * scaleFactor;

  const particles = useMemo(() => {
    const temp = [];

    for (let i = 0; i < count; i++) {
      // Create particles in a circular/radial distribution around center
      const angle = Math.random() * Math.PI * 2;
      const radiusVariance = 0.5 + Math.random() * 1.5; // Distance multiplier
      const baseRadius = ringRadiusWorld * radiusVariance;
      
      temp.push({
        angle: angle,
        baseRadius: baseRadius,
        currentRadius: baseRadius,
        targetRadius: baseRadius,
        z: (Math.random() - 0.5) * 10,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        sizeVariance: 0.6 + Math.random() * 0.8,
        radiusOffset: (Math.random() - 0.5) * 2
      });
    }
    return temp;
  }, [count, ringRadiusWorld]);

  useFrame(state => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { viewport: v } = state;
    const time = state.clock.getElapsedTime();

    // Static center position
    const centerX = 0;
    const centerY = 0;

    particles.forEach((particle, i) => {
      const { phase, speed, sizeVariance, radiusOffset } = particle;

      // Slowly rotate particles around the center
      particle.angle += rotationSpeed * 0.01;

      // Wave animation on radius
      const wave = Math.sin(time * waveSpeed + phase) * waveAmplitude * 2;
      const targetRadius = particle.baseRadius + wave + radiusOffset * fieldStrength * 0.5;
      
      // Smooth interpolation to target radius
      particle.currentRadius += (targetRadius - particle.currentRadius) * lerpSpeed;

      // Calculate position based on angle and radius from center
      const px = centerX + Math.cos(particle.angle) * particle.currentRadius;
      const py = centerY + Math.sin(particle.angle) * particle.currentRadius;
      const pz = particle.z + Math.sin(time * speed + phase) * depthFactor;

      dummy.position.set(px, py, pz);

      // Orient capsule to point AWAY from center (radially outward)
      const dirX = px - centerX;
      const dirY = py - centerY;
      const outwardAngle = Math.atan2(dirY, dirX);
      
      dummy.rotation.set(0, 0, outwardAngle + Math.PI / 2);

      // Scale based on distance from ideal ring radius
      const distFromRing = Math.abs(particle.currentRadius - ringRadiusWorld);
      let alphaScale = 1 - (distFromRing / (ringRadiusWorld * 1.5));
      alphaScale = Math.max(0.2, Math.min(1, alphaScale));

      // Pulse effect
      const pulse = 0.8 + Math.sin(time * pulseSpeed + phase) * 0.2 * particleVariance;
      const finalScale = alphaScale * pulse * sizeVariance * particleSize;

      dummy.scale.set(finalScale, finalScale * 1.5, finalScale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === 'capsule' && <capsuleGeometry args={[0.1, 0.3, 4, 8]} />}
      {particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
};

const Antigravity = props => {

  return (
    <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [0, 0, 50], fov: 35 }}>
      <AntigravityInner {...props} />
    </Canvas>
  );
};

export default Antigravity;
