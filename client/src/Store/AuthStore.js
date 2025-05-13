import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance"
import { io } from "socket.io-client";
const Base = import.meta.env.Mode === "development" ? "http://localhost:5000" : "/"
import {toast} from "react-hot-toast"
export const useAuthStore = create((set,get)=>({
    // Auth States
    Auth:null,
    isCheckingAuth:true,
    socket:null,
    isLogging:false,
    onlineUsers:[],
    isRegistering:false,
    isUpdatingProfile:false,
    theme:localStorage.getItem("Theme") || "light",
    // Messages States
    FetchedUsers:[],
    isLoadingUsers:false,
    Friends:[],
    SearchingFriends:false,
    isSendingRequest:false,
    Notifications:[],
    isSearchingNotifications:false,
    SelectedUser:null,
    isSendindMessages:false,
    receivedMessages: [],
    isLoadingMessages: false,
    checkAuth: async()=>{
        try {
            const res= await axiosInstance.get("/api/auth/user",{withCredentials:true})
            set({Auth:res.data})
            // console.log(res.data)
            get().onConnectSocket()
        } catch (error) {
            // console.log(error)
        }
        finally{
            set({isCheckingAuth:false})
        }
    },
    Login : async ( Data )=>{
        set({isLogging:true})
        try {
            const res= await axiosInstance.post("/api/auth/login",Data,{withCredentials:true})
            set({Auth:res.data})
            toast.success("Great, You are Logged In")
            get().onConnectSocket()
        } catch (error) {
            console.log(error)
            set({Auth:null})
            toast.error(error.response?.data?.message || "Login failed");        
        }
        finally{
            set({isLogging:false})
        }
    },
    Register : async ( Data )=>{
        set({isRegistering:true})
        try {
            const res= await axiosInstance.post("/api/auth/register",Data,{withCredentials:true})
            set({Auth:res.data})
            toast.success("Great, You have created your Account")
            get().onConnectSocket()
        } catch (error) {
            console.log(error)
            set({Auth:null})
            toast.error(error.response?.data?.message || "Register failed");        
        }
        finally{
            set({isRegistering:false})
        }
    },
    Logout:async ()=>{
        try {
        await axiosInstance.post("/api/auth/logout",{withCredentials:true})
        set({Auth:null})
        toast.success("Successfully Logged out")
        get().onDisconnectSocket()
        } catch (error) {
            console.log(error)
        }
    },
    UpdateProfile: async (Data)=>{
        set({isUpdatingProfile:true})
        try {
            const res =  await axiosInstance.post("/api/auth/update-profile",Data,{withCredentials:true})
            set({Auth:res.data})
        } catch (error) {
            console.log(error)
            set({Auth:null})
            toast.error(error.response?.data?.message || "Login failed"); 
        }finally{
            set({isUpdatingProfile:false})
        }
    },
    setTheme: (theme)=>{
        localStorage.setItem("Theme",theme)
        set({theme:theme})
    },
    // ------------------------------------------for Messages -----------------------------------------
    FetchUsers: async () => {
        set({ isLoadingUsers: true });
      
        try {
          const res = await axiosInstance.get("/api/messages/users", {
            withCredentials: true,
          });
          set({ FetchedUsers: res.data.users });
        //   console.log(res.data.users);
        } catch (error) {
          console.error("Failed to fetch users:", error);
        } finally {
          set({ isLoadingUsers: false });
        }
      },
      sendRequest: async (receiverId)=>{
        set({isSendingRequest:true})
        try {
            const res = await axiosInstance.post("/api/messages/send-request",{receiverId},{withCredentials:true})
            // console.log(res)
            toast.success(res.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Send request Error");
        }finally{
            set({isSendingRequest:false})
        }
      },
      SearchNotfification : async ()=>{
        set({isSearchingNotifications:true})
        try {
            const res = await axiosInstance.get("/api/messages/friend-requests",{withCredentials:true})
            
            set({Notifications:res.data.requests || [] })
        } catch (error) {
            console.log(error)
            
        }
        finally{
            set({isSearchingNotifications:false})
        }
      },
      AcceptFriendRequest: async (senderId)=>{
        try {
            await axiosInstance.post("/api/messages/accept-request",{senderId},{withCredentials:true})
            get().SearchNotfification()
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error in Accepting Request");
        }
      },
      FetchFriends : async()=>{
        set({SearchingFriends:true})
        try {
            const res = await axiosInstance.get("/api/messages/friends",{withCredentials:true})
            set({Friends:res.data.friends})

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error in Accepting Request");
        }finally{
            set({SearchingFriends:false})
        }
      },
      setSelectedUser: (SelectedUser)=>{set({SelectedUser:SelectedUser})},
      sendMessage: async (receiverId, text) => {
        set({ isSendindMessages: true });
        try {
          const res = await axiosInstance.post(
            "/api/messages/send-messages",
            { receiverId, text },
            { withCredentials: true }
          );
          const sentMessage = res.data;
          set((state) => ({
            receivedMessages: [...state.receivedMessages, sentMessage],
          }));
        } catch (error) {
          console.log(error);
        } finally {
          set({ isSendindMessages: false });
        }
      },
      receiveMessages: async (receiverId) => {
        set({ isLoadingMessages: true });
        try {
          const res = await axiosInstance.get(`/api/messages/receive-messages/${receiverId}`, {
            withCredentials: true,
          });
          set({ receivedMessages: res.data });
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          set({ isLoadingMessages: false });
        }
      },
      listeningMessages: () => {
        const { socket, SelectedUser, receivedMessages } = get();
        if (!socket || !SelectedUser) return;
        socket.on("newMessage", (newMessage) => {
          if (newMessage.sender === SelectedUser._id || newMessage.receiver === SelectedUser._id) {
            set({
              receivedMessages: [...get().receivedMessages, newMessage],
            });
          }
        });
      },
       // -----------------------------------------Socket Connections Function are held there------------------------------------------
    onConnectSocket:()=>{
      const {Auth} = get()
      if(!Auth || get().socket?.connected) return;
      const socket = io(Base,{
        query:{
          userId:Auth.userId
        }
      })

      socket.connect()
      set({socket:socket})
      socket.on("getOnlineUsers",(userIds)=>{
        set({onlineUsers:userIds})
      })
    },
    onDisconnectSocket:()=>{
      if(get().socket?.connnected) get().socket.disconnect()
    },
  ClearChats:async(receiverId)=>{
    try {
    await axiosInstance.post("/api/messages/delete-messages",{receiverId},{withCredentials:true})
    set({ receivedMessages: [] }); 
    get().receiveMessages(receiverId); 
    } catch (error) {
      console.log(error)
    }
  }

}))