import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function RootPage() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default RootPage;
