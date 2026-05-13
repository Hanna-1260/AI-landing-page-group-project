document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'white';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 10px 10px rgba(0,0,0,0.1)';
        } else {
            navLinks.style.display = '';
        }
    });

    // 3. Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Survey Submission
    const surveyForm = document.getElementById('survey-form');
    const surveyThanks = document.getElementById('survey-thanks');

    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedOption = surveyForm.querySelector('input[name="vote"]:checked');
        if (selectedOption) {
            surveyForm.classList.add('hidden');
            surveyThanks.classList.remove('hidden');
        } else {
            alert('אנא בחר אחת מהאפשרויות');
        }
    });

    // 5. Logo Scroll to Top
    const logo = document.getElementById('logo');
    logo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 6. Three.js Interactive Experience
    initThreeJS();
});

function initThreeJS() {
    const container = document.getElementById('three-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Brand Colors
    const colors = {
        primary: 0x3661FF,
        accent: 0xFFE14B,
        white: 0xFFFFFF,
        success: 0x4CAF50
    };

    // Item Definitions
    const itemsData = [
        { name: "בקבוק מים", type: 'bottle' },
        { name: "טלפון נייד", type: 'phone' },
        { name: "צרור מפתחות", type: 'keys' },
        { name: "כובע", type: 'hat' },
        { name: "תעודת זהות", type: 'id' },
        { name: "תיק אישי", type: 'bag' }
    ];

    const objects = [];
    const group = new THREE.Group();
    scene.add(group);

    // Helper to create geometries
    function createItemMesh(type) {
        const itemGroup = new THREE.Group();
        let mainMesh;

        switch (type) {
            case 'bottle':
                const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 32), new THREE.MeshStandardMaterial({ color: colors.primary }));
                const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32), new THREE.MeshStandardMaterial({ color: colors.white }));
                neck.position.y = 0.5;
                itemGroup.add(body, neck);
                break;
            case 'phone':
                mainMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.05), new THREE.MeshStandardMaterial({ color: 0x222222 }));
                const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.8), new THREE.MeshStandardMaterial({ color: colors.primary, emissive: colors.primary, emissiveIntensity: 0.2 }));
                screen.position.z = 0.03;
                itemGroup.add(mainMesh, screen);
                break;
            case 'keys':
                const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 16, 100), new THREE.MeshStandardMaterial({ color: 0x222222 }));
                const key1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.02), new THREE.MeshStandardMaterial({ color: colors.primary }));
                key1.position.y = -0.3;
                key1.rotation.z = 0.5;
                itemGroup.add(ring, key1);
                break;
            case 'hat':
                mainMesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: colors.primary }));
                const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.05, 32), new THREE.MeshStandardMaterial({ color: colors.primary }));
                itemGroup.add(mainMesh, brim);
                break;
            case 'id':
                mainMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.02), new THREE.MeshStandardMaterial({ color: colors.white }));
                const idBorder = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.01), new THREE.MeshStandardMaterial({ color: 0x000000 }));
                idBorder.position.z = -0.01;
                const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.2), new THREE.MeshStandardMaterial({ color: colors.primary }));
                photo.position.set(-0.15, 0, 0.015);
                itemGroup.add(mainMesh, idBorder, photo);
                break;
            case 'bag':
                mainMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.3), new THREE.MeshStandardMaterial({ color: colors.primary }));
                const handle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 16, 100, Math.PI), new THREE.MeshStandardMaterial({ color: 0x222222 }));
                handle.position.y = 0.3;
                itemGroup.add(mainMesh, handle);
                break;
        }
        return itemGroup;
    }

    // Initialize Items in a more random/dynamic way
    itemsData.forEach((data, i) => {
        const itemMesh = createItemMesh(data.type);

        // Random distribution instead of a circle
        itemMesh.position.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2
        );

        itemMesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        itemMesh.userData = {
            name: data.name,
            selected: false,
            originalPos: itemMesh.position.clone(),
            originalRotation: itemMesh.rotation.clone()
        };

        group.add(itemMesh);
        objects.push(itemMesh);
    });

    camera.position.z = 6;

    // Interaction State
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const labelEl = document.getElementById('checklist-label');
    const completionBtn = document.getElementById('btn-completion');
    let selectedCount = 0;

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.offsetHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(group.children, true);

        if (intersects.length > 0) {
            let obj = intersects[0].object;
            while (obj.parent !== group && obj.parent !== null) obj = obj.parent;

            if (!obj.userData.selected) {
                labelEl.textContent = obj.userData.name;
                labelEl.classList.add('visible');
                container.style.cursor = 'pointer';
            }
        } else {
            labelEl.classList.remove('visible');
            container.style.cursor = 'default';
        }
    });

    container.addEventListener('click', () => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(group.children, true);

        if (intersects.length > 0) {
            let obj = intersects[0].object;
            while (obj.parent !== group && obj.parent !== null) obj = obj.parent;

            if (!obj.userData.selected) {
                obj.userData.selected = true;
                selectedCount++;
                animateSelection(obj);

                // Show completion button after first item
                if (selectedCount === 1) {
                    completionBtn.classList.add('visible');
                }
            }
        }
    });

    completionBtn.addEventListener('click', () => {
        const response = document.createElement('div');
        response.style.position = 'absolute';
        response.style.top = '50%';
        response.style.left = '50%';
        response.style.transform = 'translate(-50%, -50%)';
        response.style.background = '#000';
        response.style.color = '#fff';
        response.style.padding = '30px 60px';
        response.style.fontSize = '1.5rem';
        response.style.fontWeight = '900';
        response.style.zIndex = '100';
        response.style.textAlign = 'center';
        response.style.border = '4px solid #fff';
        response.textContent = "מצוין! אנחנו מוכנים לשינוי 🇮🇱";

        container.appendChild(response);

        // Fade out completion button
        completionBtn.classList.remove('visible');

        setTimeout(() => {
            response.style.transition = 'opacity 1s';
            response.style.opacity = '0';
            setTimeout(() => response.remove(), 1000);
        }, 3000);
    });

    function animateSelection(obj) {
        // Move to "ready" stack at bottom
        const targetPos = new THREE.Vector3(-2.5 + (selectedCount * 0.8), -2, 1);

        // Simple animation logic in loop
        obj.userData.targetPos = targetPos;
        obj.userData.animating = true;

        // Visual feedback
        obj.traverse(child => {
            if (child.material) {
                child.material = child.material.clone();
                child.material.emissive = new THREE.Color(0x4caf50);
                child.material.emissiveIntensity = 0.2;
            }
        });
    }

    function animate() {
        requestAnimationFrame(animate);

        objects.forEach(obj => {
            if (!obj.userData.selected) {
                // Subtle floating and rotation for unselected items
                obj.rotation.y += 0.01;
                obj.position.y = obj.userData.originalPos.y + Math.sin(Date.now() * 0.002) * 0.1;
            } else if (obj.userData.animating) {
                // Smooth transition to target
                obj.position.lerp(obj.userData.targetPos, 0.1);
                obj.rotation.x *= 0.9;
                obj.rotation.y *= 0.9;
                obj.rotation.z *= 0.9;
                obj.scale.lerp(new THREE.Vector3(0.7, 0.7, 0.7), 0.1);

                if (obj.position.distanceTo(obj.userData.targetPos) < 0.01) {
                    obj.userData.animating = false;
                }
            }
        });

        // Mouse influence on camera/group
        group.rotation.y += (mouse.x * 0.05 - group.rotation.y) * 0.05;
        group.rotation.x += (-mouse.y * 0.05 - group.rotation.x) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}
