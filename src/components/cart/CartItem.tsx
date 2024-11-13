import { useContext } from "react";
import CartModal from "../../models/CartModel";
import { AppContext } from "../../store/AppContext";

interface CartItemProps {
  item: CartModal;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
}

function CartItem({ item, decreaseQuantity, increaseQuantity }: CartItemProps) {
  const price = item.price * item.quantity;
  const { removeFromCart } = useContext(AppContext);

  return (
    <div className="flex items-center gap-6 p-6 bg-white rounded-lg custom-shadow transition-shadow duration-200">
      {/* Product Image */}
      <img
        src={item.image}
        alt={item.title}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        {/* Product Name and Price */}
        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
        <p className="text-md font-medium text-gray-600">${price}</p>
      </div>
      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <button
          className="px-3 py-1 bg-black text-yellow-500 font-bold rounded-full focus:outline-none transition-colors"
          onClick={() => decreaseQuantity(item.id)}
          disabled={item.quantity <= 1}
        >
          –
        </button>
        <span className="text-lg font-semibold w-[30px] text-center text-gray-800">
          {item.quantity}
        </span>
        <button
          onClick={() => increaseQuantity(item.id)}
          className="px-3 py-1 bg-yellow-500 text-black font-bold rounded-full focus:outline-none transition-colors"
        >
          +
        </button>
      </div>
      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 font-semibold hover:text-red-600 focus:outline-none transition-colors ml-4"
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;
