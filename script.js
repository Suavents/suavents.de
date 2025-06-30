document.querySelector('.email-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    const messageDiv = document.querySelector('.form-message');
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
        messageDiv.textContent = "Please enter a valid email address.";
        return;
    }
    messageDiv.textContent = "Sending...";

    const formData = new FormData();
    formData.append("email", email);

    try {
        const response = await fetch("https://formspree.io/f/xwpbynnn", {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: formData
        });

        if (response.ok) {
            messageDiv.textContent = "Thank you for signing up! You'll hear from us soon.";
            emailInput.value = '';
        } else {
            messageDiv.textContent = "There was a problem. Please try again later.";
        }
    } catch (err) {
        messageDiv.textContent = "Network error. Please try again later.";
    }
});

function validateEmail(email) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
