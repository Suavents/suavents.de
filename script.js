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
