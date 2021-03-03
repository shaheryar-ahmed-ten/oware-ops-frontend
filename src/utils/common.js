export const apiBaseURL = 'http://localhost:3000';
export const user = null;

export const getToken = () => {
    return localStorage.getItem('token') || null;
}

export const setUserToken = token => {
    localStorage.setItem('token', token);
}

export const setUser = user => {
    localStorage.setItem('user', user);
}

export const removeUserToken = () => {
    localStorage.removeItem('token');
}

export const getURL = uri => {
    return `${apiBaseURL}${uri}`;
}