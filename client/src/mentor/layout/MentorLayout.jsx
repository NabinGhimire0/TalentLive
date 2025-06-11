import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoutes from "../common/ProtectedRoutes";
import AdminHeader from "../common/MentorHeader";
import AdminSidebar from "../common/MentorSidebar";

// import { checkAuth } from "../../Redux/Slice/authSlice";

const MentorLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoutes>
      <AdminHeader setOpen={setOpen} isSidebarOpen={open} />
      <AdminSidebar open={open} setOpen={setOpen} />
      <div
        className={`pt-5  transition-all bg-[#F4F6F9] duration-300 ${open ? "lg:pl-64" : "lg:pl-20"}`}>
        <Outlet />
      </div>
    </ProtectedRoutes>
  );
};

export default MentorLayout;
