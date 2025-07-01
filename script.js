// NEWSLETTER SIGNUP FORM
document.querySelector('.email-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const emailInput = this.querySelector('input[type="email"]');
    const messageDiv = document.querySelector('.form-message');
    const submitButton = this.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();

    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.setAttribute('role', 'alert');

    if (!validateEmail(email)) {
        messageDiv.textContent = "Please enter a valid email address.";
        emailInput.classList.add('error');
        return;
    }

    emailInput.classList.remove('error');
    messageDiv.textContent = "Sending...";
    submitButton.disabled = true;

    const formData = new FormData();
    formData.append("email", email);

    try {
        const response = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: formData
        });

        if (response.ok) {
            messageDiv.textContent = "Thank you for signing up! You'll hear from us soon.";
            emailInput.value = '';
        } else {
            const errorDetails = await response.json();
            messageDiv.textContent = errorDetails.error || "There was a problem. Please try again later.";
        }
    } catch (err) {
        console.error("Network error:", err);
        messageDiv.textContent = "Network error. Please try again later.";
    } finally {
        submitButton.disabled = false;
    }
});

function validateEmail(email) {
    // Comprehensive email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const FORM_ENDPOINT = "https://formspree.io/f/xwpbynnn";

// NEON CURSOR + LOGO BG MASKING
(function() {
    const cursor = document.querySelector('.neon-cursor');
    const logoBg = document.querySelector('.logo-bg');
    if (!cursor || !logoBg) return;

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

    // Cursor Glow
    const effectColors = [
        ["transparent", "0 0 60px 26px #ff0040dd, 0 0 110px 54px #ff6a00dd"],
        ["transparent", "0 0 60px 26px #ffd700cc, 0 0 110px 54px #ff6a00cc"],
        ["transparent", "0 0 80px 38px #fff, 0 0 120px 58px #ff0040bb"],
        ["transparent", "0 0 80px 38px #ff6a00cc, 0 0 120px 58px #fff4"],
    ];

    const updateCursor = () => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    // Masked BG follows mouse
    function updateLogoBgMask() {
        // 320px diameter, with fade at the edge
        const r = 160;
        logoBg.style.webkitMaskImage = `radial-gradient(circle ${r}px at ${mouseX}px ${mouseY}px, rgba(0,0,0,0.33) 78%, transparent 100%)`;
        logoBg.style.maskImage = `radial-gradient(circle ${r}px at ${mouseX}px ${mouseY}px, rgba(0,0,0,0.33) 78%, transparent 100%)`;
    }

    let lastOverInteractive = false;
    function isOverInteractive(e) {
        let el = e.target;
        while(el) {
            if (el.matches('.logo, .accordion-header, .event-card-inner, .cta, input, button, .email-form, .guestlist-modal-content, .guestlist-form, .impressum-toggle')) {
                return true;
            }
            el = el.parentElement;
        }
        return false;
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateCursor();
        updateLogoBgMask();

        // Subtle fade out if over interaktives
        const overInteractive = isOverInteractive(e);
        if (overInteractive && !lastOverInteractive) {
            document.body.classList.add('hide-bg');
        } else if (!overInteractive && lastOverInteractive) {
            document.body.classList.remove('hide-bg');
        }
        lastOverInteractive = overInteractive;
    });

    window.addEventListener('resize', updateLogoBgMask);

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = "0";
        logoBg.style.opacity = "0";
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = "0.93";
        logoBg.style.opacity = "0.11";
    });

    // Neon flash on click in random color (never purple/lila)
    document.addEventListener('mousedown', () => {
        const i = Math.floor(Math.random() * effectColors.length);
        cursor.style.background = effectColors[i][0];
        cursor.style.boxShadow = effectColors[i][1];
        cursor.style.opacity = "1";
    });
    document.addEventListener('mouseup', () => {
        setTimeout(() => {
            cursor.style.background = "transparent";
            cursor.style.boxShadow = "0 0 50px 22px #ff0040cc, 0 0 80px 42px #ff6a00cc";
            cursor.style.opacity = "0.93";
        }, 120);
    });

    // Initial
    updateCursor();
    updateLogoBgMask();
})();

// ACCORDION
document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.accordion-header').forEach(b => b.setAttribute('aria-expanded', 'false'));
        document.querySelectorAll('.accordion-content').forEach(c => c.hidden = true);
        if (!expanded) {
            this.setAttribute('aria-expanded', 'true');
            this.parentNode.querySelector('.accordion-content').hidden = false;
        }
    });
});

// GUESTLIST MODAL
document.querySelectorAll('.guestlist-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const parent = this.closest('.accordion-content');
        if (!parent) return;
        const modal = parent.querySelector('.guestlist-modal');
        if (!modal) return;
        modal.hidden = false;
        document.body.classList.add('modal-open');
        setTimeout(() => {
            modal.querySelector('.guestlist-modal-content').focus();
        }, 50);
    });
});

// Modal schließen per X, ESC, Overlay
document.querySelectorAll('.guestlist-modal').forEach(modal => {
    // Klick auf Overlay
    modal.addEventListener('mousedown', function(e) {
        if (e.target === modal || e.target.classList.contains('guestlist-modal-bg')) {
            this.hidden = true;
            document.body.classList.remove('modal-open');
        }
    });
    // Close-Button
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.closest('.guestlist-modal').hidden = true;
        document.body.classList.remove('modal-open');
    });
});
window.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
        document.querySelectorAll('.guestlist-modal').forEach(m => m.hidden = true);
        document.body.classList.remove('modal-open');
    }
});

// Guest List Form Submission (Formspree AJAX)
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
            this.closest('.guestlist-modal').hidden = true;
            msg.textContent = '';
            document.body.classList.remove('modal-open');
        }, 1800);
    });
});

// Impressum Toggle
document.getElementById('impressumBtn').addEventListener('click', function() {
    const content = document.getElementById('impressumContent');
    const expanded = this.getAttribute('aria-expanded') === 'true';
    content.hidden = expanded;
    this.setAttribute('aria-expanded', String(!expanded));
    this.textContent = expanded ? 'Imprint' : 'Hide Imprint';
});
