async function updateUserAvatarAsSignIN() {
    const defaultAvatar = document.getElementById('defaultAvatar');
    const UserAvatarIMG = document.getElementById('UserAvatarIMG');

    if (!defaultAvatar || !UserAvatarIMG) return; 

    const { data, error} = await window.sb.auth.getUser(); 

    if (error || !data || !data.user){ 
        defaultAvatar.style.display = ''; 
        UserAvatarIMG.style.display = 'none';
        UserAvatarIMG.removeAttribute('title');
        return; 
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

window.sb.auth.onAuthStateChange(() => {
    updateUserAvatarAsSignIN();
});