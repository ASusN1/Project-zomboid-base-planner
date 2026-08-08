async function updateUserAvatarAsSignIN() {
    const defaultAvatar = document.getElementById('defaultAvatar');
    const UserAvatarIMG = document.getElementById('UserAvatarIMG');
    const signUpButton = document.getElementById("signUpBtn");
    const logInButton = document.getElementById("LogInnBtn");
    const logOutButton = document.getElementById("logOutBtn");
    const guestButtonTopBar = document.getElementById("continue-as-guest-btn-top-bar");

    if (!defaultAvatar || !UserAvatarIMG) return;

    function showLoggedOUtState() {
        defaultAvatar.style.display = '';
        UserAvatarIMG.style.display = 'none';
        UserAvatarIMG.removeAttribute('title');

        if (signUpButton) {
            signUpButton.style.display = "";
        }
        if (logInButton) {
            logInButton.style.display = "";
        }
        if (logOutButton) {
            logOutButton.style.display = "none";
        }

        const isGuest = sessionStorage.getItem("isGuestMode") === "true";
        if (guestButtonTopBar) {
            guestButtonTopBar.style.display = isGuest ? "none" : "";
        }
    }

    const storedToken = getStoredAccessToken(); 

    if (!storedToken) {
        showLoggedOUtState(); // no token, definitely logged out
        return;
    }

    const meResponse = await fetch(window.BACKEND_URL + "/auth/me", {
        headers: getAuthHeader(),
    });

    if (!meResponse.ok) {
        // token exists but backend rejected it (expired or invalid)
        clearAuthTokens();
        showLoggedOUtState();
        return;
    }

    const currentUser = await meResponse.json(); // { id, email, avatar_url }, backend already verified this user

    // user signed in --> hide sign up / log in --> show log out
    if (signUpButton) {
        signUpButton.style.display = "none";
    }
    if (logInButton) {
        logInButton.style.display = "none";
    }
    if (logOutButton) {
        logOutButton.style.display = "";
    }

    // user is actually logged in ,so guest mode no longer applies
    sessionStorage.removeItem("isGuestMode");
    if (guestButtonTopBar) {
        guestButtonTopBar.style.display = "none";
    }

    const avatarUrl = currentUser.avatar_url; // already came back from /auth/me, no second lookup needed
    if (avatarUrl) {
        UserAvatarIMG.src = avatarUrl;
        defaultAvatar.style.display = 'none';
        UserAvatarIMG.style.display = '';
    } else {
        defaultAvatar.style.display = '';
        UserAvatarIMG.style.display = 'none';
    }

    UserAvatarIMG.title = currentUser.email;
}
updateUserAvatarAsSignIN();

const logOutButtonForClick = document.getElementById("logOutBtn");
if (logOutButtonForClick) {
    logOutButtonForClick.addEventListener('click', () => {
        clearAuthTokens(); // this is logout now, no server session to sign out of

        sessionStorage.removeItem("isGuestMode");

        console.log("user logged out successfully");
        location.reload();
    });
}