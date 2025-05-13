import React, { useEffect } from "react";
import { useAuthStore } from "../Store/AuthStore";
import { Loader2, Bell } from "lucide-react";

const Notifications = () => {
  const { isSearchingNotifications, Notifications, AcceptFriendRequest } =
    useAuthStore();

  // console.log(Notifications);
  return (
    <div className="p-4 min-h-screen bg-base-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5" /> Notifications
      </h2>

      {isSearchingNotifications ? (
        <div className="flex justify-center mt-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : Notifications.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No notifications found.
        </p>
      ) : (
        <div className="space-y-4">
          {Notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-base-200 w-[30%] p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex flex-row items-center">
                <img
                  src={notification.profilePic}
                  className="h-15 w-15 rounded-full"
                  alt=""
                />
                <p className="text-sm font-medium">{notification.fullName}</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  AcceptFriendRequest(notification._id);
                }}
              >
                Accept Request
              </button>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
