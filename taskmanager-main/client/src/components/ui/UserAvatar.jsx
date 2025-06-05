import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getInitials } from "../../utils/helper";
import { logout } from "../../redux/slice/authSlice";
import AddUser from "./AddUSer";

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      dispatch(logout());
      navigate("/login");
      toast.success("Successfully logged out!");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error?.data?.message || "Something went wrong during logout");
    }
  };

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition duration-300">
              <span className="text-white font-semibold">
                {getInitials(user?.name || "User")}
              </span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="p-4">
                <Menu.Item>
                  {() => (
                    <button
                      onClick={() => setOpen(true)}
                      className="text-blue-700 group flex w-full items-center rounded-md px-2 py-2 text-base hover:bg-blue-100"
                    >
                      <FaUser className="mr-2" aria-hidden="true" />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {() => (
                    <button
                      onClick={logoutHandler}
                      className="text-blue-600 group flex w-full items-center rounded-md px-2 py-2 text-base hover:bg-blue-100"
                    >
                      <IoLogOutOutline className="mr-2" aria-hidden="true" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddUser open={open} setOpen={setOpen} userData={user} />
    </>
  );
};

export default UserAvatar;
