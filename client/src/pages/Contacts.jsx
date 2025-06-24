import React, { useState, useEffect, useRef } from "react";
import api from "../axios";
import Peer from "peerjs";
import { getEcho, initializeEcho } from "../echo";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from '../components/NavBar';
import { 
  PhoneIcon, 
  PhoneXMarkIcon, 
  VideoCameraIcon, 
  MicrophoneIcon,
  SpeakerWaveIcon,
  UserIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const Contacts = () => {
  const [auth, setAuth] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState(""); // "connecting", "connected", "ended"
  
  const peer = useRef(null);
  const peerCall = useRef(null);
  const remoteVideo = useRef(null);
  const localVideo = useRef(null);
  const localStream = useRef(null);
  const callTimer = useRef(null);
  const navigate = useNavigate();

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start call timer
  const startCallTimer = () => {
    callTimer.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // Stop call timer
  const stopCallTimer = () => {
    if (callTimer.current) {
      clearInterval(callTimer.current);
      callTimer.current = null;
    }
    setCallDuration(0);
  };

  // Initialize Peer instance
  useEffect(() => {
    peer.current = new Peer({
      // Uncomment to use local PeerJS server
      // host: 'localhost',
      // port: 9000,
      // path: '/',
    });

    peer.current.on("open", (id) => {
      console.log("Peer ID:", id);
    });

    peer.current.on("call", (call) => {
      console.log("Received incoming call:", { caller: call.peer });
      peerCall.current = call;
      setCallStatus("connecting");

      navigator.mediaDevices
        .getUserMedia({ video: isVideoEnabled, audio: isAudioEnabled })
        .then((stream) => {
          console.log("Local stream obtained for answering call");
          localStream.current = stream;
          if (localVideo.current) localVideo.current.srcObject = stream;
          call.answer(stream);

          call.on("stream", (remoteStream) => {
            console.log("Received remote stream for incoming call");
            if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
            setCallStatus("connected");
            startCallTimer();
          });

          call.on("close", () => {
            console.log("Incoming call closed");
            endCall();
            toast.info("Call ended");
          });

          call.on("error", (err) => {
            console.error("PeerJS call error:", err);
            toast.error("Call error: " + err.message);
            setCallStatus("ended");
            endCall();
          });
        })
        .catch((err) => {
          console.error("Media devices error:", err);
          toast.error("Failed to access camera or microphone: " + err.message);
          setCallStatus("ended");
        });
    });

    peer.current.on("error", (err) => {
      console.error("PeerJS error:", err);
      toast.error("PeerJS error: " + err.message);
    });

    return () => {
      stopCallTimer();
      if (peerCall.current) peerCall.current.close();
      if (peer.current && !peer.current.destroyed) peer.current.destroy();
    };
  }, [isVideoEnabled, isAudioEnabled]);

  // Fetch user info and contacts
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const userResponse = await api.get("/api/auth/me");
        console.log("User API response:", userResponse.data);
        setAuth(userResponse.data.data); // Extract nested user object
        const contactsResponse = await api.get("/api/contacts");
        console.log("Contacts API response:", contactsResponse.data);
        setUsers(contactsResponse.data.data || []);
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to load data");
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to access contacts");
      navigate("/login");
      return;
    }

    fetchData();
  }, [navigate]);

  // Initialize Echo and listen for video call events
  useEffect(() => {
    if (!auth || !auth.id) {
      console.log("Skipping Echo initialization: auth or auth.id is missing", { auth });
      return;
    }

    let echoInstance;
    try {
      echoInstance = initializeEcho();
      console.log('Subscribing to channel:', `video-call.${auth.id}`);
      const channel = echoInstance.private(`video-call.${auth.id}`);

      channel.listen("RequestVideoCall", (e) => {
        console.log("Received RequestVideoCall event:", e);
        if (isCalling) {
          toast.info(`Incoming call from ${e.user.fromUser.name} ignored (already in call)`);
          return;
        }
        setSelectedUser(e.user.fromUser);
        setIsCalling(true);
        setCallStatus("connecting");
        toast.info(`Incoming call from ${e.user.fromUser.name}`);
      });

      channel.listen("RequestVideoCallStatus", (e) => {
        console.log("Received RequestVideoCallStatus event:", e);
        if (e.user.status === "accept") {
          createConnection(e);
          toast.success("Call accepted");
        } else if (e.user.status === "reject") {
          toast.info("Call rejected");
          endCall();
        }
      });

      return () => {
        echoInstance.leave(`video-call.${auth.id}`);
      };
    } catch (error) {
      console.error("Echo initialization error:", error.message);
      toast.error("Failed to initialize real-time connection");
    }
  }, [auth, isCalling]);

  // Initiate a call to selected user
  const callUser = async () => {
    if (!selectedUser) return toast.error("Please select a contact to call");

    try {
      setCallStatus("connecting");
      console.log("Initiating call to user:", selectedUser.id, "with Peer ID:", peer.current.id);
      await api.post(`/api/video-call/request/${selectedUser.id}`, {
        peerId: peer.current.id,
      });
      setIsCalling(true);
      await displayLocalVideo();
      toast.success("Call initiated");
    } catch (error) {
      console.error("Call error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to initiate call");
      setCallStatus("ended");
    }
  };

  // End the call and cleanup media streams
  const endCall = () => {
    console.log("Ending call");
    if (peerCall.current) {
      peerCall.current.close();
      peerCall.current = null;
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    if (remoteVideo.current) remoteVideo.current.srcObject = null;
    if (localVideo.current) localVideo.current.srcObject = null;

    stopCallTimer();
    setIsCalling(false);
    setCallStatus("");
  };

  // Access local media and display on video element
  const displayLocalVideo = async () => {
    try {
      console.log("Accessing local media for video display");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });
      localStream.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;
    } catch (err) {
      console.error("Media devices error in displayLocalVideo:", err);
      toast.error("Failed to access camera or microphone: " + err.message);
    }
  };

  // Create outgoing PeerJS call connection
  const createConnection = async (e) => {
    try {
      console.log("Creating connection with peer ID:", e.user.peerId);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });
      console.log("Local stream obtained for outgoing call");
      localStream.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;

      const call = peer.current.call(e.user.peerId, stream);
      peerCall.current = call;

      call.on("stream", (remoteStream) => {
        console.log("Received remote stream for outgoing call");
        if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
        setCallStatus("connected");
        startCallTimer();
      });

      call.on("close", () => {
        console.log("Outgoing call closed");
        endCall();
        toast.info("Call ended");
      });

      call.on("error", (err) => {
        console.error("Outgoing call error:", err);
        toast.error("Call error: " + err.message);
        setCallStatus("ended");
      });
    } catch (err) {
      console.error("Media devices error in createConnection:", err);
      toast.error("Failed to access camera or microphone: " + err.message);
      setCallStatus("ended");
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        console.log("Video toggled:", videoTrack.enabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        console.log("Audio toggled:", audioTrack.enabled);
      }
    }
  };

  // Test media access on component mount
  useEffect(() => {
    const testMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Media test successful, stream:", stream);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error("Media test failed:", err);
        toast.error("Media test failed: " + err.message);
      }
    };
    testMedia();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium text-slate-700">Loading contacts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <NavBar />
      
      <div className="flex h-screen pt-16 max-w-7xl mx-auto">
        {/* Contacts Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 shadow-lg flex flex-col">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-xl font-bold text-white mb-4">Contacts</h1>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <UserIcon className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                <p className="text-sm">No contacts found</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      user.id === selectedUser?.id
                        ? "bg-blue-50 border-2 border-blue-200 shadow-md"
                        : "hover:bg-slate-50 border-2 border-transparent"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                      user.id === selectedUser?.id ? "bg-blue-600" : "bg-slate-400"
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-semibold text-slate-800">{user.name}</div>
                      <div className="text-sm text-slate-500">Available</div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white">
          {!selectedUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <VideoCameraIcon className="h-20 w-20 mb-4 text-slate-300" />
              <h2 className="text-2xl font-semibold mb-2">Select a Contact</h2>
              <p className="text-sm">Choose someone from your contacts to start a video call</p>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-bold text-slate-800">{selectedUser.name}</h2>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          <span className="text-sm text-slate-600">
                            {callStatus === "connected" ? `Connected • ${formatDuration(callDuration)}` : 
                             callStatus === "connecting" ? "Connecting..." : "Available"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {!isCalling ? (
                      <button
                        onClick={callUser}
                        className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        Start Call
                      </button>
                    ) : (
                      <button
                        onClick={endCall}
                        className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <PhoneXMarkIcon className="h-5 w-5 mr-2" />
                        End Call
                      </button>
                    )}
                    <button className="p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative bg-slate-900 overflow-hidden">
                {isCalling ? (
                  <>
                    <video
                      ref={remoteVideo}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 right-6 w-64 h-48 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                      <video
                        ref={localVideo}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {!isVideoEnabled && (
                        <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-2">
                              {auth?.name?.charAt(0).toUpperCase() || "Y"}
                            </div>
                            <div className="text-sm">Camera Off</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-lg rounded-2xl p-4">
                        <button
                          onClick={toggleAudio}
                          className={`p-4 rounded-full transition-all duration-200 ${
                            isAudioEnabled 
                              ? "bg-slate-700 hover:bg-slate-600 text-white" 
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          <MicrophoneIcon className="h-6 w-6" />
                        </button>
                        <button
                          onClick={toggleVideo}
                          className={`p-4 rounded-full transition-all duration-200 ${
                            isVideoEnabled 
                              ? "bg-slate-700 hover:bg-slate-600 text-white" 
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          <VideoCameraIcon className="h-6 w-6" />
                        </button>
                        <button
                          onClick={endCall}
                          className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200"
                        >
                          <PhoneXMarkIcon className="h-6 w-6" />
                        </button>
                        <button className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-all duration-200">
                          <SpeakerWaveIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                    {callStatus === "connecting" && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <div className="text-lg font-semibold text-slate-800">Connecting...</div>
                          <div className="text-sm text-slate-600 mt-2">Please wait while we establish the connection</div>
                          <div className="mt-4 flex space-x-4 justify-center">
                            <button
                              onClick={async () => {
                                try {
                                  await api.post(`/api/video-call/status/${selectedUser.id}`, {
                                    peerId: peer.current.id,
                                    status: "accept",
                                  });
                                  toast.success("Call accepted");
                                } catch (error) {
                                  console.error("Accept call error:", error);
                                  toast.error("Failed to accept call");
                                }
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg"
                            >
                              Accept
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await api.post(`/api/video-call/status/${selectedUser.id}`, {
                                    peerId: peer.current.id,
                                    status: "reject",
                                  });
                                  endCall();
                                  toast.info("Call rejected");
                                } catch (error) {
                                  console.error("Reject call error:", error);
                                  toast.error("Failed to reject call");
                                }
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-white">
                    <div className="text-center">
                      <VideoCameraIcon className="h-24 w-24 mx-auto mb-6 text-slate-400" />
                      <h3 className="text-2xl font-semibold mb-2">No active call</h3>
                      <p className="text-slate-400 mb-8">Click "Start Call" to begin a video call with {selectedUser.name}</p>
                      <button
                        onClick={callUser}
                        className="flex items-center mx-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <PhoneIcon className="h-6 w-6 mr-3" />
                        Start Video Call
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;