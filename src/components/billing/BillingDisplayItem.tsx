import CartModal from "../../models/CartModel";

interface BillingDisplayItemProps {
  item: CartModal;
}

function BillingDisplayItem({ item }: BillingDisplayItemProps) {
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
        <p className="text-md flex gap-3  items-center font-medium text-gray-600">
          <span>${item.price}</span>
          <span className="text-black font-semibold">
            {" "}
            Qty : {item.quantity}
          </span>
        </p>
      </div>
      {/* Quantity Controls */}

      {/* Remove Button */}
    </div>
  );
}

export default BillingDisplayItem;
