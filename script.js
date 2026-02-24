// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            // Change icon from bars to times
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-links li a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 2. Sticky Navbar on Scroll
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animations
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };

    // Trigger once on load
    revealOnScroll();

    // Trigger on scroll
    window.addEventListener('scroll', revealOnScroll);

    // 4. Smooth scrolling for anchor links (safari fallback)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position if navbar is sticky
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. 3D Tilt Effect Initialization
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".project-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });

        VanillaTilt.init(document.querySelectorAll(".timeline-content"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.1
        });

        VanillaTilt.init(document.querySelectorAll(".skills-category"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.1
        });

        // Disable tilt on mobile for performance and UX
        if (window.innerWidth > 768) {
            VanillaTilt.init(document.querySelectorAll(".blob-shape"), {
                max: 15,
                speed: 300,
                scale: 1.05
            });
        }
    }

    // 6. Custom Cursor Logic
    const cursor = document.getElementById("custom-cursor");
    const follower = document.getElementById("cursor-follower");

    if (cursor && follower) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";

            // Follower has a slight delay handled by CSS transition
            follower.style.left = e.clientX + "px";
            follower.style.top = e.clientY + "px";
        });

        // Add hover effect to interactive elements
        const iterables = document.querySelectorAll("a, button, input, textarea, select");
        iterables.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                cursor.classList.add("hover");
                follower.classList.add("hover");
            });
            el.addEventListener("mouseleave", () => {
                cursor.classList.remove("hover");
                follower.classList.remove("hover");
            });
        });
    }

    // 7. Dark Mode Toggle
    const themeBtn = document.getElementById("theme-btn");
    if (themeBtn) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem("portfolio-theme");
        if (savedTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            if (currentTheme === "dark") {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("portfolio-theme", "light");
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("portfolio-theme", "dark");
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }

    // 8. Typing Effect for Hero Subtitle
    const typedTextSpan = document.getElementById("typed-text");
    const cursorSpan = document.querySelector(".typing-cursor");

    const textArray = ["Web & Applications", "Full Stack", "Passionné"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (!typedTextSpan) return;
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (!typedTextSpan) return;
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);

    // 9. Multilingual Support
    const customLang = document.getElementById("custom-lang");
    const selectedLang = document.getElementById("selected-lang");
    const langOptions = document.getElementById("lang-options");

    // Default language logic
    const savedLang = localStorage.getItem("portfolio-lang") || "fr";
    document.documentElement.lang = savedLang;

    // Apply translations function
    function applyTranslations(lang) {
        if (!translations || !translations[lang]) return;
        const dict = translations[lang];

        // Update regular text nodes
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (dict[key]) {
                el.innerHTML = dict[key];
            }
        });

        // Update document title and formatting based on language
        if (lang === "fa") {
            document.body.style.direction = "rtl";
            document.body.style.textAlign = "right";
        } else {
            document.body.style.direction = "ltr";
            document.body.style.textAlign = "left";
        }

        // Update the typewritter array for the specific language
        if (dict.hero_roles) {
            textArray.length = 0; // Clear existing
            textArray.push(...dict.hero_roles);
        }
    }

    // Apply on load
    applyTranslations(savedLang);

    // Make initial translation array match language
    if (translations && translations[savedLang] && translations[savedLang].hero_roles) {
        textArray.length = 0;
        textArray.push(...translations[savedLang].hero_roles);
    }

    // Custom language dropdown logic
    if (customLang && selectedLang && langOptions) {
        // Initialize displayed selection
        const updateDisplay = (val) => {
            const opt = langOptions.querySelector(`[data-value="${val}"]`);
            if (opt) selectedLang.innerHTML = opt.innerHTML;
        };
        updateDisplay(savedLang);

        // Toggle dropdown
        selectedLang.addEventListener("click", (e) => {
            e.stopPropagation();
            langOptions.classList.toggle("show");
        });

        // Select an option
        langOptions.querySelectorAll("div").forEach(el => {
            el.addEventListener("click", () => {
                const newLang = el.getAttribute("data-value");
                localStorage.setItem("portfolio-lang", newLang);
                document.documentElement.lang = newLang;
                updateDisplay(newLang);
                applyTranslations(newLang);
                langOptions.classList.remove("show");
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!customLang.contains(e.target)) {
                langOptions.classList.remove("show");
            }
        });
    }

    // 10. Scroll Progress Bar & Back to Top Button
    const scrollBar = document.getElementById("myBar");
    const backToTopBtn = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        // Progress bar logic
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollBar) {
            scrollBar.style.width = scrolled + "%";
        }

        // Back to top logic
        if (backToTopBtn) {
            if (winScroll > 300) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // Interactive hover for back to top button (custom cursor)
    if (backToTopBtn && cursor && follower) {
        backToTopBtn.addEventListener("mouseenter", () => {
            cursor.classList.add("hover");
            follower.classList.add("hover");
        });
        backToTopBtn.addEventListener("mouseleave", () => {
            cursor.classList.remove("hover");
            follower.classList.remove("hover");
        });
    }
});

