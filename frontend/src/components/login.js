import React, { useState } from 'react';
import '../css/login.css';
import Dashboard from './home';
import authorization from '../client/authorization';

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const switchMode = () => {
        setIsLogin(!isLogin);
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (isLogin) {
            await authorization.login(userName, password).then(
                (res) => {
                    if(res?.message === 'Success!'){
                        this.props.history.push('/Chat');
                        window.location.reload();
                    }
                },
                (error) => {
                    console.log('Unexpected Error', error);
                }
            );
            <Dashboard/>
        } else {
            await authorization.signup(email, userName, password, firstName, lastName).then(
                (res) => {
                    if(res?.message === 'Success!'){
                        this.props.history.push('/Chat');
                        window.location.reload();
                    }
                },
                (error) => {
                    console.log('Unexpected Error', error);
                }
            );
        }
    };

    return (
        <div className="container">
            <form onSubmit={submitForm}>
                {isLogin ? (
                    <>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="userName">Email</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
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

export default LoginSignup;