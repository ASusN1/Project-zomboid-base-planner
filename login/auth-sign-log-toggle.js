let current_auth_mode = "login"; 
const login_signup_modal = document.getElementById("login-signup-modal");
const auth_modal_title = document.getElementById("auth-modal-title");

//const allowedCharacter = /^[a-zA-Z0-9_]{8,20}$/;// Allow A-Z, a-z, 0-9, _, lenght between 8,20

const user_name_label = document.querySelector('label[for="user-name-input"]');
const user_name_input = document.getElementById("user-name-input");


const email_input = document.getElementById("email-input");
const password_input = document.getElementById("password-input");

const auth_modal_submit_btn = document.getElementById("auth-modal-submit-btn");

const swith_to_signup_text = document.getElementById("switch-to-signup");
const swith_to_signup_btn = document.getElementById("switch-to-signup-btn");

const close_auth_modal_btn = document.getElementById("close-auth-modal-btn");

const continue_as_guest_btn = document.getElementById("continue-as-guest-btn");
const continue_as_guest_btn_top_bar = document.getElementById("continue-as-guest-btn-top-bar");
const log_out_btn = document.getElementById("logOutBtn");

const login_form = document.getElementById("login-form");
const authMessage = document.getElementById("authMessage");

const signUpBtn = document.getElementById("signUpBtn");
const loginInBtn = document.getElementById("LogInnBtn");

const forgot_password_link = document.getElementById("forgot-password-link");

function updateAuthModeToSignUpORLogin(){
    if (current_auth_mode === "signup") {
        auth_modal_title.textContent = "Sign Up";
        user_name_label.style.display = "";
        user_name_input.style.display = "";
        auth_modal_submit_btn.textContent = "Sign Up";
        swith_to_signup_text.textContent = "Already have an account?";
        swith_to_signup_btn.textContent = "Log In";
    } else {
        auth_modal_title.textContent = "Log In";
        user_name_label.style.display = "none";
        user_name_input.style.display = "none";
        auth_modal_submit_btn.textContent = "Log In With Email";
        swith_to_signup_text.textContent = "Don't have an account?";
        swith_to_signup_btn.textContent = "Sign Up";
    }
}

function openAuthModal(modeToOpen) {
    current_auth_mode = modeToOpen;
    authMessage.textContent = "";
    updateAuthModeToSignUpORLogin();
    login_signup_modal.style.display = "flex";
}

function closeAuthModal() {
    login_signup_modal.style.display = "none";
    authMessage.textContent = "";
}

function enterGuestMode() {
    sessionStorage.setItem("isGuestMode", "true");
    if (continue_as_guest_btn_top_bar) {
        continue_as_guest_btn_top_bar.style.display = "none";
    }
}

function updateTopBarButtonsForGuestMode() {
    const isGuest = sessionStorage.getItem("isGuestMode") === "true";
    if (isGuest && continue_as_guest_btn_top_bar) {
        continue_as_guest_btn_top_bar.style.display = "none";
    }
}

signUpBtn.addEventListener("click", () => {
    openAuthModal("signup");
});

loginInBtn.addEventListener("click", () => {
    openAuthModal("login");
});

close_auth_modal_btn.addEventListener("click", () => {
    closeAuthModal();
});

continue_as_guest_btn.addEventListener("click", () => {
    closeAuthModal();
    enterGuestMode();
});

if (continue_as_guest_btn_top_bar) {
    continue_as_guest_btn_top_bar.addEventListener("click", () => {
        enterGuestMode();
    });
}

updateTopBarButtonsForGuestMode();

swith_to_signup_btn.addEventListener("click", () => {
    if (current_auth_mode === "login") {
        current_auth_mode = "signup";
    } else {
        current_auth_mode = "login";
    }
    updateAuthModeToSignUpORLogin();
});

login_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailValue = email_input.value;
    const passwordValue = password_input.value;

    if (current_auth_mode === "signup") {
        authMessage.textContent = "Creating account...";

        const signUpResult = await window.sb.auth.signUp({
            email: emailValue,
            password: passwordValue
        });

        const signUpError = signUpResult.error;

        if (signUpError) {
            authMessage.textContent = signUpError.message;
            return;
        }

        authMessage.textContent = "Account created successfully. Please check your email to confirm your account.";

    } else {
        authMessage.textContent = "Logging in...";

        const loginResult = await window.sb.auth.signInWithPassword({
            email: emailValue,
            password: passwordValue
        });

        const loginError = loginResult.error;

        if (loginError) {
            authMessage.textContent = loginError.message;
            return;
        }

        authMessage.textContent = "Login successful";
        closeAuthModal();
        location.reload();
    }
});

forgot_password_link.addEventListener("click", async (event) => {
    const emailValue = email_input.value;

    if(!emailValue) {
        authMessage.textContent = "Please enter your email address to reset your password.";
        return;
    }
    authMessage.textContent = "sent rest email, please check your email inbox and spam folder.";


    const resetResult = await window.sb.auth.resetPasswordForEmail(emailValue, {
        redirectTo: window.location.origin + "/Project-zomboid-base-planner/ResetPassword/reset_password.html"
    });

    const resetError = resetResult.error;

    if (resetError) {
        authMessage.textContent = resetError.message;
        return;
    }
    authMessage.textContent = "password reset email sent , check your inbox";
});