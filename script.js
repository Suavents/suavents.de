document.querySelector('.email-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    const messageDiv = document.querySelector('.form-message');
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
        messageDiv.textContent = "Please enter a valid email address.";
        return;
    }
    // TODO: Hook up to your email backend or service like Mailchimp/ConvertKit.
    messageDiv.textContent = "Thank you for signing up!";
    emailInput.value = '';
});

function validateEmail(email) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
