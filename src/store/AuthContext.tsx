import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { AuthUserModel } from "../models/AuthUserModel";
import { auth } from "../core/config/Firebase";
import { getUser } from "../core/services/AuthService";

interface AuthModal {
  user: User | null;
  isLoading: boolean;
  authUser: AuthUserModel | null;
}

const authState: AuthModal = {
  user: null,
  isLoading: true,
  authUser: null,
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext(authState);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUserModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async (user: User) => {
      try {
        const userData = await getUser(user.uid);
        setAuthUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAuthUser(null);
      }
    };
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUser(user);
        fetchUserData(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const ctxValue: AuthModal = {
    user,
    isLoading,
    authUser,
  };

  return (
    <AuthContext.Provider value={ctxValue}>
      <div className="font-sans">{children}</div>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
