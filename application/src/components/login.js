import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../css/login.css'

const socket = io('http://localhost:4000'); // Adjust the URL to match your server

const Login = () => {
    const [email, setEmail] = useState('');
    const [userName, setuserName] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for server responses
        socket.on('login_response', (response) => {
            if (response.message === 'success') {
                localStorage.removeItem('user');
                localStorage.setItem('user', JSON.stringify({'userName': userName}));
                navigate('/select-partner'); // Navigate on successful login
            } else {
                alert('Login failed'); // Handle login failure
            }
        });

        socket.on('signup_response', (response) => {
            console.log(response.message)
            console.log(response.action)
            if (response.message === 'success') {
                localStorage.removeItem('user');
                localStorage.setItem('user', JSON.stringify({'userName': userName}));
                navigate('/select-partner'); // Switch to login view on successful signup
            } else {
                alert('Signup failed'); // Handle signup failure
            }
        });

        return () => {
            socket.off('login_response');
            socket.off('signup_response');
        };
    }, [navigate, userName]);

    const handleLogin = (e) => {
        e.preventDefault();
        socket.emit('login', { userName, password });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        socket.emit('signup', { email,userName, password, firstName, lastName });
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="container">
            <form onSubmit={isLogin ? handleLogin : handleSignup}>
                {isLogin ? (
                    <>
                        <label htmlFor="userName">User Name</label>
                        <input
                            type="username"
                            id="username"
                            name="username"
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </>
                ) : (
                    <>
                        <label htmlFor="userName">User Name</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)}
                            required
                        />
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </>
                )}
                <button type="submit">
                    {isLogin ? 'Login' : 'Create Account'}
                </button>
                <button type="button" onClick={switchMode}>
                    {isLogin ? 'Create Account' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
