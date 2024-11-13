import { collection, deleteDoc, doc, getDocs, increment, setDoc, updateDoc } from "firebase/firestore";
import { ProductModel } from "../../models/ProductModel";
import { auth, db } from "../config/Firebase";
import CartModal from "../../models/CartModel";
import BillingDetail from "../../models/BillingDetail";

export async function getAllProducts(): Promise<ProductModel[]> {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if(response.ok) {
      const data: ProductModel[] = await response.json();
      return data;
    }
    return [];
  }catch(e) {
      console.error(e);
      return [];
  }
}

export async function getCart(uid: string): Promise<CartModal[]> {
  try {
    const cartCollectionRef = collection(db, "users", uid, "cart");
    const cartSnapshot = await getDocs(cartCollectionRef);
    const cartItems:CartModal[] = []
    cartSnapshot.docs.map(doc => {
      const data = doc.data();
      cartItems.push(data as CartModal);
    });
    return cartItems;
  }catch(e) {
    console.error(e);
    return [];
  }
}
export async function getHistory(uid: string): Promise<{id:string,items:CartModal[],userData:BillingDetail}[]> {
  try {
    const historyCollectionRef = collection(db, "users", uid, "history");
    const historySnapshot = await getDocs(historyCollectionRef);
    const historyItems:{id:string,items:CartModal[],userData:BillingDetail}[] = []
    historySnapshot.docs.map(doc => {
      const data = doc.data();
      historyItems.push({
        id:doc.id,
        items:data.items as CartModal[],
        userData:data.userData as BillingDetail
      });
    });
    return historyItems;
  }catch(e) {
    console.error(e);
    return [];
  }
}

export async function addHistory(items: CartModal[], userData: BillingDetail): Promise<string> {
  const user = auth.currentUser;
  if (!user) return "";

  try {
    const historyCollectionRef = collection(db, "users", user.uid, "history");
    
    const newDocRef = doc(historyCollectionRef);

    const refactoredItem = {
      items: items,
      userData: userData,
    };

    await setDoc(newDocRef, refactoredItem);

    return newDocRef.id;
  } catch (e) {
    console.error(e);
    return "";
  }
}

export async function increaseItemQuantity(id: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const cartCollectionRef = collection(db, "users", user.uid, "cart");

    const itemRef = doc(cartCollectionRef, id);

    await updateDoc(itemRef, {
      quantity: increment(1),
    });

    return true;
  } catch (e) {
    console.error("Error increasing item quantity:", e);
    return false;
  }
}

export async function decreaseItemQuantity( id: string): Promise<boolean> {
  const user = auth.currentUser;
  if(!user) return false;
  try {
    const cartCollectionRef = collection(db, "users", user.uid, "cart");

    const itemRef = doc(cartCollectionRef, id);

    await updateDoc(itemRef, {
      quantity: increment(-1),
    });

    return true;
  } catch (e) {
    console.error("Error increasing item quantity:", e);
    return false;
  }
}

export async function addToCart(cartItem: CartModal): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    const cartCollectionRef = collection(db, "users", user.uid, "cart");
    await setDoc(doc(cartCollectionRef, cartItem.id), cartItem);
    return true;
  }catch (e) {
    console.error("Error");
    return false;
  }
}

export async function emptyCart(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const cartCollectionRef = collection(db, "users", user.uid, "cart");
    const cartSnapshot = await getDocs(cartCollectionRef);

    const deletePromises = cartSnapshot.docs.map((doc) => deleteDoc(doc.ref));

    await Promise.all(deletePromises);

    return true;
  } catch (e) {
    console.error(e);
    return false; 
  }
}

export async function removeFromCart(id: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const cartItemRef = doc(db, "users", user.uid, "cart", id);
    await deleteDoc(cartItemRef);
    return true;
  }catch(e) {
    console.error("Error removing item from cart:", e);
    return false;
  }
}