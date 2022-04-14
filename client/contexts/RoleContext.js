import { createContext } from "react";

export const RoleContext = createContext({
    role: "", setRole: () => {},
    userSSN: "", setUserSSN: () => {},
    institution: "", setInstitution: () => {},
    language: "en", setLanguage: () => {},
});
