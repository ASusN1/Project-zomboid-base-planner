function saveAuthTokens(accessToken, refreshToken){
    localStorage.setItem("pzbp_access_token", accessToken);
    localStorage.setItem("pzbp_refresh_token", refreshToken);
}

function clearAuthTokens(){
    localStorage.removeItem("pzbp_access_token");
    localStorage.removeItem("pzbp_refresh_token");
}

function getStoredAccessToken(){
    return localStorage.getItem("pzbp_access_token");
}

function getAuthHeader(){
    const token = getStoredAccessToken();
    if (!token){
        return{};
    }
    return {Authorization: "Bearer " + token};
}

window.saveAuthTokens = saveAuthTokens;
window.clearAuthTokens = clearAuthTokens;
window.getStoredAccessToken = getStoredAccessToken;
window.getAuthHeader = getAuthHeader;