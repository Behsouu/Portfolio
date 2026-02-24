import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class Player {
    constructor(scene) {
        this.speed = 15;
        this.velocity = new THREE.Vector3();

        // Character mesh - an elegant glowing box
        const geometry = new THREE.BoxGeometry(1.5, 2, 1.5);
        const material = new THREE.MeshStandardMaterial({
            color: 0xe28743, // Terracotta
            emissive: 0xe28743,
            emissiveIntensity: 0.2,
            roughness: 0.2,
            metalness: 0.8
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = 1; // Half height
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        scene.add(this.mesh);

        // Optional: light follows player
        this.pointLight = new THREE.PointLight(0xe28743, 1, 10);
        this.pointLight.position.set(0, 1, 0);
        this.mesh.add(this.pointLight);

        this.lastPosition = this.mesh.position.clone();

        // Idle animation parameters
        this.time = 0;
        this.baseY = 1;
    }

    update(dt, input) {
        const moveSpeed = this.speed * dt;

        this.velocity.set(0, 0, 0);

        if (input.forward) this.velocity.z -= moveSpeed;
        if (input.backward) this.velocity.z += moveSpeed;
        if (input.left) this.velocity.x -= moveSpeed;
        if (input.right) this.velocity.x += moveSpeed;

        // Normalize if moving diagonally
        if (this.velocity.lengthSq() > moveSpeed * moveSpeed) {
            this.velocity.normalize().multiplyScalar(moveSpeed);
        }

        // Apply movement
        if (this.velocity.lengthSq() > 0) {
            this.mesh.position.add(this.velocity);

            // Look in movement direction
            const lookPos = this.mesh.position.clone().add(this.velocity);
            this.mesh.lookAt(lookPos);

            // Walking bounce
            this.time += dt * 15;
            this.mesh.position.y = this.baseY + Math.abs(Math.sin(this.time)) * 0.3;
        } else {
            // Idle breathing animation
            this.time += dt * 3;
            this.mesh.position.y = this.baseY + Math.sin(this.time) * 0.1;
        }

        // Simple world bounds [-40, 40]
        this.mesh.position.x = Math.max(-38, Math.min(38, this.mesh.position.x));
        this.mesh.position.z = Math.max(-38, Math.min(38, this.mesh.position.z));
    }
}
