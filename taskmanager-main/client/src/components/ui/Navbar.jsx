import React from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../../redux/slice/authSlice";
import UserAvatar from "./UserAvatar";
import NotificationPanel from "../NotificationPanel";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center bg-blue-950 px-4 py-3 2xl:py-4 sticky top-0 z-50 shadow-md border-l border-blue-800">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className="text-2xl text-blue-200 block md:hidden hover:text-white transition"
        >
          ☰
        </button>

        <div className="hidden sm:flex w-full md:w-64 lg:w-80 2xl:w-[400px] items-center py-2 px-3 gap-2 rounded-full bg-blue-900 focus-within:ring-2 ring-cyan-400">
          <MdOutlineSearch className="text-cyan-300 text-xl" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 outline-none bg-transparent placeholder:text-cyan-300 text-blue-100"
          />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <NotificationPanel />
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
