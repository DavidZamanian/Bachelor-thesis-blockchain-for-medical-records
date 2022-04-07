import { createContext } from "react";

export const UserDataContext = createContext({
  role: "",
  setRole: () => {},
  userSSN: "",
  setUserSSN: () => {},
  institution: "",
  setInstitution: () => {},
  privateKey: "",
  setPrivateKey: () => {},
  publicKey: "",
  setPublicKey: () => {},
});
