import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <video width="320" height="240" controls>
          <source src="http://0.0.0.0:8000/stream/?torrent_url=https://yts.mx/torrent/download/6C9124FE9A99B2001FAD76A76152691BC515A80D" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
    </div>
  );
}
