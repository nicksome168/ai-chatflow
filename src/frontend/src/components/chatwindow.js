import React, { useState, useRef, useEffect } from 'react';
import TranslateMenu from './translate';
import SummarizeMenu from './summarize';
import authorization from '../client/authorization';
import {useChat} from '../client/message';

const ChatWindow = (props) => {
  const [message, setMessage] = useState('');
  var { roomId, roomName, noOfUsers } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false); // State to control TranslateMenu visibility
  const [showSummarize, setShowSummarize] = useState(false);
  const { msgList, sendMessage, fetchAllMessages } = useChat();
  const currentUser = authorization.getCurrentUser();
  var [inputRef, setInputRef] = useState(React.createRef());
  const menuRef = useRef();

  const addMessage = async () => {
    await sendMessage(
        roomId,
        inputRef.input.value,
        new Date().toISOString()
    ).then(
        (res) => {
            if (res?.message === 'Success') {
              console.log('msg sent!');
            } else {
                const errorMsg = res?.errorMsg;
                console.log(errorMsg);
            }
        },
        (error) => {
            console.log('Unexpected Error', error);
        }
    );

    inputRef.clear();
    setInputRef(inputRef);
};

  const handleSendMessage = (e) => {
    if (!e.shiftKey && e.charCode === 13 && e.target.value !== '') {
      addMessage();
      e.preventDefault();
  }
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
    if (showTranslate) {
      setShowTranslate(false); // Close the TranslateMenu if it's open
    }
    if (showSummarize) {
      setShowSummarize(false); // Close the TranslateMenu if it's open
    }
  };

  const handleTranslateClick = () => {
    setShowTranslate(true);
    setShowMenu(false); // Optionally close the main menu
  };

  const closeTranslate = () => {
    setShowTranslate(false);
  };

  const handleSummarizeClick = () => {
    setShowSummarize(true);
    setShowMenu(false); // Optionally close the main menu
  };

  const closeSummarize = () => {
    setShowSummarize(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
      setShowTranslate(false);
      setShowSummarize(false); // Close the TranslateMenu if clicking outside
    }
  };

  useEffect(() => {
    // Bind the event listener for clicks outside of the menu
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ margin: '20px', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', position: 'relative' }}>
       {/* Chat header */}
       <div style={{ borderBottom: '1px solid #ccc', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <h1>HOME</h1>
         <div>
           <button style={{ marginRight: '10px' }}>🔍</button>
           <button>⚪️</button>
         </div>
       </div>

       {/* Messages area */}
       <div style={{ padding: '20px', height: '400px', overflowY: 'auto' }}>
         {/* Messages would be mapped here */}
       </div>

       {/* Input area */}
       <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center' }}>
         <button type="button" onClick={handleMenuToggle} style={{ background: 'none', border: 'none', padding: '5px',width:'50px', cursor: 'pointer', marginRight: '5px' }}>➕</button>
         <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, height: '50px', fontSize: '16px', padding: '0 10px' }} // Increased height and font size
        />
      </form>

      {/* Popup menu */}
      {showMenu && (
        <div ref={menuRef} style={{ position: 'absolute', bottom: '50px', left: '0', backgroundColor: 'white', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: '8px', padding: '10px' }}>
          <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
            <li style={{ padding: '8px', cursor: 'pointer' }} onClick={handleTranslateClick} >Translate</li>
            <li style={{ padding: '8px', cursor: 'pointer' }}>Send Image</li>
            <li style={{ padding: '8px', cursor: 'pointer' }}>Send Notion</li>
            <li style={{ padding: '8px', cursor: 'pointer' }}>Call Bot</li>
            <li style={{ padding: '8px', cursor: 'pointer' }} onClick={handleSummarizeClick}>Summarise</li>
          </ul>
        </div>
      )}

      {/* Conditionally render TranslateMenu */}
      {showTranslate && (
        <TranslateMenu onClose={closeTranslate} />
      )}

      {showSummarize && (
        <SummarizeMenu onClose={closeSummarize} />
      )}

    </div>
  );
};

export default ChatWindow;
