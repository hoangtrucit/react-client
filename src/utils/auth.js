const AUTH_TOKEN = 'authToken';

export function setAuthToken(token) {
    localStorage.setItem(AUTH_TOKEN, token);
}

export function resetAuthToken(token) {
    localStorage.removeItem(token);
}

export function getAuthToken(hasJWTString = false) {
    return (hasJWTString ? 'JWT ' : '') + localStorage.getItem(AUTH_TOKEN)
}

export default {
    setAuthToken,
    resetAuthToken,
    getAuthToken
}