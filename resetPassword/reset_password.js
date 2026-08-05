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

email_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email_value = reset_email_input.value.trim();
    email_step_message.textContent = "Sending reset link to email: " + email_value;

    const sendResult = await window.sb.auth.resetPasswordForEmail(email_value, {
        redirectTo: window.location.origin + "/Project-zomboid-base-planner/ResetPassword/reset_password.html"
    });
    const sendError = sendResult.error;

    if(sendError) {
        email_step_message.textContent = "Error sending reset link: " + sendError.message;
        return;
    }
    email_step_message.textContent = "reset link sent successfully to email: " + email_value;
});

close_reset_password_btn.addEventListener("click", () => {
    window.location.href = "../Home/Home.html";
});

window.sb.auth.onAuthStateChange((event, session) => {
    if(event === "PASSWORD_RECOVERY") {
        step_email_section.style.display = "none";
        step_password_section.style.display = "";
    }
});

reset_password_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const new_password_value = new_password_input.value;
    const confirm_password_value = confirm_password_input.value;

    if(new_password_value !== confirm_password_value) {
        reset_password_message.textContent = "Passwords do not match.";
        return;
    }

    reset_password_message.textContent = "Updating password";
    const updateResult = await window.sb.auth.updateUser({
        password: new_password_value
    });

    const updateError = updateResult.error;

    if(updateError) {
        reset_password_message.textContent = "Error updating password: " + updateError.message;
        return;
    }

    reset_password_message.textContent = "Password updated successfully.";
    
    setTimeout(() => {
        window.location.href = "../Home/Home.html";
    }, 2000);
});