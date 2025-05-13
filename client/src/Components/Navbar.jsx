import React from "react";
import { useAuthStore } from "../Store/AuthStore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { Logout, Auth, Notifications } = useAuthStore();
  const isAuthenticatedUser = !!Auth;

  return (
    <div
      className={`navbar bg-base-100 shadow-md ${
        Auth ? "relative" : "fixed"
      }  z-50 top-0 left-0 w-full px-4`}
    >
      <div className="flex-1">
        <a href="/" className="text-xl font-bold text-primary">
          {Auth?.profilePic ? (
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={Auth.profilePic} alt="Profile" />
              </div>
            </div>
          ) : (
            "Chat App"
          )}
        </a>
        <span className="ml-3 text-base-content text-sm sm:text-base">
          {Auth?.fullName || ""}
        </span>
      </div>

      <div className="flex-none space-x-2">
        {isAuthenticatedUser && (
          <>
            <button className="btn btn-outline btn-error" onClick={Logout}>
              Logout
            </button>
            <Link className="btn btn-outline" to="/notifications">
              Notifications
              <div>{Notifications.length}</div>
            </Link>
          </>
        )}
        <Link className="btn btn-primary" to="/settings">
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
