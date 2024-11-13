import { useContext } from "react";
import { AppContext } from "../store/AppContext";
import OrderCard from "../components/history/OrderCard";

const HistoryPage: React.FC = () => {
  const { history } = useContext(AppContext);

  if (history.length === 0) {
    return <div>No previous orders found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Order History</h1>
      {history.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default HistoryPage;
