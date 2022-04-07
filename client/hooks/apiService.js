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
import { UserDataContext } from "../contexts/UserDataContext";
import { derivePrivateKeyFromPassword, extractPublicKeyFromPrivateKey } from "../Crypto/crypt";

/**
 * All the methods contacting firebase. Maybe add methods to contact backend aswell,
 * Or maybe make a new js file to separate stuff.
 *
 * @author David Zamanian
 */

export function apiService() {
  const [user, setUser] = useState();
  const auth = getAuth();
  const { setRole, setUserSSN, setInstitution, setPrivateKey, setPublicKey } = React.useContext(UserDataContext);

  //Keeps track if user is logged in or not
  React.useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        let dbRef = ref(database);
        const userSnapshot = await get(child(dbRef, 'mapUser/' + auth.currentUser.uid))
        if (userSnapshot.val().role == "doctor"){
          const doctorSnapshot = await get(child(dbRef, 'Doctors/' + userSnapshot.val().SSN))
          setInstitution(doctorSnapshot.val().institution);
        }
        else{
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
    console.log("attempting fetch:"+auth.currentUser.uid)
    try{
      
      let dbRef = ref(database);
      const salt = await get(child(dbRef, 'mapUser/' + auth.currentUser.uid+"/salt"))
      if (salt.val()){
        return salt.val()
      }
      else{
        console.log("error")
        return "error";
      }
    }
    catch(e){
      console.log(e)
    }
  }

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
        
        let x = await new Promise(function (resolve, reject) {
          signInWithEmailAndPassword(auth, email, password)
            .then( async () => {
              resolve("Sign In Success");
            })
            .catch((error) => {
              reject(error);
            });
        });

        console.log("getting salt")
          
        let salt = await getSalt();
        console.log("got salt:"+salt)
        
        let privateKey = await derivePrivateKeyFromPassword(password, salt);
        console.log("Password:"+password+"\nSalt:"+salt+"\nPrivateKey:"+privateKey)
        setPrivateKey(privateKey)
        privateKey = `-----BEGIN PRIVATE KEY-----
MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBANSIBpLQNO+J+VGL
TO6bhB+lO6lOoRwCe6NPcjqv1r0z6Eu3eEFfvkgGpCxxwZjpj8Vb/OfCgJkABNn4
ecBS4j0iYhIz0BS4624Z+G/6kFcy/MqUeUOPSUeJMOWdCH8usjXqkTuB9bT0WOiN
mPNm2x5oOPUceK/MP4QW/YtzJa1TAgMBAAECgYAtvPhtMBG0W2Ukf24XC7DrfovQ
a/OQK5igFMDokF8OaNVdNibTKt+wcH10cybO2bTvLFTJK7qxMqfYoPjSwwOc8Bpb
YzRsXgpanydspsUOvoCNXtHmEybSmZ1meP1URB2WD/Lt1fHl5x4PXfbetoqK+Da4
m1GNnMbDI9gIwUdtQQJBAOuA3V+1LfYNOPPRQI9vQmzSZapty+KsCQADqZEl3JR7
7xDUzucLv0owfJMaotISN65c+mTdkM3sdbeY47kO4PUCQQDnB1Ub1z4hkPIJOEAm
ak+EsKPyC2DuKK8QOB+ddX1CCaienmgWfWuN6nImO5Rwmv0JsUYK6mMgOTX3gzXc
WsgnAkB+yKdlKRMPTdsFV/fbwFgQYcydzfJfm6JUwaP+IlX4EiiH9SlWNXrMJAJM
56AUW/5h/mhG+QlF8zEEoGiobhwpAkBFDe8FjFe45r9BvDuIf/xWuAm4/mexqB1z
pqLkiMqw43wwNT79ge2VFL+b5/Edm2YI8KD0AE0yw4b6/ZAq1kO/AkAWUBHUxI1K
bIq/ZkmEM0nbWOu8uU60hoos0oHKjuBF9KFN8p3dlodz0N02UAqLjjx1COiC341F
HTPhtf3w2f2F
-----END PRIVATE KEY-----
`;
        let publicKey = await extractPublicKeyFromPrivateKey(privateKey);
        setPublicKey(publicKey)
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
