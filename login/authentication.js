const loginForm = document.getElementById('loginForm');
const authMessage = document.getElementById('authMessage');
const signUpButton = document.getElementById('signUpButton');
const allowedCharacter = /^[a-zA-Z0-9_]+$/; // regex for allowed characters in username

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop page from reloading 

    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('passwordInput').value;

    authMessage.textContent = "logging in";

    const {data, error} = await window.sb.auth.signInWithPassword({ // ask supabase for auth 
        email: emailValue,
        password: passwordValue
    });

    if (error) {
        authMessage.textContent = error.message;
        return; 
    }

    authMessage.textContent = "Login successful"; 
    window.location.href = "../Home/Home.html"; 
});
// sign  up 
signUpButton.addEventListener('click', async () => {
    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('passwordInput').value;

    authMessage.textContent = "Creating account...";

    const { data, error } = await window.sb.auth.signUp({
        email: emailValue,
        password: passwordValue
    });

    if (error) {
        authMessage.textContent = error.message;
        return; 
    }

    authMessage.textContent = "Account created successfully. Please check your email to confirm your account.";
});