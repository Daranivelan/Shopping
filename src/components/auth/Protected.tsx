import React, { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { Navigate } from "react-router-dom";
import { routes } from "../../utils/Routes";
import loading from "../../assets/animations/loading.json";
import Lottie from "lottie-react";

interface ProtectedProps {
  element: React.ReactElement;
}

export default function Protected({ element }: ProtectedProps) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full">
        <div className="flex items-center justify-center h-screen">
          <Lottie
            animationData={loading}
            loop={true}
            style={{
              width: "30%",
              height: "30%",
            }}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={routes.login} />;
  }

  return element;
}
