// Accordion mit Glow & Größe
document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', function() {
        const item = this.closest('.accordion-item');
        const expanded = this.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.accordion-header').forEach(b => b.setAttribute('aria-expanded', 'false'));
        document.querySelectorAll('.accordion-content').forEach(c => c.hidden = true);
        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
        if (!expanded) {
            this.setAttribute('aria-expanded', 'true');
            this.parentNode.querySelector('.accordion-content').hidden = false;
            item.classList.add('open');
        }
    });
});

// Robust Guestlist Modal (immer schließbar, garantiert initial unsichtbar)
(function() {
    const modal = document.querySelector('.guestlist-modal');
    const openBtns = document.querySelectorAll('.guestlist-btn');
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.guestlist-modal-bg');

    modal.hidden = true;
    modal.classList.remove('show-modal');
    modal.style.display = 'none';

    function openModal() {
        modal.hidden = false;
        modal.classList.add('show-modal');
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        setTimeout(() => {
            modal.querySelector('.guestlist-modal-content').focus();
        }, 50);
    }
    function closeModal() {
        modal.hidden = true;
        modal.classList.remove('show-modal');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    openBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
    });
    overlay.addEventListener('mousedown', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
    modal.addEventListener('mousedown', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    window.addEventListener('keydown', function(e) {
        if (!modal.hidden && e.key === "Escape") {
            closeModal();
        }
    });
    // Guest List Form Submission
    document.querySelectorAll('.guestlist-form').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const msg = this.parentNode.querySelector('.guestlist-message');
            msg.textContent = "Sending...";
            const formData = new FormData(this);
            try {
                const response = await fetch(this.action, {
                    method: "POST",
                    headers: { "Accept": "application/json" },
                    body: formData
                });
                if (response.ok) {
                    msg.textContent = "Request sent! We'll be in touch.";
                    this.reset();
                } else {
                    msg.textContent = "There was a problem. Please try again.";
                }
            } catch (err) {
                msg.textContent = "Network error. Please try again.";
            }
            setTimeout(() => {
                closeModal();
                msg.textContent = '';
            }, 1800);
        });
    });
})();

// Neon Cursor Glow – starker Effekt (rot-orangener)
(function() {
    const cursor = document.querySelector('.neon-cursor');
    if (!cursor) return;
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    const updateCursor = () => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = "0.93";
        updateCursor();
    });
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = "0";
    });
    document.addEventListener('mousedown', () => {
        cursor.style.boxShadow = "0 0 210px 90px #fa1d1c, 0 0 270px 140px #ffab00, 0 0 100px 40px #fff";
        cursor.style.opacity = "1";
    });
    document.addEventListener('mouseup', () => {
        setTimeout(() => {
            cursor.style.boxShadow = "0 0 170px 70px #fa1d1c, 0 0 250px 100px #ffab00cc, 0 0 110px 40px #fff5";
            cursor.style.opacity = "0.93";
        }, 120);
    });
    updateCursor();
})();

// Impressum Toggle bleibt wie gehabt
document.getElementById('impressumBtn').addEventListener('click', function() {
    const content = document.getElementById('impressumContent');
    const expanded = this.getAttribute('aria-expanded') === 'true';
    content.hidden = expanded;
    this.setAttribute('aria-expanded', String(!expanded));
    this.textContent = expanded ? 'Imprint' : 'Hide Imprint';
});
