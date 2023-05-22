// UserProvider.jsx
import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailLink } from "firebase/auth";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // add if the state of auth are checked

  useEffect(() => {
    let unsubscribeAuth = null;

    unsubscribeAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setUser({
          uid: userAuth.uid,
          email: userAuth.email,
        });
      } else {
        setUser(null);
      }
    });

    // Listen for messages from the service worker
    const handleMessage = async (request) => {
      if (request.type === "emailLink") {
        console.log("emailLink from background.js");
        await signInWithEmailLink(auth, request.email, request.emailLink);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }

      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
