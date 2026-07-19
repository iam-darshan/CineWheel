import React from 'react'
import './Authentication.css'
import logo from '../assets/logo.png'
import { Flame } from 'lucide-react'
import { useState, useEffect } from 'react'

import app from "../firebase.js";
import { db } from "../firebase.js";
import { doc, collection, getDoc, getDocs, getFirestore, setDoc, onSnapshot } from "firebase/firestore";


import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";




function Authentication({ setuserName, setmovies, setWatchedMoviesList }) {
    const [show, setshow] = useState("show");


    const CreateUser = async (id, email, name) => {
        const userRef = doc(db, "CineWheel", id);
        const snap = await getDoc(userRef);

        const CreateUser = async (id, email, name) => {
    const userRef = doc(db, "CineWheel", id);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        const data = snap.data();

        console.log("Using existing Firestore data:", data);

        setuserName(data.userName || name);
        setmovies(data.library || []);
        setWatchedMoviesList(data.watchedMovies || []);

        return;
    }

    // New user
    await setDoc(userRef, {
        userName: name,
        email: email,
        library: defaultLibrary,
        watchedMovies: []
    });

    setuserName(name);
    setmovies(defaultLibrary);
    setWatchedMoviesList([]);
};
    }


    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    useEffect(() => {


        const unsubscribe = onAuthStateChanged(auth, (user) => {

            if (user) {

                setshow("hide");
                setuserName(user.displayName)

                const unsubscribeSnapshot = onSnapshot(
                    doc(db, "CineWheel", user.uid),
                    (docSnap) => {

                        const data = docSnap.data();

                        setmovies(data.library || []);
                        setWatchedMoviesList(data.watchedMovies || []);
                        setmovies(data.library || []);

                    }
                );

            }

        });

        return unsubscribe;
    }, []);

    const SignInWithGoogle = () => {
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("Signed In")
                console.log(user.email, user.displayName)
                CreateUser(user.uid, user.email, user.displayName)


                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }



    return (
        <div className={`authenticatorContainer ${show}`}>
            <div className="authenticatorPopup">
                <div className='titleAndTag'>
                    <div className='AuthenticationText' style={{ margin: 0 }}>
                        <img src={logo} alt="logo" className='logo' />
                        <h1>CineWheel</h1>
                    </div>
                    <h5 className='AuthenticationText' >Spin. Discover. Watch. ⭐</h5>
                </div>

                <div>
                    <img src="/google.png" alt="Google SignIN" className='googleSignin' onClick={() => {
                        SignInWithGoogle()
                    }} />
                </div>
            </div>
        </div>
    )
}

export default Authentication
