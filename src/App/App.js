import React, { useState, useRef } from 'react';
import { Button, IconButton } from "@chakra-ui/core";
import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import { theme } from "@chakra-ui/core";
import './App.scss';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
};

firebase.initializeApp({
  apiKey: "AIzaSyCuD7ReJ10Od7VuWMp976Bx93zZvvNZKXI",
  authDomain: "elektriq-219815.firebaseapp.com",
  databaseURL: "https://elektriq-219815.firebaseio.com",
  projectId: "elektriq-219815",
  storageBucket: "elektriq-219815.appspot.com",
  messagingSenderId: "975811330058",
  appId: "1:975811330058:web:42483886f36b36d9799ff3",
  measurementId: "G-YK67YTZS4C"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App({dark, isLight, isDark}) {
  const [user] = useAuthState(auth);

  return (
    <ThemeProvider theme={customTheme}>
      <div className={`app ${dark ? "dark" : "light"} h-screen`}>
        <section className={`${dark ? "bg-gray-900" : "bg-white"} py-5 mb-10 text-dark shadow-lg`}>
          <div className="container">
            <div className="flex justify-between">
              <img src="/logo-dark.svg" alt="Logo" className={`${dark ? "hidden" : ""}`} />
              <img src="/logo-light.svg" alt="Logo" className={`${dark ? "" : "hidden"}`} />
              <div>
                <SignOut dark={dark} />
                <span className={`${dark ? "" : "hidden"}`}>
                  <IconButton onClick={isLight} variantColor="gray" aria-label="Light Mode" icon="sun" />
                </span>
                <span className={`${dark ? "hidden" : ""}`}>
                  <IconButton onClick={isDark} variantColor="gray" aria-label="Dark Mode" icon="moon" />
                </span>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            {user ? <ChatRoom dark={dark}/> : <SignIn />}
          </div>
        </section>
        <footer className="text-center items-center text-white font-medium py-5 md:py-10">
          <p>Made with <span role="img" aria-label="emoji">❤️</span> by
            <a href="https://findtoni.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://findtoni.com/wp-content/uploads/sites/23/2018/11/logo_white.png" className={`${dark ? "" : "hidden"} ml-2 h-8 inline-block`} alt="findToni.com" />
              <img src="https://findtoni.com/wp-content/uploads/sites/23/2018/11/logo_white.png" className={`${dark ? "hidden" : ""} ml-2 h-8 inline-block`} alt="findToni.com" />
            </a>
            <br /> Built with React
          </p>
        </footer>
      </div>
      <CSSReset />
    </ThemeProvider>
  );
}

function ChatRoom({dark}) {
  const chatBottom = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');
  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    chatBottom.current.scrollIntoView({behaviour: 'smooth'});
  }

  return (
    <section className="superchat">
      {/* All Chats */}
      <div className="superchat__board">
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={chatBottom}></div>
      </div>

      {/* New Chat */}
      <form onSubmit={sendMessage} className="superchat__new py-10 w-full">
        <div className="container">
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} className="text-black w-full rounded px-3 h-10"
            placeholder="Type and hit enter, I'm sure it works..." />
        </div>
      </form>
    </section>
  )
}

function ChatMessage(props) {
  const { text, uid, createdAt, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  const timestamp = new Date(createdAt.seconds * 1000);
  const day = timestamp.getDate().toString();
  const month = timestamp.getMonth().toString();
  const year = timestamp.getFullYear().toString();
  const hour = timestamp.getHours().toString();
  const minute = timestamp.getMinutes().toString();

  return (
    <div className={`message-${messageClass} bubble flex items-center pb-3`}>
      <img src={photoURL} alt="User" className="h-10 rounded" />
      <div className="message bg-white py-2 px-3 rounded">
        <p className={`text-sm sm:text-xs font-medium`}>{text}</p>
      </div>
      <p className="timestamp pl-2 text-xs font-medium">{`${day}/${month}/${year} - ${hour}:${minute}`}</p>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="text-center pt-56">
      <Button variantColor="green" onClick={signInWithGoogle}>Login with Google</Button>
    </div>
  )
}

function SignOut({dark}) {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} className={`${dark ? "text-white" : "text-dark"} pr-3 font-bold text-xs`}>Logout</button>
  )
}

export default App;
