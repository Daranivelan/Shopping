import BillingDetail from "../../models/BillingDetail";
import CartModal from "../../models/CartModel";
import { icons } from "../../utils/Icons";

interface OrderCardProps {
  order: { id: string; items: CartModal[]; userData: BillingDetail };
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { id, items, userData } = order;

  const getPaymentIcon = () => {
    switch (userData.paymentMethod) {
      case "COD":
        return <img src={icons.cod} width={30} height={30} />;
      case "UPI":
        return <img src={icons.upi} width={50} height={50} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white custom-shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Order ID: {id}</h2>

      {/* Billing Details */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Billing Details</h3>
        <div className="text-gray-700">
          <p>
            <span className="font-semibold">Name:</span> {userData.name}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {userData.address},{" "}
            {userData.city}, {userData.state}, {userData.pincode}
          </p>
          <p className="flex items-center gap-2 my-2">
            <span className="font-semibold">Payment Method:</span>
            {getPaymentIcon()}({userData.paymentMethod})
          </p>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Ordered Items</h3>
        {items.map((item) => (
          <div key={item.id} className="flex items-center mb-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-24 h-24 object-cover rounded-lg mr-4"
            />
            <div className="flex-1">
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-gray-600">
                Quantity: {item.quantity} x ${item.price.toFixed(2)}
              </p>
              <p className="font-semibold text-yellow-500">
                Total: ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <div className="text-right font-bold text-xl">
        Total Price: $
        {items
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2)}
      </div>
    </div>
  );
};

export default OrderCard;
