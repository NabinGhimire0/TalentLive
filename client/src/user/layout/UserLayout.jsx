import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoutes from "../common/ProtectedRoutes";
import UserHeader from "../common/UserHeader";
import UserSidebar from "../common/UserSidebar";

// import { checkAuth } from "../../Redux/Slice/authSlice";

const UserLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoutes>
      <UserHeader setOpen={setOpen} isSidebarOpen={open} />
      <UserSidebar open={open} setOpen={setOpen} />
      <div
        className={`pt-5  transition-all bg-[#F4F6F9] duration-300 ${open ? "lg:pl-64" : "lg:pl-20"}`}>
        <Outlet />
      </div>
    </ProtectedRoutes>
  );
};

export default UserLayout;
