// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Core Animation Data
const BRAND_COLORS = ['#8b5cf6', '#f59e0b']; // Electric Violet, Gold

// Interactive Spark Particles
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Mouse tracking
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        init();
    }
    
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Smaller sparks
            this.size = Math.random() * 2 + 0.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.color = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
            // Drift speed
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            
            // Add a subtle glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            
            // Reset shadow to avoid performance hit on other elements (though there are none here)
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }

        update() {
            // Constant drifting
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges smoothly
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse Interaction (Push away)
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                
                // Max distance, past that the force is 0
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance; 
                
                // If within mouse radius
                if (distance < mouse.radius) {
                    this.x -= forceDirectionX * force * this.density;
                    this.y -= forceDirectionY * force * this.density;
                    this.alpha = 1; // Brighten near mouse
                } else {
                    if (this.alpha > 0.5) {
                        this.alpha -= 0.02; // Fade back
                    }
                }
            } else {
                if (this.alpha > 0.5) {
                    this.alpha -= 0.02;
                }
            }
        }
    }

    function init() {
        particles = [];
        // Number of particles depends on screen size (prevent lag on huge screens)
        let particleCount = (width * height) / 10000;
        // Cap it
        if(particleCount > 200) particleCount = 200;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        // Clear screen with a slight trail effect (alpha 0.2 instead of 1)
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
    }

    resize();
    animate();
}

const servicesGroups = [
    {
        category: "AI",
        id: "ai",
        services: [
            { title: "AI Chatbots", impact: "75%", desc: "Neural Response Systems", sub: "automated resolution rate for 24/7 customer nodes." },
            { title: "AI Voice Agents", impact: "120+", desc: "Workflow Automation", sub: "hours saved monthly via custom LLM internal tools." }
        ]
    },
    {
        category: "Web",
        id: "web",
        services: [
            { title: "Website Dev", impact: "1.2s", desc: "High-Performance Next.js", sub: "average page load speed with modern architectures." },
            { title: "Shopify Store Dev", impact: "$150K+", desc: "Conversion Architectures", sub: "in tracked sales via optimized checkouts." }
        ]
    },
    {
        category: "Marketing",
        id: "marketing",
        services: [
            { title: "SEO", impact: "+140%", desc: "Organic Growth Algorithms", sub: "visibility in competitive niches within 4 months." },
            { title: "ASO", impact: "3x", desc: "App Store Optimization", sub: "increase in organic installs & rank." }
        ]
    }
];

// Initialize Services Section
function initServices() {
    const servicesContainer = document.querySelector("#services");
    servicesContainer.innerHTML = '<div class="service-connector"></div>';

    servicesGroups.forEach((group, index) => {
        const node = document.createElement("div");
        node.className = "service-node";
        node.id = `services-${group.id}`;
        
        let servicesHtml = group.services.map(sub => `
            <div class="sub-service" data-category="${group.id}">
                <h4 class="node-title">${sub.title}</h4>
                <span class="node-impact">${sub.impact}</span>
                <p class="node-sub">${sub.sub}</p>
            </div>
        `).join('');

        node.innerHTML = `
            <div class="node-marker"></div>
            <div class="node-content">
                <h3 class="node-category">${group.category} Services</h3>
                <div class="node-services-list">
                    ${servicesHtml}
                </div>
            </div>
        `;
        servicesContainer.appendChild(node);

        // Animate marker on scroll
        gsap.fromTo(node.querySelector(".node-marker"), 
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                scrollTrigger: {
                    trigger: node,
                    start: "top 95%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Animate content on scroll
        gsap.fromTo(node.querySelector(".node-content"), 
            { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: node,
                    start: "top 95%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Add click listeners to sub-services
    document.querySelectorAll('.sub-service').forEach(service => {
        service.addEventListener('click', function() {
            const modal = document.querySelector('#service-modal');
            if(modal) {
                modal.classList.add('active');
            }
        });
    });
}

// Initialize Vital Signs
function initVitalSigns() {
    const stats = [
        { label: "Growth", value: 120, suffix: "%" },
        { label: "Support", value: 24, suffix: "/7" },
        { label: "Active Clients", value: 12, suffix: "+" }
    ];
    
    const grid = document.querySelector(".stats-grid");
    stats.forEach((stat, idx) => {
        grid.innerHTML += `
            <div class="stat-card">
                <span class="stat-value" id="stat-${idx}">0${stat.suffix}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `;
    });

    gsap.fromTo(".stat-card", 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.8,
            scrollTrigger: {
                trigger: ".stats-grid",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        }
    );

    // Number counting animation
    stats.forEach((stat, idx) => {
        const el = document.getElementById(`stat-${idx}`);
        let obj = { val: 0 };
        gsap.to(obj, {
            val: stat.value,
            duration: 2,
            ease: "power2.out",
            delay: idx * 0.2,
            onUpdate: () => {
                el.innerText = Math.floor(obj.val) + stat.suffix;
            },
            scrollTrigger: {
                trigger: ".stats-grid",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });
    });
}

// Initialize Reviews
function initReviews() {
    const reviews = [
        {
            client: "Sarah Jenkins",
            role: "CMO, Global E-Com",
            avatar: "https://i.pravatar.cc/150?u=sarah",
            text: "VoV Studio completely transformed our checkout flow. The new headless architecture reduced load times by 60% and directly drove a $2.5M lift in revenue. Their team is exceptionally sharp."
        },
        {
            client: "David Chen",
            role: "VP Operations, TechCorp Inc",
            avatar: "https://i.pravatar.cc/150?u=david",
            text: "We were drowning in customer support tickets during our peak season. VoV deployed an AI Voice Agent that now handles 85% of queries instantly. It's been a game-changer for our margins."
        },
        {
            client: "Elena Rodriguez",
            role: "Founder, SaaS Startup",
            avatar: "https://i.pravatar.cc/150?u=elena",
            text: "Before VoV, we were invisible and wasting cash on ads. Their precision SEO approach gave us a 310% boost in organic traffic within four months. We finally have a predictable growth engine."
        }
    ];

    const container = document.querySelector("#reviews");
    container.innerHTML = `
        <div class="section-title">
            <h2>Client Reviews</h2>
            <div class="line-accent"></div>
        </div>
        <div class="case-grid"></div>
    `;

    const grid = container.querySelector(".case-grid");
    reviews.forEach(review => {
        grid.innerHTML += `
            <div class="case-item">
                <div class="case-info">
                    <div class="client-profile">
                        <img src="${review.avatar}" alt="${review.client}" class="client-avatar">
                        <div>
                            <h4>${review.client}</h4>
                            <span class="client-role">${review.role}</span>
                        </div>
                    </div>
                    <div class="review-stars">
                        <i data-lucide="star"></i>
                        <i data-lucide="star"></i>
                        <i data-lucide="star"></i>
                        <i data-lucide="star"></i>
                        <i data-lucide="star"></i>
                    </div>
                    <p class="review-text">"${review.text}"</p>
                </div>
            </div>
        `;
    });

    gsap.fromTo(".case-item", 
        { x: 100, opacity: 0 },
        {
            x: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".case-grid",
                start: "top 90%",
                toggleActions: "play none none none"
            }
        }
    );
}

// Initialize Team Section
function initTeam() {
    const team = [
        { name: "Marcus Chen", role: "Head of Development", image: "https://i.pravatar.cc/300?u=marcuschen" },
        { name: "Dr. Aris Vane", role: "Head of AI", image: "https://i.pravatar.cc/300?u=arisvane" },
        { name: "Elena Rostova", role: "Head of Marketing", image: "https://i.pravatar.cc/300?u=elena" }
    ];

    const container = document.querySelector("#team");
    container.innerHTML = `
        <div class="section-title">
            <h2>The Minds Behind the Pulse</h2>
            <div class="line-accent"></div>
        </div>
        <div class="team-grid"></div>
    `;

    const grid = container.querySelector(".team-grid");
    team.forEach(member => {
        grid.innerHTML += `
            <div class="team-card">
                <img src="${member.image}" alt="${member.name}" class="team-image">
                <h4>${member.name}</h4>
                <p class="team-role">${member.role}</p>
            </div>
        `;
    });

    gsap.fromTo(".team-card", 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".team-grid",
                start: "top 90%",
                toggleActions: "play none none none"
            }
        }
    );
}

// Initialize Contact Form
function initContact() {
    const container = document.querySelector("#contact");
    container.innerHTML = `
        <div class="section-title">
            <h2>Ignite the Engine</h2>
            <p>Ready to see your growth graph spike? Choose your preferred channel to ignite growth.</p>
        </div>
        <div class="form-container">
            <div class="action-buttons" style="margin-top: 0;">
                <a href="https://wa.me/1234567890" target="_blank" class="btn-primary btn-large btn-whatsapp" style="text-decoration:none;"><i data-lucide="phone"></i> WhatsApp</a>
                <a href="mailto:hello@vovstudio.com" class="btn-primary btn-large btn-email" style="text-decoration:none;"><i data-lucide="mail"></i> Email Us</a>
                <a href="#" class="btn-primary btn-large book-call-trigger" style="text-decoration:none;"><i data-lucide="calendar"></i> Book a Call</a>
            </div>
        </div>
    `;

    gsap.fromTo(".form-container", 
        { scale: 0.9, opacity: 0 },
        {
            scale: 1,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: ".ignite-form",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        }
    );

    // Smooth scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const target = document.querySelector(targetId);
            if(target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });



    // Close Modal Handlers
    document.querySelector('#close-modal')?.addEventListener('click', () => {
        document.querySelector('#success-modal').classList.remove('active');
    });

    document.querySelector('#close-service-modal')?.addEventListener('click', () => {
        document.querySelector('#service-modal').classList.remove('active');
    });

    document.querySelector('#close-booking-modal')?.addEventListener('click', () => {
        document.querySelector('#booking-modal').classList.remove('active');
    });

    document.querySelector('#close-booking-success')?.addEventListener('click', () => {
        document.querySelector('#booking-success-modal').classList.remove('active');
    });

    // Wire up Book a Call Triggers
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.book-call-trigger');
        if (trigger) {
            e.preventDefault();
            // Close service modal if open
            document.querySelector('#service-modal')?.classList.remove('active');
            
            // Open booking modal
            const bookingModal = document.querySelector('#booking-modal');
            if (bookingModal) {
                bookingModal.classList.add('active');
            }
        }
    });

    // Booking Form Submission
    const bookingForm = document.querySelector('#booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const orig = btn.innerText;

            btn.classList.add('loading');
            btn.innerHTML = 'Sending... <i data-lucide="loader-2" class="spin"></i>';
            lucide.createIcons();

            try {
                // Simulate network
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                document.querySelector('#booking-modal').classList.remove('active');
                document.querySelector('#booking-success-modal').classList.add('active');
                this.reset();
            } catch (err) {
                console.error(err);
                alert("Failed to send request.");
            } finally {
                btn.classList.remove('loading');
                btn.innerText = orig;
            }
        });
    }
}

// Handle Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    function updateIcon() {
        const isLight = document.documentElement.classList.contains('light-theme');
        const wrapper = document.getElementById('theme-icon-wrapper');
        if (isLight) {
            wrapper.innerHTML = '<i data-lucide="moon"></i>';
        } else {
            wrapper.innerHTML = '<i data-lucide="sun"></i>';
        }
        lucide.createIcons();
    }
    
    // Initial icon setup
    updateIcon();

    themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateIcon();
    });
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initParticles();
    initServices();
    initVitalSigns();
    initReviews();
    initTeam();
    initContact();
    
    // Wire up Hero CTA button
    const heroCta = document.querySelector('.cta-container .btn-primary') || document.querySelector('.btn-primary');
    if (heroCta) {
        heroCta.addEventListener('click', () => {
            const modal = document.querySelector('#service-modal');
            if(modal) {
                modal.classList.add('active');
            }
        });
    }
});

// Refresh ScrollTrigger after everything (images, fonts) fires
window.addEventListener('load', () => {
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
});
