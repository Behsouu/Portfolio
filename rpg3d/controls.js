import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class Controls {
    constructor() {
        this.input = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            interact: false
        };

        // Desktop Events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Mobile interact button
        const interactBtn = document.getElementById('rpg-interact-btn');
        if (interactBtn) {
            interactBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.input.interact = true; }, { passive: false });
            interactBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.input.interact = false; }, { passive: false });
        }

        this.initMobileJoystick();
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
            case 'KeyZ': // ZQSD support
                this.input.forward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
            case 'KeyQ':
                this.input.left = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.input.backward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.input.right = true;
                break;
            case 'KeyE':
            case 'Space':
            case 'Enter':
                this.input.interact = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
            case 'KeyZ':
                this.input.forward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
            case 'KeyQ':
                this.input.left = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.input.backward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.input.right = false;
                break;
            case 'KeyE':
            case 'Space':
            case 'Enter':
                this.input.interact = false;
                break;
        }
    }

    initMobileJoystick() {
        const zone = document.getElementById('rpg-joystick-zone');
        if (!zone) return;

        let active = false;
        let centerX, centerY;

        const handleMove = (x, y) => {
            if (!active) return;
            const dx = x - centerX;
            const dy = y - centerY;

            // resets
            this.input.forward = false;
            this.input.backward = false;
            this.input.left = false;
            this.input.right = false;

            // thresholds to allow diagonal movement
            if (dy < -20) this.input.forward = true;
            if (dy > 20) this.input.backward = true;
            if (dx < -20) this.input.left = true;
            if (dx > 20) this.input.right = true;
        };

        zone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            active = true;
            const touch = e.touches[0];
            const rect = zone.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
            handleMove(touch.clientX, touch.clientY);
        }, { passive: false });

        zone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        }, { passive: false });

        const reset = () => {
            active = false;
            this.input.forward = false;
            this.input.backward = false;
            this.input.left = false;
            this.input.right = false;
        };

        zone.addEventListener('touchend', reset);
        zone.addEventListener('touchcancel', reset);
    }

    update() {
        // any constant updates if needed for smooth input
    }
}
