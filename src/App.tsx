import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootPage from "./pages/RootPage";
import { routes } from "./utils/Routes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
// import Order from "./pages/Order";
import History from "./pages/History";
import Billing from "./pages/Billing";
import Protected from "./components/auth/Protected";
import AuthProvider from "./store/AuthContext";
import AppProvider from "./store/AppContext";
import { SnackBarProvider } from "./store/SnackBarContext";

function App() {
  const router = createBrowserRouter([
    {
      path: routes.home,
      element: <RootPage />,
      children: [
        {
          path: routes.home,
          element: <Home />,
        },
        {
          path: routes.login,
          element: <Login />,
        },
        {
          path: routes.signup,
          element: <Signup />,
        },
        {
          path: routes.cart,
          element: <Protected element={<Cart />} />,
        },
        // {
        //   path: routes.order,
        //   element: <Order />,
        // },
        {
          path: routes.history,
          element: <History />,
        },
        {
          path: routes.billing,
          element: <Billing />,
        },
      ],
    },
  ]);
  return (
    <SnackBarProvider>
      <AuthProvider>
        <AppProvider>
          <div>
            <RouterProvider router={router} />
          </div>
        </AppProvider>
      </AuthProvider>
    </SnackBarProvider>
  );
}

export default App;
