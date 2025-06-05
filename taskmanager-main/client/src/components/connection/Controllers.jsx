import React, { useEffect } from 'react'
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Monitor,
    MonitorOff,
  } from "lucide-react";

  import { useRoomContext } from '../../context/RoomContext';
  import {socket} from '../../utils/socket';

const Controllers = () => {
    const {
        userDetails,
        micOn,
        setMicOn,
        cameraOn,
        setCameraOn,
        screenSharing,
        setScreenSharing,
        localStream,
        setLocalStream,
      } = useRoomContext();

      const {roomId} = userDetails

      const toogleMic = () => {
        setMicOn((prev) => {
            const updated = !prev
            const audioTrack = localStream?.getAudioTracks()?.[0]
            if (audioTrack) {
                audioTrack.enabled = updated
            }
            socket.emit('toggle-mic', {roomId, isMicOn: updated})
            return updated
        })
      }

      const toggleCamera = () => {
        setCameraOn((prev) => {
          const updated = !prev;
          const videoTrack = localStream?.getVideoTracks()?.[0];
          if (videoTrack) {
            videoTrack.enabled = updated;
          }
          socket.emit("toggle-camera", { roomId, isCameraOn: updated });
          return updated;
        });
      };

      const toggleScreenShare = async () => {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          const track = stream.getTracks()[0];
    
          socket.emit("toggle-screen-share", { roomId, isSharing: true });
          setScreenSharing(true);
    
          setLocalStream(stream);
    
          track.onended = async () => {
            socket.emit("toggle-screen-share", { roomId, isSharing: false });
            setScreenSharing(false);
    
            try {
              const userMedia = await navigator.mediaDevices.getUserMedia({
                video: cameraOn,
                audio: micOn,
              });
              setLocalStream(userMedia);
            } catch (err) {
              console.error("Error restoring media after screen share:", err);
            }
          };
        } catch (error) {
          console.error("Screen share error:", error);
        }
      };

      useEffect(() => {
        socket.on("screen-share-toggled", ({ isSharing }) => {
          setScreenSharing(isSharing);
        });
    
        socket.on("mic-toggled", ({ isMicOn }) => setMicOn(isMicOn));
        socket.on("camera-toggled", ({ isCameraOn }) => setCameraOn(isCameraOn));
    
        return () => {
          socket.off("screen-share-toggled");
          socket.off("mic-toggled");
          socket.off("camera-toggled");
        };
      }, []);

  return (
    <div  className="flex justify-center gap-4 items-center p-4 bg-gray-900 text-white rounded-xl shadow-lg">
        <button
        onClick={toogleMic}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300"
        title={micOn ? "Turn Off Mic" : "Turn On Mic"}
      >
        {micOn ? (
          <Mic className="h-6 w-6 text-green-500" />
        ) : (
          <MicOff className="h-6 w-6 text-red-500" />
        )}
      </button>

      <button
        onClick={toggleCamera}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300"
        title={cameraOn ? "Turn Off Camera" : "Turn On Camera"}
      >
        {cameraOn ? (
          <Video className="h-6 w-6 text-green-500" />
        ) : (
          <VideoOff className="h-6 w-6 text-red-500" />
        )}
      </button>

      <button
        onClick={toggleScreenShare}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300"
        title={screenSharing ? "Stop Screen Sharing" : "Start Screen Sharing"}
      >
        {screenSharing ? (
          <Monitor className="h-6 w-6 text-yellow-500" />
        ) : (
          <MonitorOff className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  )
}

export default Controllers
