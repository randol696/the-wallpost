import { useState, useEffect} from 'react';
import { db } from "./firebase-config";
import {collection,addDoc, getDocs, deleteDoc, doc} from "firebase/firestore";
import './App.css'



function App() {
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [post, setPost] = useState([]);
  const postCollectionRef = collection(db,"post");

  const postMessage = async () => {
    await addDoc(postCollectionRef, {user: user, message: message });
    setUser('');
    setMessage('');
    getPost();
  }
  
  const getPost = async () => {
    const data = await getDocs(postCollectionRef);
    setPost(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  }
  
  const deletePost = async (id) => {
    const deleteThisPost = doc(db,'post',id);
    await deleteDoc(deleteThisPost);
    getPost(); 
  }
  
  useEffect(()=>{ getPost();},[]); 
  
  const showPost = post.map(posts =>
    <>
    <div className="postMessage" key={posts.id}>
    <div className='message'><p><i className="fi fi-rr-comment-alt">
      </i> {posts.message}</p>
        <div className='userNamePost'>
            <span>Said by:</span><p><i className="fi fi-rr-users"></i> {posts.user}</p>
            <button onClick={() => deletePost(posts.id) }>Delete Post</button>
        </div>
      </div>
    </div>
    </>
  );

  return (
    <>
      <div className='container'>
        <h1>The Wallpost</h1>
          <div className='form'>
						<i className="fi fi-rr-users"> </i>
            <input type="text" placeholder="Nickname..." value={user} onChange={(event)=>setUser(event.target.value)}/>
            <textarea placeholder="Message..." value={message} onChange={(event)=>setMessage(event.target.value)}/>
            <button onClick={postMessage} id='submit'>Submit</button>
          </div>
          <div className='postwall'>{showPost}</div>
      </div>
    </>
  );
}
	
export default App;