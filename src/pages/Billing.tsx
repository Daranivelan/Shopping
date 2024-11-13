import { Verified } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { themeColors } from "../utils/Colors";
import BillingDisplayItem from "../components/billing/BillingDisplayItem";
import SuccessAnimation from "../assets/animations/success.json";
import { AppContext } from "../store/AppContext";
import Lottie from "lottie-react";
import { routes } from "../utils/Routes";
import { Link } from "react-router-dom";
import CartModal from "../models/CartModel";

interface BillingDetailState {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Billing: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [upiId, setUpiId] = useState<string>("");
  const [upiVerified, setUpiVerified] = useState<boolean>(false);
  const [userData, setUserData] = useState<BillingDetailState>({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const {
    cart,
    singleSelectedItem,
    emptySingleSelectedItem,
    setHistory,
    emptyCart,
  } = useContext(AppContext);
  const [cartData, setCartData] = useState<CartModal[]>([]);
  useEffect(() => {
    if (singleSelectedItem) {
      setCartData([singleSelectedItem]);
    } else {
      setCartData(cart);
    }
    return () => {
      emptySingleSelectedItem();
    };
  }, []);

  const handleVerifyUpi = () => {
    setUpiVerified(true);
  };

  const handlePlaceOrder = async () => {
    const response = await setHistory(cartData, {
      ...userData,
      paymentMethod: paymentMethod,
    });
    if (response) {
      if (!singleSelectedItem) {
        emptyCart();
      }
      setOrderPlaced(true);
    }
  };
  const calculateTotalPrice = () => {
    return cartData
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };
  const isUserDataValid = Object.values(userData).every(
    (value) => value.trim() !== ""
  );
  const disabled =
    paymentMethod === "UPI"
      ? !upiVerified || !isUserDataValid
      : !isUserDataValid;
  return (
    <div className="flex flex-wrap">
      {orderPlaced && <Confetti numberOfPieces={1500} recycle={false} />}
      {orderPlaced && (
        <div className="flex flex-col flex-1 items-center justify-center">
          <div className="w-[300px] h-[300px]">
            <Lottie
              animationData={SuccessAnimation}
              loop={false}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <p className="text-2xl font-bold">Order Placed Successfully!</p>
          <p className="text-xl font-semibold mt-2">Thanks for Shopping 💝</p>
          <div className="flex items-center gap-3">
            <Link
              className="hover:underline text-xl text-yellow-500 font-semibold mt-4"
              to={routes.home}
            >
              Back to Home
            </Link>
            <Link
              className="hover:underline text-xl text-yellow-500 font-semibold mt-4"
              to={routes.history}
            >
              Go to History
            </Link>
          </div>
        </div>
      )}

      {!orderPlaced && (
        <div className="max-w-lg mx-auto p-6 my-5 w-[55%] bg-white custom-shadow rounded-lg relative">
          {/* Confetti Animation */}

          <h2 className="text-2xl font-bold text-center mb-6">
            Billing Details
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Address
            </label>
            <input
              type="text"
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              placeholder="Enter your address"
              required
            />
          </div>

          {/* City */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              City
            </label>
            <input
              type="text"
              onChange={(e) =>
                setUserData({ ...userData, city: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              placeholder="Enter your city"
              required
            />
          </div>

          {/* State */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              State
            </label>
            <input
              onChange={(e) =>
                setUserData({ ...userData, state: e.target.value })
              }
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              placeholder="Enter your state"
              required
            />
          </div>

          {/* Pincode */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Pincode
            </label>
            <input
              onChange={(e) =>
                setUserData({ ...userData, pincode: e.target.value })
              }
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              placeholder="Enter your pincode"
              required
            />
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Payment Method
            </label>
            <div className="flex gap-4">
              <div>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mr-2"
                />
                <label htmlFor="cod" className="text-gray-700">
                  Cash on Delivery (COD)
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                  className="mr-2"
                />
                <label htmlFor="upi" className="text-gray-700">
                  UPI
                </label>
              </div>
            </div>
          </div>

          {/* UPI Section */}
          {paymentMethod === "UPI" && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                placeholder="Enter UPI ID"
                required
              />
              <button
                onClick={handleVerifyUpi}
                className={`mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold transition-all duration-[1500ms] ease-in-out ${
                  upiVerified
                    ? "bg-black text-yellow-500"
                    : "bg-yellow-500 text-black "
                }`}
                style={{
                  background: upiVerified ? themeColors.primary : "",
                  backgroundSize: "200% 100%",
                  backgroundPosition: upiVerified ? "left" : "",
                }}
              >
                <span>
                  {upiVerified && (
                    <Verified
                      sx={{
                        color: themeColors.yellow,
                      }}
                    />
                  )}
                </span>
                {upiVerified ? "Verified" : "Verify"}
              </button>
            </div>
          )}
        </div>
      )}
      {!orderPlaced && (
        <div className=" flex w-[45%] flex-col justify-start items-center">
          <div className="bg-white custom-shadow w-[90%] mt-10 rounded-lg p-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
              Your Cart
            </h2>

            <div className="space-y-4">
              {cartData.map((item) => (
                <div key={item.id}>
                  <BillingDisplayItem item={item} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <h3 className="text-xl font-bold">
                Total Price: ${calculateTotalPrice()}
              </h3>
            </div>
            <button
              disabled={disabled}
              onClick={handlePlaceOrder}
              className={`${
                disabled && "cursor-not-allowed"
              } w-full bg-yellow-500 text-black font-bold py-3 rounded-lg mt-6`}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
