/*


TODO (just need to connect firebase auth)

import React, { useState } from "react";
import { firebase } from "";

export function apiService() {
  const [user, setUser] = useState();

  //Keeps track if user is logged in or not
  const onAuthStateChanged = (user) => {
    setUser(user);
  };

  React.useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const auth = React.useMemo(
    () => ({
      login: async (email, password) => {
        return new Promise(function (resolve, reject) {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
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
          firebase
            .auth()
            .signOut()
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
          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
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
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
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
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
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
          firebase
            .auth()
            .sendPasswordResetEmail(email)
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

  return { auth, user };
}
*/