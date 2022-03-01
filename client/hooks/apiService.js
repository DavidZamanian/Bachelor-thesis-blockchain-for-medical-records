import React, { useState } from "react";
import { auth, database } from "../firebaseSetup";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "@firebase/auth";

/**
 * All the methods contacting firebase. Maybe add methods to contact backend aswell,
 * Or maybe make a new js file to separate stuff.
 *
 * @author David Zamanian
 */

export function apiService() {
  const [user, setUser] = useState();

  //Keeps track if user is logged in or not
  const onAuthStateChanged = (user) => {
    setUser(user);
  };

  React.useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const submit = React.useMemo(() => ({}), []);

  const authentication = React.useMemo(
    () => ({
      login: async (email, password) => {
        return new Promise(function (resolve, reject) {
          signInWithEmailAndPassword(auth, email, password)
            .then(() => {
              resolve("Sign In Success");
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      logOut: async () => {
        return new Promise(function (resolve, reject) {
          alert("Sign out");
          signOut(auth)
            .then(() => {
              resolve("Sign Out Success");
              console.log("sign out");
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      register: async (email, password) => {
        return new Promise(function (resolve, reject) {
          createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
              resolve("Sign Up Success");
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      updateEmail: async (email, password) => {
        return new Promise(function (resolve, reject) {
          signInWithEmailAndPassword(auth, email, password)
            .then(function (userCredential) {
              userCredential.user.updateEmail(newEmail);
              resolve("Email Change Success");
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      updatePassword: async (email, password, newPassword) => {
        return new Promise(function (resolve, reject) {
          signInWithEmailAndPassword(auth, email, password)
            .then(function (userCredential) {
              userCredential.user.updatePassword(newPassword);
              resolve("Password Change Success");
              alert("Password Changed Succesfully");
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      resetPassword: async (email) => {
        return new Promise(function (resolve, reject) {
          sendPasswordResetEmail(auth, email)
            .then(() => {
              resolve("Email Sent Successfully");
              alert("Email Sent Successfully");
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
    }),
    []
  );

  return { authentication, user };
}
