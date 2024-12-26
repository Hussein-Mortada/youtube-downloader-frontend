import React from "react";
import "../App.css";

function OptionsSelector({ format, setFormat, quality, setQuality }) {
  const mp3Qualities = ["96kbps", "128kbps", "256kbps", "320kbps"];
  const mp4Qualities = ["144p", "260p", "480p", "720p", "1080p"];

  return (
    <div className="options-selector">
      <div className="format">
        <label>
          <input
            type="radio"
            name="format"
            value="mp3"
            checked={format === "mp3"}
            onChange={() => setFormat("mp3")}
          />
          MP3
        </label>
        <label>
          <input
            type="radio"
            name="format"
            value="mp4"
            checked={format === "mp4"}
            onChange={() => setFormat("mp4")}
          />
          MP4
        </label>
      </div>
      <div className="quality">
        <label>Quality:</label>
        <select value={quality} onChange={(e) => setQuality(e.target.value)}>
          {format === "mp3"
            ? mp3Qualities.map((q) => <option key={q}>{q}</option>)
            : mp4Qualities.map((q) => <option key={q}>{q}</option>)}
        </select>
      </div>
    </div>
  );
}

export default OptionsSelector;
