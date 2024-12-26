import React from "react";
import "../App.css";

function VideoDetails({ videoDetails }) {
  return (
    <div className="video-details">
      <img src={videoDetails.thumbnail} alt={videoDetails.title} />
      <div className="details">
        <h3>{videoDetails.title}</h3>
      </div>
    </div>
  );
}

export default VideoDetails;
