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

// Neon Cursor Glow with random color on click
(function() {
    const cursor = document.querySelector('.neon-cursor');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

    const effectColors = [
        // Array of glow colors: [background, boxShadow]
        ["transparent", "0 0 60px 26px #ff0040dd, 0 0 110px 54px #ff6a00dd"],      // red-orange
        ["transparent", "0 0 60px 26px #ffd700cc, 0 0 110px 54px #ff6a00cc"],      // yellow-orange
        ["transparent", "0 0 80px 38px #fff, 0 0 120px 58px #ff0040bb"],          // white-red
        ["transparent", "0 0 80px 38px #ff6a00cc, 0 0 120px 58px #fff4"],         // orange-white
    ];

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

    // Initial position
    updateCursor();
})();
