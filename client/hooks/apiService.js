import React, { useState } from "react";
import { database, get, child } from "../firebaseSetup";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  getAuth,
  onAuthStateChanged,
} from "@firebase/auth";
import { ref, update, onValue } from "firebase/database";
import { RoleContext } from "../contexts/RoleContext";

/**
 * All the methods contacting firebase. Maybe add methods to contact backend aswell,
 * Or maybe make a new js file to separate stuff.
 *
 * @author David Zamanian
 */

export function apiService() {
  const [user, setUser] = useState();
  const auth = getAuth();
  const { setRole, setUserSSN } = React.useContext(RoleContext);

  //Keeps track if user is logged in or not
  React.useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        let dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'mapUser/' + auth.currentUser.uid))
        setUserSSN(snapshot.val().SSN);
        setRole(snapshot.val().role);
      } else {
        setUser();
        setRole("");
        setUserSSN("");
      }
    });
    return subscriber;
  }, []);

  const updateInfo = React.useMemo(
    () => ({
      updateEmail: async (uid, email) => {
        return new Promise(function (resolve, reject) {
          update(ref(database, "Users/" + uid), {
            email: email,
          })
            .then(() => {
              resolve("Email updated successfully");
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      updateAddress: async (uid, address) => {
        return new Promise(function (resolve, reject) {
          update(ref(database, "Users/" + uid), {
            address: address,
          })
            .then(() => {
              resolve("Address updated successfully");
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      updatePhoneNr: async (uid, phoneNr) => {
        return new Promise(function (resolve, reject) {
          update(ref(database, "Users/" + uid), {
            phoneNr: phoneNr,
          })
            .then(() => {
              resolve("Phone number updated successfully");
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
    }),
    []
  );
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
          signOut(auth)
            .then(() => {
              resolve("Sign Out Success");
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

  return { authentication, user, updateInfo };
}
