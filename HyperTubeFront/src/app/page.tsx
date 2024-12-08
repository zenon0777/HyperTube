import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <video width="320" height="240" controls>
          <source src="http://0.0.0.0:8000/stream/?torrent_url=https://yts.mx/torrent/download/2A6360525E22BB69DB38D3359CF7D9133081E778" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
    </div>
  );
}
