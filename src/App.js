import React, { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Signin with Google</button>
  )
}

// function SignOut() {
//   return auth.currentUser && (
//     <button onClick={() => auth.signOut()}>Sign Out</button>
//   )
// }

function ChatRoom() {
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
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </section>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="User" />
      <p>{text}</p>
    </div>
  )
}

export default App;
