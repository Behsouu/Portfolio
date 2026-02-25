import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { Player } from './player.js';
import { World } from './world.js';
import { Controls } from './controls.js';
import { UI } from './ui.js';

let scene, camera, renderer;
let player, world, controls, ui;
let lastTime = 0;
let animFrameId = null;
let isRPGMode = false;
let initialized = false;

export function initRPG() {
    const container = document.getElementById('rpg-canvas-container');
    if (initialized) return;
    initialized = true;

    // ----- INJECT ALERT DEBUGGER -----
    window.onerror = (msg, url, line) => { alert('ERR: ' + msg + ' at ' + line); };
    let step = 1;
    try {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a24);
        scene.fog = new THREE.FogExp2(0x1a1a24, 0.02);
        step = 2;
    } catch (e) { alert('SCENE ERR: ' + e); }

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize for mobile
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    step = 3;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    scene.add(dirLight);
    step = 4;

    try {
        world = new World(scene);
        step = 5;
        player = new Player(scene);
        step = 6;
        controls = new Controls();
        step = 7;
        ui = new UI();
        step = 8;
    } catch (e) { alert('ERR CREATING OBJS: ' + e); }

    // Interaction Binding
    document.addEventListener('keydown', (e) => {
        if (!isRPGMode) return;
        if (e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') {
            handleInteraction();
        }
    });

    const interactBtn = document.getElementById('rpg-interact-btn');
    if (interactBtn) {
        interactBtn.addEventListener('click', handleInteraction);
        interactBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleInteraction();
        }, { passive: false });
    }

    window.addEventListener('resize', onWindowResize);

    lastTime = performance.now();
    loop(lastTime);
}

function handleInteraction() {
    if (!ui) return;
    if (ui.isPopupOpen) {
        ui.closePopup();
        return;
    }

    if (world && world.activeZone) {
        const popupData = ui.getHtmlForZone(world.activeZone.id);
        ui.openPopup(popupData.title, popupData.content);
    }
}

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function loop(time) {
    animFrameId = requestAnimationFrame(loop);
    if (!isRPGMode) return;

    if (!lastTime) lastTime = time;
    let dt = (time - lastTime) / 1000;
    // Cap dt and prevent negative
    if (dt > 0.1) dt = 0.1;
    if (dt < 0) dt = 0.016;

    lastTime = time;

    // Safety check just in case camera corrupted
    if (isNaN(camera.position.x)) {
        camera.position.set(0, 10, 15);
    }

    controls.update();

    // Only move if popup is closed
    if (!ui.isPopupOpen) {
        player.update(dt, controls.input);
        world.checkInteractions(player, ui);
    } else {
        // Hide hint when a popup is already open
        ui.hideHint();
    }

    // Smooth Camera Follow
    const targetX = player.mesh.position.x;
    const targetZ = player.mesh.position.z + 12;
    const targetY = 8;

    camera.position.x += (targetX - camera.position.x) * 3 * dt;
    camera.position.z += (targetZ - camera.position.z) * 3 * dt;
    camera.position.y += (targetY - camera.position.y) * 3 * dt;
    camera.lookAt(player.mesh.position);

    renderer.render(scene, camera);
}

// Start & Stop Logic
const rpgBtn = document.getElementById('rpg-mode-btn');
const closeBtn = document.getElementById('rpg-close-btn');
const rpgContainer = document.getElementById('rpg-mode-container');

function toggleRpgMode(enable) {
    isRPGMode = enable;
    if (enable) {
        document.body.classList.add('rpg-active');
        rpgContainer.classList.remove('hidden');
        initRPG();
        lastTime = 0; // Reset lastTime so loop initializes it
    } else {
        document.body.classList.remove('rpg-active');
        rpgContainer.classList.add('hidden');
    }
}

if (rpgBtn) {
    rpgBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleRpgMode(true);
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        toggleRpgMode(false);
    });
}
