const reset_password_form = document.getElementById("reset-password-form");
const new_password_input = document.getElementById("new-password");
const confirm_password_input = document.getElementById("confirm-password-input");
const reset_password_message = document.getElementById("reset-password-message");

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