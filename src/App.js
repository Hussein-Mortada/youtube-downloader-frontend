import React, { useState } from "react";
import Header from "./components/Header";
import URLInput from "./components/URLInput";
import VideoDetails from "./components/VideoDetails";
import OptionsSelector from "./components/OptionsSelector";
import DownloadButton from "./components/DownloadButton";
import Spinner from "./components/Spinner";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  const [videoDetails, setVideoDetails] = useState(null); // Video details from backend
  const [url, setUrl] = useState(""); // User-input URL
  const [format, setFormat] = useState("mp3"); // Selected format (mp3/mp4)
  const [quality, setQuality] = useState(""); // Selected quality
  const [isLoading, setIsLoading] = useState(false); // Loading state


  const incrementDownloadCounter = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/incrementdownload`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(`Total downloads: ${data.downloads}`);
      } else {
        console.error("Failed to update download counter.");
      }
    } catch (error) {
      console.error("Error incrementing download counter:", error);
    }
  };

  // Fetch video details from backend
  const fetchVideoDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/fetch-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.ok) {
        setVideoDetails(data);
      } else {
        alert(data.error || "Failed to fetch video details.");
      }
    } catch (error) {
      console.error("Error fetching video details:", error);
      alert("Could not fetch video details.");
    }finally{
      setIsLoading(false);
    }
  };


  const sanitizeFilename = (filename) => {
    return filename.replace(/[<>:"/\\|?*]/g, '_'); // Replace invalid characters with an underscore
  };

  // Download handler
  const handleDownload = async () => {
    setIsLoading(true);
    const endpoint = format === "mp3" ? "downloadaudio" : "downloadvideo";
    const payload = {
      url,
      media_type: format === "mp3" ? "audio" : "video",
      ...(format === "mp3" ? { bitrate: quality } : { quality }),
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(response);
      if (response.ok) {
        // Log the Content-Disposition header
        incrementDownloadCounter();
        const contentDisposition = response.headers.get("Content-Disposition");
        console.log("Content-Disposition Header:", contentDisposition);
  
        const extractedFilename = sanitizeFilename(contentDisposition
          ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
          : `downloaded_file.${format}`);
        
        console.log("Extracted Filename:", extractedFilename);
        const decodedTitle = decodeURIComponent(extractedFilename);

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
  
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = decodedTitle || `downloaded_file.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        window.URL.revokeObjectURL(downloadUrl);
        alert(`Your file "${decodedTitle}" is downloading.`);
      } else {
        const error = await response.json();
        console.error("Error from backend:", error);
        alert(error.detail || "Failed to download the file.");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("An unexpected error occurred while downloading.");
    }finally{
      setIsLoading(false);
    }
  };
  

  return (
    <div className="app">
      {isLoading && <Spinner />} {/* Show spinner when loading */}
      <Header />
      <URLInput url={url} setUrl={setUrl} fetchVideoDetails={fetchVideoDetails} />
      {videoDetails && <VideoDetails videoDetails={videoDetails} />}
      {videoDetails && (
        <OptionsSelector format={format} setFormat={setFormat} quality={quality} setQuality={setQuality} />
      )}
      {videoDetails && <DownloadButton handleDownload={handleDownload} />}
      <Footer />
    </div>
  );
}

export default App;
