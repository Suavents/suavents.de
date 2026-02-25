// ─── ACCORDION ────────────────────────────────────────────────────────────────
document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', function () {
        const item = this.closest('.accordion-item');
        const expanded = this.getAttribute('aria-expanded') === 'true';

        // Alle schließen
        document.querySelectorAll('.accordion-header').forEach(b => b.setAttribute('aria-expanded', 'false'));
        document.querySelectorAll('.accordion-content').forEach(c => c.hidden = true);
        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

        // Ausgewähltes öffnen (wenn es vorher geschlossen war)
        if (!expanded) {
            this.setAttribute('aria-expanded', 'true');
            item.querySelector('.accordion-content').hidden = false;
            item.classList.add('open');
        }
    });
});


// ─── GUESTLIST MODAL ──────────────────────────────────────────────────────────
(function () {
    const modal = document.querySelector('.guestlist-modal');
    const openBtns = document.querySelectorAll('.guestlist-btn');
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.guestlist-modal-bg');

    function openModal() {
        modal.hidden = false;
        modal.classList.add('show-modal');
        document.body.style.overflow = 'hidden';
        // Fokus auf Modal-Inhalt für Accessibility
        setTimeout(() => modal.querySelector('.guestlist-modal-content').focus(), 50);
    }

    function closeModal() {
        modal.hidden = true;
        modal.classList.remove('show-modal');
        document.body.style.overflow = '';
    }

    openBtns.forEach(btn => btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        openModal();
    }));

    closeBtn.addEventListener('click', e => { e.preventDefault(); closeModal(); });

    // Overlay-Klick schließt Modal
    overlay.addEventListener('mousedown', e => { if (e.target === overlay) closeModal(); });
    modal.addEventListener('mousedown', e => { if (e.target === modal) closeModal(); });

    // Escape-Taste
    window.addEventListener('keydown', e => {
        if (!modal.hidden && e.key === 'Escape') closeModal();
    });

    // Guestlist-Formular: async submit (kein Seitenreload)
    modal.querySelector('.guestlist-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const msg = this.parentNode.querySelector('.guestlist-message');
        msg.textContent = 'Sending...';

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(this)
            });
            if (response.ok) {
                msg.textContent = "Request sent! We'll be in touch.";
                this.reset();
            } else {
                msg.textContent = 'There was a problem. Please try again.';
            }
        } catch (err) {
            console.error('Guestlist form error:', err);
            msg.textContent = 'Network error. Please try again.';
        }

        setTimeout(() => {
            closeModal();
            msg.textContent = '';
        }, 1800);
    });
})();


// ─── EMAIL SIGNUP FORM (async, konsistent mit Guestlist) ─────────────────────
(function () {
    const form = document.querySelector('.email-form');
    if (!form) return;
    const msg = form.closest('section').querySelector('.form-message');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        msg.textContent = 'Sending...';

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(this)
            });
            if (response.ok) {
                msg.textContent = "You're on the list!";
                this.reset();
            } else {
                msg.textContent = 'There was a problem. Please try again.';
            }
        } catch (err) {
            console.error('Signup form error:', err);
            msg.textContent = 'Network error. Please try again.';
        }
    });
})();


// ─── NEON CURSOR (nur Desktop mit Maus) ──────────────────────────────────────
(function () {
    // Nicht auf Touch-Geräten ausführen
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.querySelector('.neon-cursor');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    function setGlowNormal() {
        cursor.style.boxShadow = '0 0 28px 12px #fa1d1c55, 0 0 38px 18px #ffab0023';
        cursor.style.opacity = '0.68';
    }
    function setGlowActive() {
        cursor.style.boxShadow = '0 0 38px 18px #fa1d1c77, 0 0 50px 22px #ffab0040';
        cursor.style.opacity = '0.72';
    }

    const updateCursor = () => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        setGlowNormal();
        updateCursor();
    });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mousedown', setGlowActive);
    document.addEventListener('mouseup', setGlowNormal);
    document.addEventListener('keydown', setGlowActive);
    document.addEventListener('keyup', setGlowNormal);

    updateCursor();
})();


// ─── IMPRESSUM TOGGLE ─────────────────────────────────────────────────────────
document.getElementById('impressumBtn').addEventListener('click', function () {
    const content = document.getElementById('impressumContent');
    const isExpanded = this.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
        content.hidden = true;
        this.setAttribute('aria-expanded', 'false');
        this.textContent = 'Imprint';
    } else {
        content.hidden = false;
        this.setAttribute('aria-expanded', 'true');
        this.textContent = 'Hide Imprint';
        setTimeout(() => content.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
});
