import React from "react";
import "../App.css";

function URLInput({ url, setUrl, fetchVideoDetails }) {
  return (
    <div className="url-input">
      <input
        type="text"
        placeholder="Paste YouTube URL here"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={fetchVideoDetails}>Fetch</button>
    </div>
  );
}

export default URLInput;
