import React, { useEffect } from "react";
import { useAuthStore } from "../Store/AuthStore";
import { Loader2 } from "lucide-react";

const RecommendedUsers = () => {
  const { isLoadingUsers, FetchedUsers, FetchUsers, Auth, sendRequest } =
    useAuthStore();

  useEffect(() => {
    FetchUsers();
  }, []);

  if (isLoadingUsers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6  ">Recommended Users</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {FetchedUsers.map((user) => {
          const alreadySent = Auth?.sentRequests?.includes(user._id);
          return (
            <div
              key={user._id}
              className="card card-side bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <figure className="p-3">
                <div className="avatar">
                  <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user.profilePic} alt={user.fullName} />
                  </div>
                </div>
              </figure>
              <div className="card-body p-3">
                <h2 className="text-md font-bold text-gray-800 dark:text-white">
                  {user.fullName}
                </h2>
                {user.bio && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.bio}
                  </p>
                )}
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                <div className="mt-2">
                  <button
                    className="btn btn-xs btn-accent"
                    onClick={() => sendRequest(user._id)}
                    disabled={alreadySent}
                  >
                    {!alreadySent ? "Request Sent" : "Send Request"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedUsers;
