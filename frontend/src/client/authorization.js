import socket from './client';

const signup = async(email, userName, password, firstName, lastName) => {
    try {
        return new Promise((resolve) => {
            socket.emit('signup', { email, userName, password, firstName, lastName });
            socket.on('signup_response', (response) => {
                if (response?.message === 'Success!') {
                    localStorage.setItem(
                        'user', JSON.stringify({
                            userName: userName,
                            token: response.token
                        })
                    );
                    resolve(response);
                } else {
                    resolve({ errorMsg: response?.message });
                }
            });
        });
    } catch (error) {
        console.log('Error:', error.message);
    }
};

const login = async(userName, password) => {
    try {
        return new Promise((resolve) => {
            socket.emit('login', { userName, password });
            socket.on('login_response', (response) => {
                if (response?.message === 'Success!') {
                    localStorage.setItem(
                        'user', JSON.stringify({
                            userName: userName,
                            token: response.token
                        })
                    );
                    resolve(response);
                } else {
                    resolve({ errorMsg: response?.message });
                }
            });
        });
    } catch (error) {
        console.log('Error:', error.message);
    }
};

const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
};

const getCurrentUser = () => {
    if (JSON.parse(localStorage.getItem('user'))) {
        return JSON.parse(localStorage.getItem('user'));
    }
    window.location.href = '/';
}

const isLoggedIn = () => {
    if (JSON.parse(localStorage.getItem('user')))
        return true;
    else
        return false;
};

export default {
    login,
    logout,
    getCurrentUser,
    isLoggedIn
};