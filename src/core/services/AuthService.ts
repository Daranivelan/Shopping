import { createUserWithEmailAndPassword, FacebookAuthProvider, fetchSignInMethodsForEmail, OAuthCredential, signInWithEmailAndPassword, signInWithPopup, User } from "firebase/auth";
import { auth, db, facebookProvider, googleProvider } from "../config/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthUserModel } from "../../models/AuthUserModel";
import { GoogleAuthProvider } from "firebase/auth";


export async function login(email: string, password: string): Promise<User | null> {
    try {
      const response = await signInWithEmailAndPassword(auth,email, password);
      return response.user;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
}
export async function signup(name:string,email: string, password: string): Promise<User | null> {
    try{
      const response = await createUserWithEmailAndPassword(auth, email, password);
      if(response.user){
        await setDoc(doc(db, "users", response.user.uid), {
          email: email,
          name: name,
        });
      }
      return response.user;
    }catch(e){
      return null;
    }
}
export async function googleSignIn(): Promise<User | null> {

  try {
    // Step 1: Perform Google sign-in popup
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result) as OAuthCredential;

    if (credential) {
      const user = result.user;

      if (user) {
        // Step 2: Check if the email is already linked with another provider
        const signInMethods = user.email ? await fetchSignInMethodsForEmail(auth, user.email) : [];
        // Step 3: If the email is linked with Google, proceed, otherwise show an alert
        if (!signInMethods.includes("facebook.com") ) {
          // If the email is already linked with Google, allow login

          // Save user data to Firestore
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
          });

          return user;
        } else {
          // Show alert if email is not linked with Google
          alert("The email is not linked with a Google account. Please try logging in with a different method.");
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Google login error:", error);
    return null;
  }
}

export async function facebookLogin(): Promise<User | null> {
  
  try {
    // Step 1: Perform Facebook sign-in popup
    const result = await signInWithPopup(auth, facebookProvider);
    const credential = FacebookAuthProvider.credentialFromResult(result) as OAuthCredential;

    if (credential) {
      const user = result.user;

      if (user) {
        // Step 2: Check if the email is already linked with another provider
        const signInMethods = user.email ? await fetchSignInMethodsForEmail(auth, user.email) : [];
        // Step 3: If the email is linked with Facebook, proceed, otherwise show an alert
        if (!signInMethods.includes("google.com")) {
          // If the email is already linked with Facebook, allow login

          // Save user data to Firestore
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
          });

          return user;
        } else {
          // Show alert if email is not linked with Facebook
          alert("The email is not linked with a Facebook account. Please try logging in with a different method.");
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error:any) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      const email = error.customData.email;
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      alert("Account exists with Google Sign in or manual Sign in");
      if (signInMethods.includes('google.com')) {
      } else if (signInMethods.includes('facebook.com')) {
      }
    }
    return null;
  }
}

export async function getUser(uid: string): Promise<AuthUserModel | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const authUser: AuthUserModel = {
          email: userData.email,
          id: uid,
          userName: userData.userName,
        };
        return authUser;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

export async function logout() {
    await auth.signOut();
}