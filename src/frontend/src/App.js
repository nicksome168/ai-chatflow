import logo from './logo.svg';
import './App.css';
import LoginSignup from './components/login';
import Home from './components/home';
import Dashboard from './components/home';
import ChatWindow from './components/chatwindow';
import TranslateMenu from './components/translate';
import SummarizeMenu from './components/summarize';

function App() {
  return (
    <div className="App">
      {/* <LoginSignup/> */}
      {/* <Dashboard/> */}
      <ChatWindow/>
    </div>
  );
}

export default App;

// App.js
// import React, { useState } from 'react';
// import LoginSignup from './components/login';
// import Home from './components/home';

// function App() {
//  const [loggedIn, setLoggedIn] = useState(false);

//  const handleLogin = () => {
//     setLoggedIn(true);
//  };

//  const handleLogout = () => {
//     setLoggedIn(false);
//  };

//  return (
//     <div className="App">
//       {loggedIn ? (
//         <Home handleLogout={handleLogout} />
//       ) : (
//         <LoginSignup handleLogin={handleLogin} />
//       )}
//     </div>
//  );
// }

// export default App;