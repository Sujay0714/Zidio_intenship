import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useRef } from "react";
import { IoClose } from "react-icons/io5";  // Import the Close icon
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../ui/SideBar";
import { setOpenSidebar } from "../../redux/slice/authSlice";

export const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      {/* Overlay */}
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-opacity duration-700"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-700"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          ref={mobileMenuRef}
          className={clsx(
            "md:hidden fixed inset-0 bg-black/40 transition-all duration-700",
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={closeSidebar} // close when clicked
        >
          {/* sidebar container to close*/}
          <div className="bg-white w-3/4 h-full">
            <div className="w-full flex justify-end px-5 mt-5">
              {/* Close Button */}
              <button
                onClick={closeSidebar}  // Close sidebar when clicked
                className="flex justify-end items-end"
              >
                <IoClose size={25} /> // close button
              </button>
            </div>

            <div className="-mt-10">
              <Sidebar />
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};
