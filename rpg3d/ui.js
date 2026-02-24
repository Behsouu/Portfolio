import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class UI {
    constructor() {
        this.rpgContainer = document.getElementById('rpg-mode-container');
        this.hintObj = document.getElementById('rpg-interaction-hint');
        this.popupObj = document.getElementById('rpg-popup');
        this.popupTitle = document.getElementById('rpg-popup-title');
        this.popupContent = document.getElementById('rpg-popup-content');

        this.closeBtn = document.getElementById('rpg-close-btn');
        this.popupCloseBtn = document.getElementById('rpg-popup-close');

        this.isPopupOpen = false;

        this.bindEvents();
    }

    bindEvents() {
        this.popupCloseBtn.addEventListener('click', () => {
            this.closePopup();
        });
    }

    showHint(message = "Appuyez sur 'E' pour interagir") {
        if (this.isPopupOpen) return;
        this.hintObj.classList.remove('hidden');
    }

    hideHint() {
        this.hintObj.classList.add('hidden');
    }

    openPopup(title, htmlContent) {
        this.isPopupOpen = true;
        this.hideHint();
        this.popupTitle.innerHTML = title;
        this.popupContent.innerHTML = htmlContent;
        this.popupObj.classList.remove('hidden');
    }

    closePopup() {
        this.isPopupOpen = false;
        this.popupObj.classList.add('hidden');
    }

    // Helper to grab existing DOM content from portfolio to show in RPG popup
    getHtmlForZone(zoneType) {
        let content = '';
        let title = '';

        const lang = document.documentElement.lang || 'fr';
        // Basic translation dictionary for the popup titles
        const dict = {
            fr: { about: "À propos de moi", projects: "Mes Projets", skills: "Compétences", contact: "Contact" },
            en: { about: "About Me", projects: "My Projects", skills: "Skills", contact: "Contact" }
        };
        const t = dict[lang] || dict['fr'];

        switch (zoneType) {
            case 'about':
                title = t.about;
                const aboutText = document.querySelector('#about .hero-description')?.innerHTML || "<p>Développeur Full Stack...</p>";
                content = `<div>${aboutText}</div>`;
                break;
            case 'projects':
                title = t.projects;
                // Grab all project titles and links
                const projects = document.querySelectorAll('#projects .project-card');
                let plist = '<div style="display:flex; flex-direction:column; gap:10px;">';
                projects.forEach(p => {
                    const pname = p.querySelector('h3')?.innerText;
                    const pdesc = p.querySelector('p')?.innerText;
                    if (pname) plist += `<div style="padding:10px; background:rgba(0,0,0,0.2); border-radius:8px;"><strong>${pname}</strong><br><small>${pdesc}</small></div>`;
                });
                plist += '</div>';
                content = plist;
                break;
            case 'skills':
                title = t.skills;
                const skillsWrap = document.querySelector('.skills-wrapper')?.innerHTML || "<p>JavaScript, Three.js, React, Node.js...</p>";
                content = skillsWrap;
                break;
            case 'contact':
                title = t.contact;
                const links = document.querySelector('.contact-links')?.innerHTML || "<a href='mailto:sina.ramezani.off@gmail.com'>Email</a>";
                content = `<div style="display:flex; flex-direction:column; gap:15px; align-items:flex-start;">${links}</div>`;
                break;
        }

        return { title, content };
    }
}
