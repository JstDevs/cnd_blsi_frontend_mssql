import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { logout } from "../../features/auth/authSlice";

function Header({ toggleSidebar, isSidebarOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  useEffect(() => {
    if (!showNotifications) return;
    function handleClickOutside(event) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-sm z-10 relative">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={toggleSidebar}
              >
                <span className="sr-only">
                  {isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                </span>
                {isSidebarOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="text-xl font-semibold text-neutral-900">
                {/* Dynamic page title could go here */}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-error-600 ring-2 ring-white"></span>
            </button>

            <div className="ml-3 relative">
              <Menu as="div" className="relative">
                <Menu.Button className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white">
                    {user?.firstName?.charAt(0) || ""}
                    {user?.lastName?.charAt(0) || ""}
                  </div>
                </Menu.Button>

                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-neutral-100 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    {/* <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'
                            } flex items-center px-4 py-2 text-sm`}
                          >
                            <UserCircleIcon className="mr-3 h-5 w-5 text-neutral-400" aria-hidden="true" />
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/change-password"
                            className={`${
                              active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'
                            } flex items-center px-4 py-2 text-sm`}
                          >
                            <KeyIcon className="mr-3 h-5 w-5 text-neutral-400" aria-hidden="true" />
                            Change Password
                          </Link>
                        )}
                      </Menu.Item>
                    </div> */}
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active
                                ? "bg-neutral-100 text-neutral-900"
                                : "text-neutral-700"
                            } flex items-center px-4 py-2 text-sm w-full text-left`}
                          >
                            <ArrowRightOnRectangleIcon
                              className="mr-3 h-5 w-5 text-neutral-400"
                              aria-hidden="true"
                            />
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>

      {/* Notification panel */}
      {showNotifications && (
        <div
          ref={notificationsRef}
          className="absolute right-4 mt-2 w-80 sm:w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="p-4 border-b border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900">
              Notifications
            </h3>
          </div>
          <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
            <div className="p-4 hover:bg-neutral-50 cursor-pointer">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-900">
                    New ORS needs approval
                  </p>
                  <p className="text-sm text-neutral-500">
                    ORS-2024-01-0023 from IT Department
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    30 minutes ago
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-neutral-50 cursor-pointer">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
                    <CheckCircleIcon className="h-5 w-5 text-success-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-900">
                    DV approved
                  </p>
                  <p className="text-sm text-neutral-500">
                    DV-2024-01-0015 has been approved
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-2 border-t border-neutral-200 text-center">
            <button className="text-sm text-primary-600 hover:text-primary-800">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// Make the missing icon imports available
function DocumentTextIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

function CheckCircleIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default Header;
