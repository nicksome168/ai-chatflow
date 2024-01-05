import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/dashboard';
import ChatWindow from './components/chat';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/select-partner" element={<Dashboard />} />
                <Route path="/chat/:partner" element={<ChatWindow />} />
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;
