import { useContext } from "react";
import { AppContext } from "../store/AppContext";
import CartItem from "../components/cart/CartItem";
import { Link } from "react-router-dom";
import { routes } from "../utils/Routes";

const Cart = () => {
  const { cart, decreaseQuantity, increaseQuantity } = useContext(AppContext);
  const calculateTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Your Cart
        </h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id}>
                <CartItem
                  item={item}
                  decreaseQuantity={decreaseQuantity}
                  increaseQuantity={increaseQuantity}
                />
              </div>
            ))}
          </div>
        )}
        {cart.length > 0 && (
          <div className="mt-6 flex justify-between">
            <h3 className="text-xl font-bold">
              Total Price: ${calculateTotalPrice()}
            </h3>
            <Link
              to={routes.billing}
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
