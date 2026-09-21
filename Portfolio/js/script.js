/* ============================================================
   Oracle Eloqua Portfolio — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1. Header scroll effect ---------- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    });

    /* ---------- 2. Hamburger (no-op — nav replaced by search bar) ---------- */
    // Hamburger kept for future mobile drawer; search bar handles navigation.

    /* ---------- 3. Oracle-style Search Bar (Expandable) ---------- */
    const searchWrap     = document.getElementById('hdrSearchWrap');
    const searchInput    = document.getElementById('hdrSearchInput');
    const searchDropdown = document.getElementById('hdrSearchDropdown');
    const searchBox      = document.getElementById('hdrSearchBox');
    const searchToggle   = document.getElementById('hdrSearchToggle');
    const searchClose    = document.getElementById('hdrSearchClose');

    // All searchable sections — label, subtitle, icon, anchor
    const SEARCH_ITEMS = [
        { label: 'About',                     sub: 'Who I am & my background',                    icon: 'fa-solid fa-user',              anchor: '#hero' },
        { label: 'Professional Experience',   sub: 'Innovacx Tech Labs · 2021–2026',              icon: 'fa-solid fa-briefcase',         anchor: '#experience' },
        { label: 'Oracle Certifications',     sub: 'Oracle B2B Master · Eloqua Specialist',       icon: 'fa-solid fa-certificate',       anchor: '#career-highlights', tab: 'vtab-certifications' },
        { label: 'Enterprise Experience',     sub: 'IT · Real Estate · Pharma · B2B',             icon: 'fa-solid fa-laptop-code',       anchor: '#career-highlights', tab: 'vtab-expertise' },
        { label: 'Core Expertise',            sub: 'Implementation · CRM · Campaigns · Analytics', icon: 'fa-solid fa-sitemap',          anchor: '#career-highlights', tab: 'vtab-projects' },
        { label: 'Services & Solutions',      sub: 'New Impl · Optimization · Training · Support', icon: 'fa-solid fa-rocket',           anchor: '#career-highlights', tab: 'vtab-solutions' },
        { label: 'Why Work With Me',          sub: 'Consultative · Technical · Compliant',        icon: 'fa-solid fa-comments',          anchor: '#career-highlights', tab: 'vtab-howwork' },
        { label: 'Integration Ecosystem',     sub: 'Salesforce · OSC · LinkedIn · REST APIs',     icon: 'fa-solid fa-arrows-spin',       anchor: '#career-highlights', tab: 'vtab-integration' },
        { label: 'Enabling AI in Eloqua',     sub: 'Fatigue Analysis · STO · GenAI · Account Intelligence', icon: 'fa-solid fa-wand-magic-sparkles', anchor: '#career-highlights', tab: 'vtab-ai-eloqua' },
        { label: 'Implementation Process',    sub: 'Discovery → Design → Config → Go-Live',      icon: 'fa-solid fa-gears',             anchor: '#implementations' },
        { label: 'Lead to Customer Journey',  sub: 'Web Capture → Score → Nurture → MQL',        icon: 'fa-solid fa-filter',            anchor: '#lead-journey' },
        { label: "Let's Connect",             sub: 'Contact · LinkedIn · Resume',                 icon: 'fa-solid fa-envelope',          anchor: '#contact', isContact: true },
    ];

    let focusedIndex = -1;

    function expandSearch() {
        if (!searchWrap || !searchBox) return;
        searchWrap.classList.add('expanded');
        searchBox.classList.add('expanded');
        searchBox.setAttribute('aria-expanded', 'true');
        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
                renderDropdown(searchInput.value || '');
            }, 60);
        }
    }

    function collapseSearch() {
        if (!searchWrap || !searchBox) return;
        searchWrap.classList.remove('expanded');
        searchBox.classList.remove('expanded');
        searchBox.setAttribute('aria-expanded', 'false');
        closeDropdown();
        if (searchInput) {
            searchInput.value = '';
            searchInput.blur();
        }
    }

    // Toggle on search symbol button click
    if (searchToggle) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (searchWrap && searchWrap.classList.contains('expanded')) {
                if (searchInput && searchInput.value.trim().length > 0) {
                    renderDropdown(searchInput.value);
                } else {
                    collapseSearch();
                }
            } else {
                expandSearch();
            }
        });
    }

    // Click on search box when collapsed expands it
    if (searchBox) {
        searchBox.addEventListener('click', (e) => {
            if (searchWrap && !searchWrap.classList.contains('expanded')) {
                expandSearch();
            }
        });
    }

    // Close button click collapses search
    if (searchClose) {
        searchClose.addEventListener('click', (e) => {
            e.stopPropagation();
            collapseSearch();
        });
    }

    function buildItem(item, index) {
        const li = document.createElement('li');
        li.className = 'hdr-search-item';
        li.setAttribute('role', 'option');
        li.setAttribute('data-index', index);
        li.innerHTML = `
            <div class="hdr-search-item-icon"><i class="${item.icon}"></i></div>
            <div class="hdr-search-item-text">
                <span class="hdr-search-item-label">${item.label}</span>
                <span class="hdr-search-item-sub">${item.sub}</span>
            </div>`;
        li.addEventListener('mousedown', (e) => {
            e.preventDefault(); // prevent blur before click fires
            navigateTo(item);
        });
        return li;
    }

    function renderDropdown(query) {
        if (!searchDropdown) return;
        searchDropdown.innerHTML = '';
        focusedIndex = -1;

        const q = query.trim().toLowerCase();
        const filtered = q
            ? SEARCH_ITEMS.filter(it =>
                it.label.toLowerCase().includes(q) ||
                it.sub.toLowerCase().includes(q))
            : SEARCH_ITEMS;

        if (filtered.length === 0) {
            const li = document.createElement('li');
            li.className = 'hdr-search-no-results';
            li.textContent = 'No results found.';
            searchDropdown.appendChild(li);
        } else {
            filtered.forEach((item, i) => {
                searchDropdown.appendChild(buildItem(item, i));
            });
        }

        searchDropdown.classList.add('open');
        if (searchBox) searchBox.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
        if (searchDropdown) searchDropdown.classList.remove('open');
        if (searchBox && (!searchWrap || !searchWrap.classList.contains('expanded'))) {
            searchBox.setAttribute('aria-expanded', 'false');
        }
        focusedIndex = -1;
    }

    function navigateTo(item) {
        collapseSearch();

        // If item belongs to a vtab section — open modal popup directly
        if (item.tab) {
            openVtabModal(item.tab);
        }

        // If contact — open modal
        if (item.isContact) { openModal(); return; }

        // Smooth scroll to anchor
        const target = document.querySelector(item.anchor);
        if (target) {
            const offset = 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    function moveFocus(dir) {
        if (!searchDropdown) return;
        const items = searchDropdown.querySelectorAll('.hdr-search-item');
        if (!items.length) return;
        items[focusedIndex]?.classList.remove('focused');
        focusedIndex = (focusedIndex + dir + items.length) % items.length;
        items[focusedIndex]?.classList.add('focused');
        items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }

    if (searchInput) {
        // Open on focus / click
        searchInput.addEventListener('focus', () => {
            if (searchWrap && searchWrap.classList.contains('expanded')) {
                renderDropdown(searchInput.value);
            }
        });
        searchInput.addEventListener('click', () => {
            if (searchWrap && searchWrap.classList.contains('expanded')) {
                renderDropdown(searchInput.value);
            }
        });

        // Filter as you type
        searchInput.addEventListener('input', () => renderDropdown(searchInput.value));

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (!searchDropdown || !searchDropdown.classList.contains('open')) return;
            if (e.key === 'ArrowDown')  { e.preventDefault(); moveFocus(+1); }
            if (e.key === 'ArrowUp')    { e.preventDefault(); moveFocus(-1); }
            if (e.key === 'Escape')     { collapseSearch(); }
            if (e.key === 'Enter') {
                e.preventDefault();
                const idx = focusedIndex >= 0 ? focusedIndex : 0;
                const q = searchInput.value.trim().toLowerCase();
                const filtered = q
                    ? SEARCH_ITEMS.filter(it => it.label.toLowerCase().includes(q) || it.sub.toLowerCase().includes(q))
                    : SEARCH_ITEMS;
                const item = filtered[idx];
                if (item) navigateTo(item);
            }
        });
    }

    // Close on outside click
    document.addEventListener('mousedown', (e) => {
        if (!e.target.closest('#hdrSearchWrap')) {
            if (searchWrap && searchWrap.classList.contains('expanded')) {
                collapseSearch();
            } else {
                closeDropdown();
            }
        }
    });

    // Close on Escape anywhere
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchWrap && searchWrap.classList.contains('expanded')) {
            collapseSearch();
        }
    });


    /* ---------- 3. Fade-up animation (IntersectionObserver) ---------- */
    const fadeEls = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => observer.observe(el));

    /* ---------- 4. Contact Modal ---------- */
    const modal        = document.getElementById('contactModal');
    const overlay      = document.getElementById('modalOverlay');
    const closeBtn     = document.getElementById('closeModal');

    // Collect all trigger buttons
    const modalTriggers = [
        document.getElementById('heroConnectBtn'),
        document.getElementById('floatingConnectBtn'),
        document.getElementById('ctaConnectBtn'),
    ].filter(Boolean);

    function openModal() {
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.querySelector('input, textarea') && modal.querySelector('input, textarea').focus();
    }

    function closeModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalTriggers.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
    document.addEventListener('click', (e) => {
        if (e.target.closest('.open-contact-modal')) {
            e.preventDefault();
            openModal();
        }
    });
    if (closeBtn)  closeBtn.addEventListener('click', closeModal);
    if (overlay)   overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    /* ---------- 5. Contact form (Formspree) ---------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending…';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });

                if (response.ok) {
                    submitBtn.textContent = 'Sent! ✓';
                    submitBtn.style.backgroundColor = '#2e7d32';
                    contactForm.reset();
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                        closeModal();
                    }, 2500);
                } else {
                    throw new Error('Server error');
                }
            } catch {
                submitBtn.textContent = 'Error – try again';
                submitBtn.style.backgroundColor = '#c62828';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    /* ---------- 6. Experience Stage Interactivity ---------- */
    const expStages = document.querySelectorAll('.exp-stage-item');
    if (expStages.length > 0) {
        expStages.forEach(stage => {
            stage.addEventListener('mouseenter', () => {
                expStages.forEach(s => s.classList.remove('hovered'));
                stage.classList.add('hovered');
            });
        });
    }

    /* ---------- 7. Integration hub spoke animation stagger ---------- */
    const spokeLines = document.querySelectorAll('.spoke-line');
    spokeLines.forEach((line, i) => {
        const dot = line.querySelector('::after');
        line.style.setProperty('--delay', `${i * 0.35}s`);
    });

    // Apply animation delay via CSS custom property on the element
    spokeLines.forEach((line, i) => {
        line.style.animationDelay = `${i * 0.35}s`;
    });

    // For the ::after pseudo-element, apply it via a CSS class or inline style on the parent
    // We replicate this with an animation-delay on the spoke-line itself since ::after inherits timing
    spokeLines.forEach((line, i) => {
        line.setAttribute('style', `animation-delay: ${i * 0.35}s;`);
    });

    /* ---------- 8. Smooth scroll for nav links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#contact') { e.preventDefault(); openModal(); return; }
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ---------- 9. Active nav link on scroll ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightNav() {
        const scrollY = window.scrollY + 90;
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                const id = section.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.toggle('active-nav', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav();

    /* ---------- 10. Services & Expertise Full-Width Popup Modal ---------- */
    const VTAB_ORDER = [
        { id: 'vtab-certifications', title: 'Oracle Certifications', subtitle: 'Validated credentials across the Oracle Marketing Cloud ecosystem' },
        { id: 'vtab-expertise',      title: 'Enterprise Oracle Eloqua Experience', subtitle: 'Multi-instance administration & CRM integration highlights across global sectors' },
        { id: 'vtab-projects',       title: 'Core Expertise', subtitle: 'Implementation, Campaign Canvas, Lead Scoring Models & Analytics' },
        { id: 'vtab-solutions',      title: 'Services & Solutions', subtitle: 'Greenfield rollouts, system audits, team enablement & ongoing BAU support' },
        { id: 'vtab-howwork',        title: 'Why Work With Me', subtitle: 'Consultative methodology, technical depth & regulatory compliance' },
        { id: 'vtab-integration',    title: 'Integration Ecosystem', subtitle: 'Architecting bidirectional data pipelines with Salesforce, OSC & APIs' },
        { id: 'vtab-ai-eloqua',      title: 'Enabling AI in Oracle Eloqua', subtitle: 'Predictive fatigue analysis, STO, GenAI & account intelligence' }
    ];

    let currentVtabIndex = 0;
    const vtabModalOverlay = document.getElementById('vtabModalOverlay');
    const vtabModal        = document.getElementById('vtabModal');
    const vtabModalTitle   = document.getElementById('vtabModalTitle');
    const vtabModalBody    = document.getElementById('vtabModalBody');
    const closeVtabModal   = document.getElementById('closeVtabModal');
    const vtabPrevBtn      = document.getElementById('vtabPrevBtn');
    const vtabNextBtn      = document.getElementById('vtabNextBtn');
    const vtabStepCounter  = document.getElementById('vtabStepCounter');

    function openVtabModal(tabId) {
        const index = VTAB_ORDER.findIndex(item => item.id === tabId);
        if (index === -1) return;
        currentVtabIndex = index;
        renderVtabModalContent();

        if (vtabModal && vtabModalOverlay) {
            vtabModal.classList.add('active');
            vtabModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeVtabModalFunc() {
        if (!vtabModal) return;
        vtabModal.classList.remove('active');
        vtabModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderVtabModalContent() {
        const currentItem = VTAB_ORDER[currentVtabIndex];
        const panel = document.getElementById(currentItem.id);
        if (!panel || !vtabModalBody) return;

        if (vtabModalTitle) vtabModalTitle.textContent = currentItem.title;
        if (vtabStepCounter) vtabStepCounter.textContent = `${currentVtabIndex + 1} / ${VTAB_ORDER.length}`;

        // Populate modal body with stored panel HTML
        vtabModalBody.innerHTML = panel.innerHTML;

        // Force all fade-up elements inside modal body to be visible
        vtabModalBody.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));

        // Update Prev / Next buttons state
        if (vtabPrevBtn) vtabPrevBtn.disabled = currentVtabIndex === 0;
        if (vtabNextBtn) vtabNextBtn.disabled = currentVtabIndex === VTAB_ORDER.length - 1;

        // Reset scroll position to top
        vtabModalBody.scrollTop = 0;
    }

    // Attach click and keyboard handlers to executive pills & cards (CLICK to open)
    const execTriggers = document.querySelectorAll('.exec-nav-pill, .exec-card, .service-tile');

    execTriggers.forEach(trigger => {
        const tabId = trigger.getAttribute('data-tab');
        if (!tabId) return;

        // Click opens modal
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openVtabModal(tabId);
        });

        // Keyboard Enter or Space
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openVtabModal(tabId);
            }
        });
    });

    // Modal Stepper Prev / Next
    if (vtabPrevBtn) {
        vtabPrevBtn.addEventListener('click', () => {
            if (currentVtabIndex > 0) {
                currentVtabIndex--;
                renderVtabModalContent();
            }
        });
    }

    if (vtabNextBtn) {
        vtabNextBtn.addEventListener('click', () => {
            if (currentVtabIndex < VTAB_ORDER.length - 1) {
                currentVtabIndex++;
                renderVtabModalContent();
            }
        });
    }

    if (closeVtabModal)   closeVtabModal.addEventListener('click', closeVtabModalFunc);
    if (vtabModalOverlay) vtabModalOverlay.addEventListener('click', closeVtabModalFunc);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && vtabModal?.classList.contains('active')) {
            closeVtabModalFunc();
        }
    });

    /* ---------- 11. Certificate Lightbox Modal ---------- */
    const certLightboxModal   = document.getElementById('certLightboxModal');
    const certLightboxOverlay = document.getElementById('certLightboxOverlay');
    const closeCertLightbox   = document.getElementById('closeCertLightbox');
    const certLightboxImg     = document.getElementById('certLightboxImg');
    const certLightboxTitle   = document.getElementById('certLightboxTitle');

    function openCertLightbox(src, title) {
        if (!certLightboxModal || !certLightboxImg) return;
        certLightboxImg.src = src;
        if (certLightboxTitle) certLightboxTitle.textContent = title;
        certLightboxModal.classList.add('active');
        certLightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCertLightboxFunc() {
        if (!certLightboxModal) return;
        certLightboxModal.classList.remove('active');
        certLightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Delegation to support desktop tabs + cloned mobile accordions
    document.addEventListener('click', (e) => {
        const box = e.target.closest('.cert-img-box');
        if (box) {
            const src = box.getAttribute('data-cert-src');
            const title = box.getAttribute('data-cert-title');
            if (src) openCertLightbox(src, title);
        }
    });

    if (closeCertLightbox)   closeCertLightbox.addEventListener('click', closeCertLightboxFunc);
    if (certLightboxOverlay) certLightboxOverlay.addEventListener('click', closeCertLightboxFunc);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certLightboxModal?.classList.contains('active')) {
            closeCertLightboxFunc();
        }
    });


    /* ---------- 12. Enterprise Industry Experience Detail Modal ---------- */
    const INDUSTRY_DETAILS = {
        it: {
            icon: 'fa-solid fa-laptop-code',
            iconClass: 'icon-it',
            badgeIcon: 'fa-solid fa-network-wired',
            badgeClass: 'badge-it',
            badgeText: 'IT & Virtual Events',
            scopeText: '22 Instances Managed · 6 Greenfield Implementations',
            title: 'Eloqua Administration & Greenfield Multi-Instance Governance',
            subtitle: 'Enterprise-wide marketing automation infrastructure, multi-instance administration, and automated event workflows for a global IT & Virtual Events corporation.',
            metrics: [
                { num: '22', label: 'Eloqua Instances Administered' },
                { num: '6', label: 'Greenfield Implementations' },
                { num: '50K+', label: 'Monthly Event Registrants' },
                { num: '99.8%', label: 'Email Deliverability Rate' }
            ],
            overview: 'Served as Lead Oracle Eloqua Administrator managing day-to-day platform health, access security, and campaign operations across 22 enterprise Eloqua instances. Spearheaded 6 complete greenfield implementations from initial IP warming and authentication setup to go-live for global virtual technology summits and event series.',
            responsibilities: [
                '<strong>Multi-Instance Governance:</strong> Administered user access, security groups, field-level permissions, and deliverability monitoring across 22 global Eloqua instances.',
                '<strong>Greenfield Setup & IP Warming:</strong> Executed 6 full greenfield rollouts including SPF/DKIM DNS configuration, dedicated IP warming schedules, branded microsites, and default headers/footers.',
                '<strong>Event Campaign Automation:</strong> Built end-to-end event registration architectures using Program Canvas, automated webinar sync (ON24/Zoom/Teams), calendar file attachments, and real-time post-event attendee tracking.',
                '<strong>Lead Scoring & Distribution:</strong> Designed multi-attribute lead scoring models based on session participation duration, content downloads, and web behavior to qualify and route MQLs immediately.'
            ],
            techStack: ['Eloqua Multi-Instance Admin', 'IP Warming & DNS Config', 'Program Canvas Automation', 'Webinar Integrations (ON24/Zoom)', 'Custom Data Objects (CDO)', 'Insight BI Dashboards', 'Lead Scoring Matrix']
        },
        construction: {
            icon: 'fa-solid fa-city',
            iconClass: 'icon-construction',
            badgeIcon: 'fa-solid fa-building-user',
            badgeClass: 'badge-construction',
            badgeText: 'Construction & Real Estate',
            scopeText: 'Salesforce CRM Integration · Project-Based Nurture',
            title: 'Project-Based Marketing Architecture & Salesforce CRM Integration',
            subtitle: 'Scalable Eloqua data architecture and real-time bidirectional Salesforce CRM integration for high-value commercial & residential real estate developments.',
            metrics: [
                { num: '100%', label: 'Salesforce Auto-Sync' },
                { num: '45%', label: 'Lead-to-Opp Conversion' },
                { num: '0 Latency', label: 'Real-Time Lead Handoff' },
                { num: '15+', label: 'Property Projects Tracked' }
            ],
            overview: 'Architected and deployed custom Oracle Eloqua solutions for major construction and real estate enterprises. Built project-centric data models capable of tracking buyer preferences across multiple property developments and automated lead routing directly into Salesforce for immediate sales rep follow-up.',
            responsibilities: [
                '<strong>Project-Centric Data Modeling:</strong> Developed Custom Data Objects (CDOs) to capture property preferences, site visit requests, floor plan views, and financing inquiries.',
                '<strong>Bi-Directional Salesforce Integration:</strong> Configured custom Auto Synchs and External Calls synchronizing Contacts, Leads, Accounts, and Opportunities between Eloqua and Salesforce in real time.',
                '<strong>Automated Buyer Nurture Streams:</strong> Created multi-stage Program Canvas campaigns tailored to buyer readiness, property type (commercial vs. residential), and location preference.',
                '<strong>Enablement & Training:</strong> Conducted comprehensive training for client marketing teams on campaign execution, naming conventions, asset creation, and deliverability best practices.'
            ],
            techStack: ['Salesforce Integration', 'Custom Data Objects (CDO)', 'Auto Synchs & External Calls', 'Lead Distribution Engine', 'Branded Microsites', 'Deliverability Management', 'User Enablement']
        },
        b2b: {
            icon: 'fa-solid fa-industry',
            iconClass: 'icon-b2b',
            badgeIcon: 'fa-solid fa-boxes-packing',
            badgeClass: 'badge-b2b',
            badgeText: 'B2B Tagging & Labeling',
            scopeText: 'Oracle Sales Cloud (OSC) Integration · Web Ingestion',
            title: 'Oracle Sales Cloud (OSC) Integration & Global Lead Ingestion',
            subtitle: 'Enterprise B2B Eloqua integration with Oracle CX / Sales Cloud and automated website lead ingestion for global industrial labeling operations.',
            metrics: [
                { num: '100%', label: 'OSC Pipeline Alignment' },
                { num: '30+', label: 'Global Forms Integrated' },
                { num: 'Real-Time', label: 'Form Processing' },
                { num: 'Global', label: 'Lead Validation' }
            ],
            overview: 'Provided technical architecture and support for Oracle Eloqua within a global B2B industrial manufacturing and labeling enterprise. Connected external web lead channels into Oracle Sales Cloud (OSC) through Eloqua, empowering sales teams with full visibility into digital buyer intent.',
            responsibilities: [
                '<strong>Oracle Sales Cloud (OSC) Integration:</strong> Built and maintained bidirectional data pipelines synchronizing leads, contacts, and account engagements between Eloqua and Oracle Sales Cloud.',
                '<strong>Global Web Lead Capture:</strong> Integrated 30+ website lead forms with hidden tracking parameters, spam protection, and instant auto-responder workflows.',
                '<strong>Custom Landing Pages & Forms:</strong> Developed responsive HTML email templates, gated product catalog landing pages, and interactive sample request forms.',
                '<strong>Cross-Functional Collaboration:</strong> Partnered with web development, sales ops, and regional marketing managers to unify global lead management processes.'
            ],
            techStack: ['Oracle Sales Cloud (OSC)', 'Web Form Integration', 'Custom HTML Emails', 'Landing Page Architecture', 'Gated Content Workflows', 'Account-Based Marketing', 'Cross-Functional Ops']
        },
        pharma: {
            icon: 'fa-solid fa-prescription-bottle-medical',
            iconClass: 'icon-pharma',
            badgeIcon: 'fa-solid fa-capsules',
            badgeClass: 'badge-pharma',
            badgeText: 'Medical & Pharmaceutical',
            scopeText: 'Multi-Brand Nurture Architecture · Compliance & Analytics',
            title: 'Multi-Brand Email Campaign Management & Healthcare Analytics',
            subtitle: 'Compliant multi-brand email campaign operations, healthcare professional (HCP) nurturing, and Insight analytics for a major pharmaceutical enterprise.',
            metrics: [
                { num: 'Multi-Brand', label: 'Portfolio Managed' },
                { num: '100%', label: 'Healthcare Compliance' },
                { num: 'Custom BI', label: 'Insight Dashboards' },
                { num: '3.2x', label: 'HCP Engagement Growth' }
            ],
            overview: 'Managed multi-brand email campaign configuration, execution, and performance analytics for a large pharmaceutical enterprise. Maintained strict compliance with healthcare regulatory guidelines (CAN-SPAM/GDPR) while optimizing digital engagement across healthcare providers.',
            responsibilities: [
                '<strong>Multi-Brand Campaign Execution:</strong> Managed technical setup and campaign execution across multiple pharmaceutical product lines while maintaining brand governance and segment isolation.',
                '<strong>Insight BI & Performance Analytics:</strong> Built custom Oracle Eloqua Insight reports and executive dashboards to measure open rates, click-throughs, sample requests, and campaign ROI.',
                '<strong>HCP Nurturing & Segment Filtering:</strong> Designed automated re-engagement workflows and dynamic content targeting tailored to medical specialization and prescribing behavior.',
                '<strong>Compliance & Deliverability:</strong> Oversaw preference centers, opt-in management, and bounce handling to maintain 99%+ inbox placement.'
            ],
            techStack: ['Multi-Brand Management', 'Eloqua Insight BI', 'Healthcare Regulatory Compliance', 'Dynamic Email Content', 'HCP Lead Nurturing', 'Preference Center Management', 'Deliverability Optimization']
        }
    };

    const indDetailModal   = document.getElementById('indDetailModal');
    const indDetailOverlay = document.getElementById('indDetailOverlay');
    const indDetailBody    = document.getElementById('indDetailModalBody');
    const closeIndDetail   = document.getElementById('closeIndDetailModal');

    function openIndustryDetailModal(industryKey) {
        const data = INDUSTRY_DETAILS[industryKey];
        if (!data || !indDetailModal || !indDetailBody) return;

        indDetailBody.innerHTML = `
            <div class="ind-modal-header">
                <div class="ind-modal-icon-wrap ${data.iconClass}">
                    <i class="${data.icon}"></i>
                </div>
                <div class="ind-modal-meta">
                    <span class="ent-industry-badge ${data.badgeClass}">
                        <i class="${data.badgeIcon}"></i> ${data.badgeText}
                    </span>
                    <h2 class="ind-modal-title" id="indDetailTitle">${data.title}</h2>
                    <p class="ind-modal-subtitle">${data.subtitle}</p>
                </div>
            </div>

            <div class="ind-modal-metrics">
                ${data.metrics.map(m => `
                    <div class="ind-metric-card">
                        <span class="ind-metric-num">${m.num}</span>
                        <span class="ind-metric-label">${m.label}</span>
                    </div>
                `).join('')}
            </div>

            <h3 class="ind-modal-section-title"><i class="fa-solid fa-file-contract"></i> Project Overview &amp; Context</h3>
            <p class="ind-modal-overview-text">${data.overview}</p>

            <h3 class="ind-modal-section-title"><i class="fa-solid fa-list-check"></i> Key Technical Responsibilities &amp; Implementation Details</h3>
            <ul class="ind-modal-list">
                ${data.responsibilities.map(r => `
                    <li><i class="fa-solid fa-circle-check"></i> <div>${r}</div></li>
                `).join('')}
            </ul>

            <div class="ind-modal-footer">
                <div class="ind-modal-tags">
                    ${data.techStack.map(t => `<span class="ent-tech-tag">${t}</span>`).join('')}
                </div>
                <div class="ind-modal-btn-wrap">
                    <a href="#contact" class="btn btn-primary btn-sm" id="modalConnectBtn">Let's Connect</a>
                </div>
            </div>
        `;

        // Attach connect button listener inside modal
        const connBtn = indDetailBody.querySelector('#modalConnectBtn');
        if (connBtn) {
            connBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeIndustryDetailModal();
                openModal();
            });
        }

        indDetailModal.classList.add('active');
        indDetailOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeIndustryDetailModal() {
        if (!indDetailModal) return;
        indDetailModal.classList.remove('active');
        indDetailOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Delegation for Industry Experience Dossier / Trigger Clicks
    document.addEventListener('click', (e) => {
        // Trigger button inside dossier
        const triggerBtn = e.target.closest('.dossier-view-modal-btn');
        if (triggerBtn) {
            e.preventDefault();
            e.stopPropagation();
            const industryKey = triggerBtn.getAttribute('data-industry-trigger');
            if (industryKey) openIndustryDetailModal(industryKey);
            return;
        }

        // Support clicks on legacy ent-card
        const card = e.target.closest('.ent-card');
        if (card) {
            const industryKey = card.getAttribute('data-industry');
            if (industryKey) openIndustryDetailModal(industryKey);
        }
    });

    // Support Keyboard Enter/Space on dossier trigger buttons
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const triggerBtn = e.target.closest('.dossier-view-modal-btn');
            if (triggerBtn) {
                e.preventDefault();
                const industryKey = triggerBtn.getAttribute('data-industry-trigger');
                if (industryKey) openIndustryDetailModal(industryKey);
                return;
            }
            const card = e.target.closest('.ent-card');
            if (card) {
                e.preventDefault();
                const industryKey = card.getAttribute('data-industry');
                if (industryKey) openIndustryDetailModal(industryKey);
            }
        }
    });

    // Recruiter Filter Tabs Handling
    document.addEventListener('click', (e) => {
        const filterBtn = e.target.closest('.recruiter-filter-btn');
        if (!filterBtn) return;
        
        const filterValue = filterBtn.getAttribute('data-filter');
        if (!filterValue) return;

        // Update active class on filter buttons
        const allFilterBtns = document.querySelectorAll('.recruiter-filter-btn');
        allFilterBtns.forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');

        // Filter project dossiers
        const dossiers = document.querySelectorAll('.project-dossier');
        dossiers.forEach(dossier => {
            const industry = dossier.getAttribute('data-industry');
            if (filterValue === 'all' || industry === filterValue) {
                dossier.style.display = 'block';
                setTimeout(() => {
                    dossier.style.opacity = '1';
                    dossier.style.transform = 'translateY(0)';
                }, 10);
            } else {
                dossier.style.opacity = '0';
                dossier.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    dossier.style.display = 'none';
                }, 200);
            }
        });
    });

    if (closeIndDetail)   closeIndDetail.addEventListener('click', closeIndustryDetailModal);
    if (indDetailOverlay) indDetailOverlay.addEventListener('click', closeIndustryDetailModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && indDetailModal?.classList.contains('active')) {
            closeIndustryDetailModal();
        }
    });

});


/* =========================================
   VTAB TAB SWITCHING LOGIC (NEW DESIGN)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const customVtabBtns = document.querySelectorAll('.custom-vtab-btn[data-target]');
    const customVtabPanels = document.querySelectorAll('.custom-vtab-panel');

    customVtabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active from all buttons and panels
            customVtabBtns.forEach(b => b.classList.remove('active'));
            customVtabPanels.forEach(p => {
                p.classList.remove('active');
                p.style.display = 'none';
            });
            
            // Add active to clicked button
            btn.classList.add('active');
            
            // Add active to target panel
            const targetId = btn.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.style.display = 'block';
            }
        });
    });
});
