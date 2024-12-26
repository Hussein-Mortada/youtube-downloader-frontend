import React from "react";
import "../App.css";

function DownloadButton({ handleDownload }) {
  return (
    <div className="download-button">
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}

export default DownloadButton;
