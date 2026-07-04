const loginForm = document.getElementById('loginForm');
const authMessage = document.getElementById('authMessage');

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

