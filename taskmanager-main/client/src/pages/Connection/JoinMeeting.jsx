import React, { useEffect, useState } from "react";
import { useRoomContext } from "../../context/RoomContext";
import Controllers from "../../components/connection/Controllers";

const JoinMeeting = () => {
  const {
    localVideoRef,
    remoteVideoRef,
    peer,
    localStream,
    setLocalStream,
    userDetails,
  } = useRoomContext();

  const [remoteUserJoined, setRemoteUserJoined] = useState(false);

  useEffect(() => {
    const initMedia = async () => {
      if (!localStream) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setLocalStream(stream);
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
          if (peer) peer.addStream(stream);
        } catch (err) {
          console.log("Error accessing media devices:", err);
        }
      } else {
        if (localVideoRef.current)
          localVideoRef.current.srcObject = localStream;
        if (peer) peer.addStream(localStream);
      }

      if (peer) {
        peer.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            setRemoteUserJoined(true);
          }
        });
      }
    };

    initMedia();
  }, [peer, localStream, setLocalStream, localVideoRef, remoteVideoRef]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center px-4 py-6">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-6 justify-center items-center bg-white/5 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/10">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full md:w-1/2 h-64 md:h-96 object-cover rounded-2xl border-2 border-white/10 shadow-inner"
        />

        {remoteUserJoined ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full md:w-1/2 h-64 md:h-96 object-cover rounded-2xl border-2 border-white/10 shadow-inner"
          />
        ) : (
          <div className="w-full md:w-1/2 h-64 md:h-96 flex items-center justify-center bg-black rounded-2xl border-2 border-white/10 shadow-inner">
            <div className="text-white text-center animate-pulse">
              <p className="text-lg font-medium">
                Waiting for another participant...
              </p>
              <div className="mt-2 flex justify-center">
                <span className="w-3 h-3 bg-white rounded-full animate-bounce mx-1 delay-0"></span>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce mx-1 delay-100"></span>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce mx-1 delay-200"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center gap-6 w-full px-4">
        <div className="w-full md:w-auto flex justify-center">
          <Controllers />
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-6 rounded-2xl shadow-lg w-full md:max-w-sm text-center">
          <h2 className="text-xl font-bold tracking-wide">
            {userDetails.name}
          </h2>
          <p className="text-sm text-gray-300 mt-1">{userDetails.email}</p>
        </div>
      </div>
    </div>
  );
};

export default JoinMeeting;
