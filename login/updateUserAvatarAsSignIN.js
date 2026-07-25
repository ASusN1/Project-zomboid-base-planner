async function updateUserAvatarAsSignIN() {
    const defaultAvatar = document.getElementById('defaultAvatar');
    const UserAvatarIMG = document.getElementById('UserAvatarIMG');
    const signUpButton = document.getElementById("signUpBtn");
    const logInButton = document.getElementById("LogInnBtn");
    const logOutButton = document.getElementById("logOutBtn");
    const guestButtonTopBar = document.getElementById("continue-as-guest-btn-top-bar");

    if (!defaultAvatar || !UserAvatarIMG) return; 

    const { data, error} = await window.sb.auth.getUser(); 

    if (error || !data || !data.user){ 
        defaultAvatar.style.display = ''; 
        UserAvatarIMG.style.display = 'none';
        UserAvatarIMG.removeAttribute('title');

        // if the user not logged in --> show sign up + log in 
        if ( signUpButton){
            signUpButton.style.display = "";
        }
        if ( logInButton){
            logInButton.style.display = "";
        }
        
        if ( logOutButton){
            logOutButton.style.display = "none";
        }

        // if not logged in and not in guest mode, show the guest button again
        const isGuest = sessionStorage.getItem("isGuestMode") === "true";
        if ( guestButtonTopBar){
            guestButtonTopBar.style.display = isGuest ? "none" : "";
        }
        return; 
    }

    // if user signed in --> hide sign up log in -> show log out
    if ( signUpButton){
        signUpButton.style.display = "none";
    }

    if ( logInButton){
        logInButton.style.display = "none";
    }

    if ( logOutButton){
        logOutButton.style.display = "";
    }

    // user is actually logged in now, so guest mode no longer applies
    sessionStorage.removeItem("isGuestMode");
    if ( guestButtonTopBar){
        guestButtonTopBar.style.display = "none";
    }

    const currentUser = data.user;

    const profileResult = await window.sb 
    .from('profiles')
    .select('avatar_url')
    .eq('id', currentUser.id)
    .single();
    
    const avatarUrl = profileResult.data && profileResult.data.avatar_url; // check if supabase if this user has a avatar img saved
    if (avatarUrl) {
        UserAvatarIMG.src = avatarUrl;
        defaultAvatar.style.display = 'none';
        UserAvatarIMG.style.display = '';
    }else{ 
        defaultAvatar.style.display = '';
        UserAvatarIMG.style.display = 'none';
    }

    UserAvatarIMG.title = currentUser.email; 
}
updateUserAvatarAsSignIN();

const logOutButtonForClick = document.getElementById("logOutBtn");
if (logOutButtonForClick){
    logOutButtonForClick.addEventListener('click', async () => {
        const signOutResult = await window.sb.auth.signOut();
        const signOutError = signOutResult.error;

        if(signOutError){
            console.error('Error signing out:', signOutError.message);
            alert("Failed to log out. Please try again."+ signOutError.message);
            return;
        }

        const checkResult = await window.sb.auth.getUser();
        const stillLoggedIN = checkResult.data && checkResult.data.user;

        if(stillLoggedIN){
            console.error('Error: User is still logged in after sign out.');
            alert("Failed to log out. Please try again.");
            return;
        }

        sessionStorage.removeItem("isGuestMode");

        console.log("user logged out successfully");
        location.reload();
    });
}

window.sb.auth.onAuthStateChange(() => {
    updateUserAvatarAsSignIN();
});