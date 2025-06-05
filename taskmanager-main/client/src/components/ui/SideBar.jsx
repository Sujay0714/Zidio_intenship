import React from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { IoIosVideocam } from "react-icons/io";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../../redux/slice/authSlice";
import clsx from "clsx";

// Navigation links
const linkData = [
  { label: "Dashboard", link: "dashboard", icon: <MdDashboard /> },
  { label: "Tasks", link: "tasks", icon: <FaTasks /> },
  { label: "Completed", link: "completed/completed", icon: <MdTaskAlt /> },
  { label: "In Progress", link: "in-progress/in progress", icon: <MdOutlinePendingActions /> },
  { label: "To Do", link: "todo/todo", icon: <MdOutlinePendingActions /> },
  { label: "Team", link: "team", icon: <FaUsers /> },
  { label: "Trash", link: "trashed", icon: <FaTrashAlt /> },
  { label: "Meet", link: "meet", icon: <IoIosVideocam /> },
  { label: "Chat", link: "chat", icon: <IoChatbubbleEllipsesSharp /> },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const path = location.pathname.split("/")[1];

  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 9);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => (
    <Link
      to={el.link}
      onClick={closeSidebar}
      className={clsx(
        "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-blue-100 text-base hover:bg-blue-800 transition duration-300",
        path === el.link.split("/")[0] &&
          "bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold"
      )}
    >
      {el.icon}
      <span className="hover:text-cyan-300">{el.label}</span>
    </Link>
  );

  return (
    <div className="w-full h-full flex flex-col gap-6 p-5 bg-blue-950">
      {/* Logo / Title */}
      <h1 className="flex gap-2 items-center">
        
        <span className="text-2xl font-bold text-blue-100">Zidio Task Manager</span>
      </h1>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col gap-y-5 py-8">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
