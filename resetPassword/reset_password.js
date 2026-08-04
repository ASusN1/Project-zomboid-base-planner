const step_email_section = document.getElementById("step-email-section");
const step_code_section = document.getElementById("step-code-section");

const email_form = document.getElementById("email-input-form");
const reset_email_input = document.getElementById("reset-email-input");
const email_step_message = document.getElementById("reset-email-message");

const codeForm = document.getElementById("code-input-form");
const rest_code_input = document.getElementById("reset-code-input");
const code_step_message = document.getElementById("code-step-message");
const resend_code_btn = document.getElementById("resend-code-btn");

const reset_password_form = document.getElementById("reset-password-form");
const new_password_input = document.getElementById("new-password");
const confirm_password_input = document.getElementById("confirm-password-input");
const reset_password_message = document.getElementById("reset-password-message");


let email_being_reset = "";
 email_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email_value = reset_email_input.value.trim();
    email_being_reset = email_value;
    email_step_message.textContent = "Sending reset code to email: " + email_value;

    const sendResult = await window.sb.auth.resetPasswordForEmail(email_value);
    const sendError = sendResult.error;

    // If there's an error, display it
    if(sendError) {
        email_step_message.textContent = "Error sending reset code: " + sendError.message;
        return;
    }
    email_step_message.textContent = "code sent successfully to email: " + email_value;

    step_email_section.style.display = "none";
    step_code_section.style.display = "";
 });

 resend_code_btn.addEventListener("click", async (event) => {
    code_step_message.textContent = "resending reset code to email: " + email_being_reset;
    const resendResult = await window.sb.auth.resetPasswordForEmail(email_being_reset);
    const resendError = resendResult.error;

    if(resendError){
        code_step_message.textContent = "Error resending reset code: " + resendError.message;
        return;
    }
    code_step_message.textContent = "code resent successfully to email: " + email_being_reset;
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

    // If there's an error, display it
    if(updateError) {
        reset_password_message.textContent = "Error updating password: " + updateError.message;
        return;
    }

    //success , move to home page after 2 seconds
    reset_password_message.textContent = "Password updated successfully.";
    
    setTimeout(() => {
        window.location.href = "../Home/Home.html";
    }, 2000);
});