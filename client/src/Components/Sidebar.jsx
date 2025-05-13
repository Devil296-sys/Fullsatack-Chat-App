import React, { useEffect, useState } from "react";
import { useAuthStore } from "../Store/AuthStore";
import { Loader2, Menu } from "lucide-react";

const Sidebar = () => {
  const {
    Friends,
    FetchFriends,
    SearchingFriends,
    SelectedUser,
    setSelectedUser,
    onlineUsers,
    deleteFriend,
  } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    FetchFriends();
  }, []);

  if (SearchingFriends) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <div className="sm:hidden fixed top-3/4 left-3/4 inset-0 flex items-center justify-center z-50 pointer-events-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-base-200 p-4 shadow-lg pointer-events-auto"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:static z-40 bg-base-300 h-screen w-64 sm:w-1/5 p-4 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">All Users</h2>
        <div className="space-y-2 overflow-y-auto max-h-[85vh] pr-2 relative">
          {Friends && Friends.length > 0 ? (
            Friends.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setIsOpen(false);
                }}
                className={`flex items-center p-2 w-full relative ${
                  SelectedUser?._id === user._id ? "bg-base-100" : ""
                } rounded-lg bg-base-100 hover:bg-gray-300 dark:hover:bg-base-200 group`}
              >
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 top-2 left-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                )}
                <img
                  src={user.profilePic}
                  className="w-10 h-10 rounded-full"
                  alt={user.fullName}
                />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  {user.fullName}
                </span>
              </button>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No users found.</p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
