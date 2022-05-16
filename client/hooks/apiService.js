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
import { ref, update } from "firebase/database";
import { UserDataContext } from "../contexts/UserDataContext";
import EHRService from "../src/Helpers/ehrService";
import ChainConnectionFactory from "../src/chainConnection/chainConnectionFactory";
/**
 * All the methods contacting firebase. Maybe add methods to contact backend aswell,
 * Or maybe make a new js file to separate stuff.
 *
 * @author David Zamanian
 */

export function apiService() {
  const [user, setUser] = useState();
  const auth = getAuth();
  const { setRole, setUserSSN, setInstitution } =
    React.useContext(UserDataContext);
  const chainConnection = ChainConnectionFactory.getChainConnection();

  //Keeps track if user is logged in or not
  React.useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        let dbRef = ref(database);
        const userSnapshot = await get(
          child(dbRef, "mapUser/" + auth.currentUser.uid)
        );
        if (userSnapshot.val().role == "doctor") {
          const connection = await chainConnection;
          let inst = await connection.getHealthCareInstitution(
            userSnapshot.val().SSN
          );
          setInstitution(inst);
        } else {
          setInstitution("");
        }
        setUserSSN(userSnapshot.val().SSN);
        setRole(userSnapshot.val().role);
      } else {
        setUser();
        setRole("");
        setUserSSN("");
        setInstitution("");
      }
    });
    return subscriber;
  }, []);

  const getSalt = async () => {
    try {
      let dbRef = ref(database);
      const salt = await get(
        child(dbRef, "mapUser/" + auth.currentUser.uid + "/salt")
      );
      if (salt.val()) {
        return salt.val();
      } else {
        console.log("error");
        return "error";
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateInfo = React.useMemo(
    () => ({
      updateEmail: async (uid, email) => {
        return new Promise(function (resolve, reject) {
          update(ref(database, "Patients/" + uid), {
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
          update(ref(database, "Patients/" + uid), {
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
          update(ref(database, "Patients/" + uid), {
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
        let x = await new Promise(function (resolve, reject) {
          signInWithEmailAndPassword(auth, email, password)
            .then(async () => {
              resolve("Sign In Success");
            })
            .catch((error) => {
              reject(error);
            });
        });

        let salt = await getSalt();

        await EHRService.setKeys(password, salt);

        console.debug(EHRService.privateKey);

        return x;
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
