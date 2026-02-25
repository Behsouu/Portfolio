import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.zones = [];
        this.activeZone = null;

        this.createEnvironment();
        this.createInteractables();
    }

    createEnvironment() {
        // Floor
        const floorGeo = new THREE.PlaneGeometry(80, 80);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a24,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Grid pattern for synthwave feel
        const gridHelper = new THREE.GridHelper(80, 40, 0x444455, 0x222233);
        gridHelper.position.y = 0.01;
        this.scene.add(gridHelper);

        // Surrounding walls
        const wallGeo = new THREE.BoxGeometry(80, 4, 1);
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x333344 });

        const wallN = new THREE.Mesh(wallGeo, wallMat);
        wallN.position.set(0, 2, -40);
        this.scene.add(wallN);

        const wallS = new THREE.Mesh(wallGeo, wallMat);
        wallS.position.set(0, 2, 40);
        this.scene.add(wallS);

        const wallE = new THREE.Mesh(wallGeo, wallMat);
        wallE.rotation.y = Math.PI / 2;
        wallE.position.set(40, 2, 0);
        this.scene.add(wallE);

        const wallW = new THREE.Mesh(wallGeo, wallMat);
        wallW.rotation.y = Math.PI / 2;
        wallW.position.set(-40, 2, 0);
        this.scene.add(wallW);

        // Decorations
        for (let i = 0; i < 30; i++) {
            const h = Math.random() * 5 + 2;
            const geo = new THREE.BoxGeometry(1, h, 1);
            const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x2a2a35 }));
            mesh.position.set(
                (Math.random() - 0.5) * 70,
                h / 2,
                (Math.random() - 0.5) * 70
            );

            // avoid center
            if (mesh.position.length() < 10) continue;

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
        }
    }

    createInteractables() {
        // Define zones: {id, x, z, color, label}
        const zonesData = [
            { id: 'about', x: -10, z: -10, color: 0xf4c430, label: 'À Propos' },
            { id: 'projects', x: 10, z: -10, color: 0xe28743, label: 'Projets' },
            { id: 'skills', x: -10, z: 10, color: 0xa3b18a, label: 'Compétences' },
            { id: 'contact', x: 10, z: 10, color: 0x00a8ff, label: 'Contact' }
        ];

        zonesData.forEach(data => {
            // Main structure
            const geo = new THREE.CylinderGeometry(2, 2, 0.5, 8);
            const mat = new THREE.MeshStandardMaterial({
                color: data.color,
                emissive: data.color,
                emissiveIntensity: 0.5,
                wireframe: true
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(data.x, 0.25, data.z);
            this.scene.add(mesh);

            // Floating crystal / icon above it
            const crystalGeo = new THREE.OctahedronGeometry(1);
            const crystalMat = new THREE.MeshStandardMaterial({
                color: data.color,
                emissive: data.color,
                emissiveIntensity: 0.8,
                roughness: 0.1,
                metalness: 0.9
            });
            const crystal = new THREE.Mesh(crystalGeo, crystalMat);
            crystal.position.set(data.x, 3, data.z);
            this.scene.add(crystal);

            // Point light
            const light = new THREE.PointLight(data.color, 1, 15);
            light.position.set(data.x, 3, data.z);
            this.scene.add(light);

            this.zones.push({
                id: data.id,
                x: data.x,
                z: data.z,
                radius: 4,
                mesh: crystal,
                time: Math.random() * 10
            });
        });
    }

    checkInteractions(player, ui) {
        let isNearAny = false;
        let nearZone = null;

        const pX = player.mesh.position.x;
        const pZ = player.mesh.position.z;

        // Animate crystals & check distance
        this.zones.forEach(zone => {
            zone.time += 0.02;
            zone.mesh.position.y = 3 + Math.sin(zone.time) * 0.5;
            zone.mesh.rotation.y += 0.01;

            const dx = pX - zone.x;
            const dz = pZ - zone.z;
            const distSq = dx * dx + dz * dz;

            if (distSq < zone.radius * zone.radius) {
                isNearAny = true;
                nearZone = zone;
            }
        });

        if (isNearAny && !ui.isPopupOpen) {
            ui.showHint();
            this.activeZone = nearZone;
        } else {
            ui.hideHint();
            this.activeZone = null;
        }
    }
}
