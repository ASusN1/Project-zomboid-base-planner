const step_email_section = document.getElementById("step-email-section");
const step_password_section = document.getElementById("reset-password-section");

const email_form = document.getElementById("email-input-form");
const reset_email_input = document.getElementById("reset-email-input");
const email_step_message = document.getElementById("reset-email-message");

const reset_password_form = document.getElementById("reset-password-form");
const new_password_input = document.getElementById("new-password");
const confirm_password_input = document.getElementById("confirm-password-input");
const reset_password_message = document.getElementById("reset-password-message");

const close_reset_password_btn = document.getElementById("close-reset-password-btn");

let recoveryAccessToken = null;
function readRecoveryTokenFromUrl() {
    const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
    const tokenFromUrl = hashParams.get("access_token"); 
    const typeFromUrl = hashParams.get("type");

    if (tokenFromUrl && typeFromUrl === "recovery") {
        recoveryAccessToken = tokenFromUrl; 
        step_email_section.style.display = "none";
        step_password_section.style.display = ""; 
    }
}
readRecoveryTokenFromUrl(); 

email_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email_value = reset_email_input.value.trim();
    email_step_message.textContent = "Sending reset link to email: " + email_value;

    const forgotResponse = await fetch(window.BACKEND_URL + "/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email_value }),
    });

    const forgotResult = await forgotResponse.json(); // read the backend's response

    if (!forgotResponse.ok) {
        email_step_message.textContent = "Error sending reset link: " + forgotResult.error;
        return;
    }

    email_step_message.textContent = forgotResult.message;
});

close_reset_password_btn.addEventListener("click", () => {
    window.location.href = "../Home/Home.html";
});

reset_password_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const new_password_value = new_password_input.value;
    const confirm_password_value = confirm_password_input.value;

    if (new_password_value !== confirm_password_value) {
        reset_password_message.textContent = "Passwords do not match.";
        return;
    }

    if (!recoveryAccessToken) {
        reset_password_message.textContent = "Missing recovery token, please use the link from your email again.";
        return;
    }

    reset_password_message.textContent = "Updating password";

    const resetResponse = await fetch(window.BACKEND_URL + "/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: recoveryAccessToken, newPassword: new_password_value }),
    });

    const resetResult = await resetResponse.json();

    if (!resetResponse.ok) {
        reset_password_message.textContent = "Error updating password: " + resetResult.error;
        return;
    }

    reset_password_message.textContent = "Password updated successfully.";

    setTimeout(() => {
        window.location.href = "../Home/Home.html";
    }, 2000);
});