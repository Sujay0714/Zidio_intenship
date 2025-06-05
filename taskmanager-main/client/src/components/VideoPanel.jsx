// src/components/VideoPanel.js
import React, { useEffect, useRef } from "react";

const VideoPanel = ({ participants }) => {
  const videoRefs = useRef({});

  useEffect(() => {
    participants.forEach((participant) => {
      if (videoRefs.current[participant.id]) {
        // Assuming each participant has a video stream
        // Here you would link their stream to the video element
      }
    });
  }, [participants]);

  return (
    <div className="video-panel">
      {participants.map((participant) => (
        <div key={participant.id} className="video-container">
          <video
            ref={(el) => (videoRefs.current[participant.id] = el)}
            autoPlay
            playsInline
            className="participant-video"
          />
          <p>{participant.name}</p>
        </div>
      ))}
    </div>
  );
};

export default VideoPanel;
