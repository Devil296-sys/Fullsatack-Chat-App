import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { useAuthStore } from "../Store/AuthStore";
import RecommendedUsers from "../Components/RecommendedUsers";
import ChatBoxUser from "../Components/ChatBoxUser";
const Dashboard = () => {
  const { SelectedUser, SearchNotfification } = useAuthStore();
  useEffect(() => {
    SearchNotfification();
  }, []);
  return (
    <div className="flex flex-row">
      <Sidebar />
      {SelectedUser ? <ChatBoxUser /> : <RecommendedUsers />}
    </div>
  );
};

export default Dashboard;
