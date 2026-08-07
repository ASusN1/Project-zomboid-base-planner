function saveAuthToken(accessToken, refreshToken){
    localStorage.setItem("pzbp_access_token", accessToken);
    localStorage.setItem("pzbp_refresh_token", refreshToken);
}

function clearAuthToken(){
    localStorage.removeItem("pzbp_access_token");
    localStorage.removeItem("pzbp_refresh_token");
}

function getStoredAccessToken(){
    return localStorage.getItem("pzbp_access_token");
}

function getAuthHeader(){
    const token = getStoredAccessToken();
    if(token){
        return[];
    }
    return {Authorization: "Bearer " + token};
}

window.saveAuthToken = saveAuthToken;
window.clearAuthToken = clearAuthToken;
window.getStoredAccessToken = getStoredAccessToken;
window.getAuthHeader = getAuthHeader;