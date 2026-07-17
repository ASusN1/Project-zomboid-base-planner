const loginForm = document.getElementById('loginForm');
const authMessage = document.getElementById('authMessage');
const signUpButton = document.getElementById('signUpButton');

const allowedCharacter = /^[a-zA-Z0-9_]{3,15}$/; // Allow A-Z, a-z, 0-9, _, lenght between 3 and 15 characters

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
    const usernameValue = document.getElementById('usernameInput').value;

    if (!allowedCharacter.test(usernameValue)) {
        authMessage.textContent = "Invalid username. Please use only letters, numbers, and underscores, and ensure it is between 3 and 15 characters long.";
        return;
    }

    authMessage.textContent = "Creating account...";

    const { data, error } = await window.sb.auth.signUp({
        email: emailValue,
        password: passwordValue
    });

    if (error) {
        authMessage.textContent = error.message;
        return; 
    }
    const newUser = data.user;
    if (newUser) { 
        const profileInsertResult = await window.sb
            .from('profiles')
            .insert({id: newUser.id, username: usernameValue});

        if(profileInsertResult.error) {
            authMessage.textContent = profileInsertResult.error.message;
        }
        
    }
    authMessage.textContent = "Account created successfully. Please check your email to confirm your account.";
});