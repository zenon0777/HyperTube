"use client";
import React, { useRef, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [quality, setQuality] = useState('720p');

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuality(event.target.value);
    if (videoRef.current) {
      // Logic to change video quality goes here
      // For example, you might load a different video URL based on the selected quality
      // This example assumes you have different URLs for different qualities
      const currentTime = videoRef.current.currentTime;
      const isPlaying = !videoRef.current.paused;
      videoRef.current.src = getVideoUrlForQuality(event.target.value);
      videoRef.current.currentTime = currentTime;
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  };

  const getVideoUrlForQuality = (quality: string) => {
    // Replace this with your logic to get the correct video URL for the selected quality
    if (quality === '1080p') {
      return videoUrl.replace('720p', '1080p');
    }
    return videoUrl;
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <video ref={videoRef} controls className="w-full h-auto rounded-lg shadow-lg">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-2 right-2 flex items-center">
        <label htmlFor="quality-selector" className="mr-2 text-white">Quality:</label>
        <select
          id="quality-selector"
          value={quality}
          onChange={handleQualityChange}
          className="bg-gray-800 text-white p-1 rounded"
        >
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </select>
      </div>
    </div>
  );
};

export default VideoPlayer;