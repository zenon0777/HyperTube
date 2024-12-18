"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [streamId, setStreamId] = useState("");
  useEffect(() => {
    async function initStream() {
      const {data} = await axios.get("http://localhost:8000/stream/init/?torrent_url=https://yts.mx/torrent/download/2A6360525E22BB69DB38D3359CF7D9133081E778");
      console.log(data);
      setStreamId(data.stream_id);
    }
    !streamId && initStream();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {streamId ? (
        <video controls>
          <source
            src={`http://localhost:8000/stream/?stream_id=${streamId}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
