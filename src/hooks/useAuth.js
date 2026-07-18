import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "../firebase-config";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        return;
      }
      signInAnonymously(auth).catch((error) => setAuthError(error.message));
    });

    return unsubscribe;
  }, []);

  return { user, authError };
}
