/**
 * MIKHAIL EMAD ALBER - PORTFOLIO LOGIC
 * High-Performance Vanilla JavaScript
 * - Dynamic Canvas Particle Constellation
 * - Interactive Server Terminal Simulator
 * - Project Filter & Rich Modal System
 * - Animated Metric Counters
 * - Copy-to-Clipboard Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTypingEffect();
  initCounters();
  initProjectFilters();
  initProjectModals();
  initTerminal();
  initCopyButtons();
  initContactForm();
  initMobileMenu();
});

/* ==========================================================================
   1. DYNAMIC CANVAS PARTICLE CONSTELLATION
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 75;
  const maxDistance = 140;
  
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.3 ? '#00f2fe' : '#38bdf8';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interaction
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. DYNAMIC HERO TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const roles = [
    "Full Stack Engineer",
    "AI / ML Specialist",
    "IT Support & Server Admin @ Petra",
    "Django REST & React Architect",
    "Linux & cPanel System Admin"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. ANIMATED METRIC COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 1500;
        const increment = Math.ceil(target / (duration / 25));

        const updateCount = () => {
          count += increment;
          if (count < target) {
            counter.innerText = count;
            setTimeout(updateCount, 25);
          } else {
            counter.innerText = target;
          }
        };

        updateCount();
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   4. PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. PROJECT DETAILS MODAL DATA & HANDLER
   ========================================================================== */
const projectData = {
  'trade-spark': {
    title: "Trade Spark Hub 14",
    subtitle: "Enterprise Commerce & Inventory Platform",
    tag: "Full Stack • High Throughput",
    summary: "A robust multi-tier commercial management platform with real-time stock sync, point-of-sale tracking, dynamic purchase order workflows, and executive financial dashboards.",
    architecture: ["Django REST Framework", "React.js 18", "TypeScript", "PostgreSQL", "Redis Caching", "JWT & RBAC"],
    metrics: [
      { label: "Query Optimization", val: "30% faster response latency" },
      { label: "Multi-tenant", val: "Granular Role-Based Access" },
      { label: "Data Integrity", val: "ACID Compliant Transactions" }
    ],
    details: "Constructed using clean architectural patterns separating presentation, business logic, and database access. Automated stock depletion warnings and invoice generation pipelines.",
    github: "https://github.com/mikhailemad999"
  },
  'medai': {
    title: "MedAI-Hub Diagnostic Platform",
    subtitle: "AI Healthcare Inference & Patient Management",
    tag: "Machine Learning • HealthTech",
    summary: "Intelligent clinical decision support application merging trained predictive machine learning classification models with secure patient health records.",
    architecture: ["Python ML Pipeline", "Scikit-Learn", "Django REST", "React Frontend", "RESTful Model Serving"],
    metrics: [
      { label: "Diagnostic Pipeline", val: "Sub-second inference times" },
      { label: "Data Security", val: "Encrypted Patient Telemetry" },
      { label: "Clinical Workflow", val: "Direct PDF Lab Reports" }
    ],
    details: "Provides healthcare practitioners with rapid probability estimates for diagnostic risk factors while keeping electronic health records strictly normalized and encrypted.",
    github: "https://github.com/mikhailemad999"
  },
  'churn': {
    title: "Insightful Churn Predictor",
    subtitle: "Enterprise Customer Retention ML Engine",
    tag: "Predictive Analytics • Data Science",
    summary: "Production-ready predictive intelligence platform forecasting customer subscription cancellation and churn likelihood.",
    architecture: ["Scikit-Learn", "Pandas / NumPy", "Python API", "Feature Engineering", "Data Analytics"],
    metrics: [
      { label: "Model Accuracy", val: "85%+ Verified Precision" },
      { label: "Inference Engine", val: "Batch & Real-time Scoring" },
      { label: "Actionable Insights", val: "Feature Importance Ranking" }
    ],
    details: "Trained on multi-dimensional behavioral datasets using gradient boosted and random forest classifiers. Features dynamic risk score thresholds with customer retention advice.",
    github: "https://github.com/mikhailemad999"
  },
  'erp': {
    title: "Modular Enterprise ERP Suite",
    subtitle: "HR, Procurement & Accounting Engine",
    tag: "Full Stack • Enterprise Systems",
    summary: "End-to-end organizational platform handling employee payroll, vendor procurement, automated ledger accounting, and inventory across multiple warehouses.",
    architecture: ["Django", "PostgreSQL", "React", "Role-Based Access Control", "pgAdmin"],
    metrics: [
      { label: "Modular Design", val: "HR + Billing + Inventory" },
      { label: "Query Speed", val: "Indexed complex joins (40% gain)" },
      { label: "Security", val: "Multi-tenant tenant isolation" }
    ],
    details: "Built with extensive auditing logging, role permissions per branch department, and automated financial statements balancing.",
    github: "https://github.com/mikhailemad999"
  },
  'serverops': {
    title: "ServerOps & Cloud Automation Toolkit",
    subtitle: "Linux & Hosting Infrastructure Orchestration",
    tag: "DevOps • Server Administration",
    summary: "Automated server administration toolkit for cPanel, SiteGround hosting environments, and Ubuntu Linux virtual private servers.",
    architecture: ["Ubuntu Server", "cPanel API / WHM", "SiteGround DNS", "Bash Scripting", "Python Automations", "Nginx / Apache"],
    metrics: [
      { label: "Server Availability", val: "99.9% Uptime Maintenance" },
      { label: "SSL Automation", val: "Zero-Downtime Renewals" },
      { label: "Support Scope", val: "50+ Enterprise Staff Users" }
    ],
    details: "Standardized virtual host setup routines, automated database backup rotation to off-site nodes, and configured hardened SSH firewalls.",
    github: "https://github.com/mikhailemad999"
  },
  'ecommerce': {
    title: "NextGen E-Commerce Engine",
    subtitle: "Secure Payment & Dynamic Checkout Platform",
    tag: "Full Stack • E-Commerce",
    summary: "High-conversion online storefront featuring instant cart persistence, inventory concurrency locking, secure payment gateway integrations, and order tracking.",
    architecture: ["React.js", "Django REST", "PostgreSQL", "Payment Gateways", "JWT Auth"],
    metrics: [
      { label: "Checkout Speed", val: "< 1.5s Load Time" },
      { label: "Concurrency", val: "Race-condition prevention" },
      { label: "Admin Console", val: "Live Revenue Analytics" }
    ],
    details: "Features tokenized payment processing, webhook listener resilience, dynamic discount engine, and automated email order confirmations.",
    github: "https://github.com/mikhailemad999"
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const slot = document.getElementById('modal-content-slot');
  const viewBtns = document.querySelectorAll('.view-details-btn');

  if (!modal || !slot) return;

  function openModal(key) {
    const data = projectData[key];
    if (!data) return;

    let metricsHtml = data.metrics.map(m => `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px; text-align: center;">
        <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">${m.label}</div>
        <div style="font-size: 14px; font-weight: 700; color: var(--neon-cyan); margin-top: 2px;">${m.val}</div>
      </div>
    `).join('');

    let archHtml = data.architecture.map(a => `<span class="tech-tag" style="margin-right: 4px; margin-bottom: 4px; display: inline-block;">${a}</span>`).join('');

    slot.innerHTML = `
      <div style="display: inline-block; background: rgba(0,242,254,0.1); color: var(--neon-cyan); font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; margin-bottom: 12px; border: 1px solid rgba(0,242,254,0.25);">
        ${data.tag}
      </div>
      <h2 style="font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 4px;">${data.title}</h2>
      <div style="font-size: 14px; color: var(--electric-blue); font-weight: 600; margin-bottom: 16px;">${data.subtitle}</div>
      
      <p style="color: var(--text-secondary); font-size: 14.5px; line-height: 1.6; margin-bottom: 20px;">${data.summary}</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 24px;">
        ${metricsHtml}
      </div>

      <div style="margin-bottom: 20px;">
        <div style="font-size: 13px; font-weight: 700; color: #fff; text-transform: uppercase; margin-bottom: 8px;">Architecture Stack</div>
        <div>${archHtml}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 700; color: #fff; text-transform: uppercase; margin-bottom: 6px;">Key Technical Accomplishment</div>
        <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6;">${data.details}</p>
      </div>

      <div style="display: flex; gap: 12px; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
        <a href="${data.github}" target="_blank" rel="noreferrer" class="btn btn-primary btn-sm">
          View Repository on GitHub
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-proj');
      openModal(projKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* ==========================================================================
   6. INTERACTIVE SERVER TERMINAL SIMULATOR
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const cmdPills = document.querySelectorAll('.cmd-pill');

  if (!input || !output) return;

  const commands = {
    'help': () => `
<div style="color: var(--neon-cyan); font-weight: bold;">AVAILABLE COMMANDS:</div>
  <span style="color: #38bdf8;">petra</span>        - View current role & server operations at Petra Software
  <span style="color: #38bdf8;">cpanel</span>       - Display cPanel & SiteGround hosting architecture
  <span style="color: #38bdf8;">ubuntu</span>       - Inspect Ubuntu Linux VPS deployment and stack
  <span style="color: #38bdf8;">skills</span>       - Matrix of Full Stack, AI & Server competencies
  <span style="color: #38bdf8;">projects</span>     - List top projects with GitHub references
  <span style="color: #38bdf8;">linkedin</span>     - Open official LinkedIn profile
  <span style="color: #38bdf8;">download-cv</span>  - Trigger instant 2026 PDF resume download
  <span style="color: #38bdf8;">whoami</span>       - Display engineer profile and background
  <span style="color: #38bdf8;">uptime</span>       - Show server uptime & professional experience duration
  <span style="color: #38bdf8;">contact</span>      - Get phone, email, and location details
  <span style="color: #38bdf8;">clear</span>        - Clear terminal screen
    `,
    'linkedin': () => {
      window.open('https://www.linkedin.com/in/mikhail-emad-b67805372', '_blank');
      return `<div style="color: #38bdf8; font-weight: bold;">✔ Opening LinkedIn Profile: https://www.linkedin.com/in/mikhail-emad-b67805372</div>`;
    },
    'petra': () => `
<div style="color: var(--matrix-emerald); font-weight: bold;">[PETRA SOFTWARE - 2025 TO PRESENT]</div>
Role: Junior IT Support Technician & Server Administrator
Location: Assiut, Egypt
Core Operations:
  • Managing 50+ enterprise employee workstations and networking topologies.
  • Administering cPanel, SiteGround, and Ubuntu Linux web servers.
  • Configuring DNS records (A, CNAME, MX, TXT), automated SSL, and SSH credentials.
  • Fast Tier 1 & 2 diagnostic resolution with developer patch escalation.
    `,
    'cpanel': () => `
<div style="color: var(--server-amber); font-weight: bold;">[CPANEL & SITEGROUND HOSTING MANAGEMENT]</div>
  • Multi-domain virtual host provisioning & staging environments.
  • Automated Let's Encrypt SSL lifecycle and HTTPS enforcement.
  • MySQL database creation, remote user privileges & automated cron backups.
  • DNS zone file management, DKIM/SPF email deliverability records.
    `,
    'ubuntu': () => `
<div style="color: #a855f7; font-weight: bold;">[UBUNTU LINUX SERVER SPECS]</div>
  OS: Ubuntu 22.04 LTS x86_64
  Web Servers: Nginx Reverse Proxy / Apache
  Daemon Services: Gunicorn, Celery Worker, Redis, PostgreSQL 15
  Firewall / Security: UFW, SSH Key Authentication, Fail2ban
  Shell: Bash automation scripts for virtual environment deployment
    `,
    'skills': () => `
<div style="color: var(--neon-cyan); font-weight: bold;">[CORE TECHNICAL EXPERTISE]</div>
  • Backend: Python, Django, Django REST Framework, RESTful APIs, JWT, RBAC
  • Frontend: React.js, TypeScript, JavaScript (ES6+), Modern HTML5/CSS3
  • AI & ML: Machine Learning, Scikit-Learn, Predictive Analytics, Classification
  • Servers: Ubuntu Server, cPanel, SiteGround, DNS, SSL, SSH, Linux Bash
  • Databases: PostgreSQL, MySQL, MS SQL Server, MongoDB, Query Optimization
    `,
    'projects': () => `
<div style="color: #fff; font-weight: bold;">[TOP PRODUCTION PROJECTS - GITHUB: @mikhailemad999]</div>
  1. Trade Spark Hub 14  -> Scalable multi-module commerce & ERP [Django + React]
  2. MedAI-Hub           -> Diagnostic AI ML model integration with patient EHR
  3. Churn Predictor     -> 85%+ Accuracy customer retention classification engine
  4. Enterprise ERP      -> Multi-tenant HR, billing & inventory platform
  5. ServerOps Toolkit   -> Automated Linux & cPanel provisioning suite
    `,
    'download-cv': () => {
      const link = document.createElement('a');
      link.href = 'Mikhail_Emad_Resume_2026.pdf';
      link.download = 'Mikhail_Emad_Resume_2026.pdf';
      link.click();
      return `<div style="color: var(--matrix-emerald); font-weight: bold;">✔ Download started: Mikhail_Emad_Resume_2026.pdf</div>`;
    },
    'whoami': () => `
Mikhail Emad Alber (AI Engineer • Full Stack Developer • Server Support @ Petra Software)
B.Sc. in Computer Science & Engineering (EELU)
Passionate about high-throughput web systems, reliable servers, and real-world AI applications.
    `,
    'uptime': () => `
2+ Years Full Stack Experience • 1 Year AI/ML • 1 Year Server Ops • 99.9% Server Availability
    `,
    'contact': () => `
Email: Mikhailemad999@gmail.com
Phone: (+20) 128 998 1076
GitHub: https://github.com/mikhailemad999
Location: New Cairo & Assiut, Egypt
    `,
    'clear': () => {
      output.innerHTML = '';
      return '';
    }
  };

  function executeCommand(cmdText) {
    const raw = cmdText.trim().toLowerCase();
    if (!raw) return;

    // Echo input
    const echoRow = document.createElement('div');
    echoRow.innerHTML = `<span style="color: var(--matrix-emerald); font-weight: 600;">ubuntu@petra-server:~$</span> <span style="color: #fff;">${cmdText}</span>`;
    output.appendChild(echoRow);

    // Process output
    const outDiv = document.createElement('div');
    outDiv.style.margin = '4px 0 12px 0';

    if (commands[raw]) {
      const res = commands[raw]();
      if (raw !== 'clear') {
        outDiv.innerHTML = res;
        output.appendChild(outDiv);
      }
    } else {
      outDiv.innerHTML = `<span style="color: #ef4444;">Command not found: '${raw}'. Type <span style="color: var(--neon-cyan); font-weight:bold;">help</span> for a list of commands.</span>`;
      output.appendChild(outDiv);
    }

    output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
    }
  });

  cmdPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      executeCommand(cmd);
      input.focus();
    });
  });
}

/* ==========================================================================
   7. COPY-TO-CLIPBOARD & TOAST SYSTEM
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');
  if (!toast) return;

  if (toastText) toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        btn.textContent = 'Copied!';
        showToast(`Copied ${textToCopy} to clipboard!`);
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 2000);
      }).catch(() => {
        showToast('Failed to copy');
      });
    });
  });
}

/* ==========================================================================
   8. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('form-submit-btn');

  if (!form || !btn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    
    btn.disabled = true;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg> Sending message...`;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Message Sent Successfully!`;
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-emerald');

      showToast(`Thank you, ${name}! Your inquiry was prepared for Mikhail.`);
      form.reset();

      setTimeout(() => {
        btn.classList.remove('btn-emerald');
        btn.classList.add('btn-primary');
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Send Message`;
      }, 4000);
    }, 900);
  });
}

/* ==========================================================================
   9. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '70px';
      navLinks.style.left = '20px';
      navLinks.style.right = '20px';
      navLinks.style.background = 'rgba(8, 12, 20, 0.98)';
      navLinks.style.padding = '20px';
      navLinks.style.borderRadius = '16px';
      navLinks.style.border = '1px solid var(--border-subtle)';
      navLinks.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8)';
    }
  });

  // Close mobile menu on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}
