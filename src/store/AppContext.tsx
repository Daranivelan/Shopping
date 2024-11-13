import { createContext, useContext, useEffect, useState } from "react";
import {
  addHistory,
  addToCart,
  decreaseItemQuantity,
  emptyCart,
  getCart,
  getHistory,
  increaseItemQuantity,
  removeFromCart,
} from "../core/services/Products";
import { AuthContext } from "./AuthContext";
import CartModal from "../models/CartModel";
import { ProductModel } from "../models/ProductModel";
import { ShowSnackBar } from "../components/common/ShowSnackBar";
import { SnackBarContext } from "./SnackBarContext";
import { themeColors } from "../utils/Colors";
import BillingDetail from "../models/BillingDetail";

interface AppModal {
  cart: CartModal[];
  history: { id: string; items: CartModal[]; userData: BillingDetail }[];
  singleSelectedItem: CartModal | null;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  addToCart: (product: ProductModel) => void;
  removeFromCart: (id: string) => void;
  setSingleSelectedItem: (item: CartModal) => void;
  emptySingleSelectedItem: () => void;
  emptyCart: () => void;
  setHistory: (
    history: CartModal[],
    userData: BillingDetail
  ) => Promise<boolean>;
}

const initialAppState: AppModal = {
  cart: [],
  singleSelectedItem: {
    id: "",
    title: "",
    price: 0,
    image: "",
    quantity: 0,
  },
  history: [],
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  addToCart: () => {},
  setSingleSelectedItem: () => {},
  removeFromCart: () => {},
  emptySingleSelectedItem: () => {},
  emptyCart: () => {},
  setHistory: async () => false,
};

export const AppContext = createContext(initialAppState);

function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartModal[]>([]);
  const [history, setHistory] = useState<
    {
      id: string;
      items: CartModal[];
      userData: BillingDetail;
    }[]
  >([]);
  const [_, dispatch] = useContext(SnackBarContext);
  const [singleSelectedItem, setSingleSelectedItem] =
    useState<CartModal | null>(null);

  const handleIncreaseQuantity = async (id: string) => {
    const response = await increaseItemQuantity(id);
    if (response) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    }
  };

  const handleEmptyCart = async () => {
    const response = await emptyCart();
    if (response) {
      setCart([]);
    }
  };

  const handleDecreaseQuantity = async (id: string) => {
    const response = await decreaseItemQuantity(id);
    if (response) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    }
  };

  const emptySingleSelectedItem = () => {
    setSingleSelectedItem(null);
  };

  const handleSetHistory = async (
    history: CartModal[],
    userData: BillingDetail
  ): Promise<boolean> => {
    const response = await addHistory(history, userData);
    if (response.length === 0) return false;
    const refactoredItem = {
      id: response,
      items: history,
      userData: { ...userData },
    };
    setHistory((pre) => [...pre, refactoredItem]);
    return true;
  };

  const handleSetSigleSelectedItem = (item: CartModal) => {
    setSingleSelectedItem(item);
  };

  const handleAddToCart = async (product: ProductModel) => {
    const cartItem: CartModal = {
      id: product.id.toString(),
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    if (cart.find((item) => item.id.toString() === product.id.toString())) {
      ShowSnackBar({
        dispatch,
        color: themeColors.primary,
        textColor: themeColors.yellow,
        message: "Item is already in the Cart",
      });
      return;
    }
    const response = await addToCart(cartItem);
    if (response) {
      ShowSnackBar({
        dispatch,
        color: themeColors.yellow,
        textColor: themeColors.primary,
        message: "Successfully Added to the Cart",
      });
      setCart((prev) => [...prev, cartItem]);
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    const response = await removeFromCart(id);
    if (response) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      ShowSnackBar({
        dispatch,
        color: themeColors.primary,
        textColor: themeColors.yellow,
        message: "Item Removed from the Cart",
      });
    }
  };

  const { user } = useContext(AuthContext);

  useEffect(() => {
    handleGetCart();
    handleGetHistory();
  }, [user]);

  async function handleGetCart() {
    if (!user) return;
    const response = await getCart(user.uid);
    setCart(response);
  }

  async function handleGetHistory() {
    if (!user) return;
    const response = await getHistory(user.uid);
    setHistory(response);
  }

  const ctxValue: AppModal = {
    cart,
    history,
    singleSelectedItem: singleSelectedItem,
    setHistory: handleSetHistory,
    increaseQuantity: handleIncreaseQuantity,
    decreaseQuantity: handleDecreaseQuantity,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    setSingleSelectedItem: handleSetSigleSelectedItem,
    emptySingleSelectedItem: emptySingleSelectedItem,
    emptyCart: handleEmptyCart,
  };

  return (
    <AppContext.Provider value={ctxValue}>
      <div className="font-sans">{children}</div>
    </AppContext.Provider>
  );
}

export default AppProvider;
