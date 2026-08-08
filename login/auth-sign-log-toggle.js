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

        const usernameValue = user_name_input.value; 

        const signUpResponse = await fetch(window.BACKEND_URL + "/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ email: emailValue, password: passwordValue, username: usernameValue }),
        });

        const signUpData = await signUpResponse.json(); 

        if (!signUpResponse.ok) {
            authMessage.textContent = signUpData.error; 
            return;
        }

        authMessage.textContent = signUpData.message; // "please check your email" message from the backend

    } else {
        authMessage.textContent = "Logging in...";

        const loginResponse = await fetch(window.BACKEND_URL + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailValue, password: passwordValue }),
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) { 
            authMessage.textContent = loginData.error; 
            return;
        }

        saveAuthTokens(loginData.access_token, loginData.refresh_token);

        authMessage.textContent = "Login successful";
        closeAuthModal();
        location.reload();
    }
});

forgot_password_link.addEventListener("click", ()=>{
    closeAuthModal();
    window.location.href = "../resetPassword/reset_password.html";
}) 