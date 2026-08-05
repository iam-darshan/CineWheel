import React, { useState, useEffect } from "react";
import "./Authentication.css";
import logo from "../assets/logo.png";

import { db } from "../firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

function Authentication({
  setuserName,
  setmovies,
  setWatchedMoviesList,
}) {
  const [show, setshow] = useState("show");

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Empty library for new users
  const defaultLibrary = [];

  // Create Firestore document if it doesn't exist
  const CreateUser = async (id, email, name) => {
    const userRef = doc(db, "CineWheel", id);

    try {
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();

        console.log("Existing user");

        setuserName(data.userName || name);
        setmovies(data.library || []);
        setWatchedMoviesList(data.watchedMovies || []);

        return;
      }

      console.log("Creating Firestore document...");

      await setDoc(userRef, {
        userName: name,
        email: email,
        library: defaultLibrary,
        watchedMovies: [],
      });

      console.log("Firestore document created");

      setuserName(name);
      setmovies(defaultLibrary);
      setWatchedMoviesList([]);
    } catch (err) {
      console.error("CreateUser Error:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      setshow("hide");
      setuserName(user.displayName);

      // Load cached data first
      const cachedLibrary = JSON.parse(
        localStorage.getItem(`library_${user.uid}`)
      );

      const cachedWatched = JSON.parse(
        localStorage.getItem(`watched_${user.uid}`)
      );

      if (cachedLibrary) {
        setmovies(cachedLibrary);
      }

      if (cachedWatched) {
        setWatchedMoviesList(cachedWatched);
      }

      // Listen to Firestore
      const unsubscribeSnapshot = onSnapshot(
        doc(db, "CineWheel", user.uid),
        (docSnap) => {
          if (!docSnap.exists()) {
            console.log("Waiting for Firestore document...");
            return;
          }

          const data = docSnap.data();

          setmovies(data.library || []);
          setWatchedMoviesList(data.watchedMovies || []);

          localStorage.setItem(
            `library_${user.uid}`,
            JSON.stringify(data.library || [])
          );

          localStorage.setItem(
            `watched_${user.uid}`,
            JSON.stringify(data.watchedMovies || [])
          );
        },
        (err) => {
          console.error("Snapshot Error:", err);
        }
      );

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribe();
  }, []);

  const SignInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        console.log("Signed In");
        console.log(user.email);

        // Wait until Firestore document exists
        await CreateUser(
          user.uid,
          user.email,
          user.displayName
        );
      })
      .catch((err) => {
        console.error("Google Sign In Error:", err);
      });
  };

  return (
    <div className={`authenticatorContainer ${show}`}>
      <div className="authenticatorPopup">
        <div className="titleAndTag">
          <div className="AuthenticationText" style={{ margin: 0 }}>
            <img src={logo} alt="logo" className="logo" />
            <h1>CineWheel</h1>
          </div>

          <h5 className="AuthenticationText">
            Spin. Discover. Watch. ⭐
          </h5>
        </div>

        <img
          src="/google.png"
          alt="Google Sign In"
          className="googleSignin"
          onClick={SignInWithGoogle}
        />
      </div>
    </div>
  );
}

export default Authentication;