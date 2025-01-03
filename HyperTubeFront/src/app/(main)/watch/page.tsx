import Link from "next/link";

export default function Home() {
  const torrentHash = "7D2E222138AEF25FFE38577E4CB9AD04E7D30356";
  const movieName = "Oppenheimer";
  const trackers = [
    "udp://open.demonii.com:1337/announce",
    "udp://tracker.openbittorrent.com:80",
    "udp://tracker.coppersurfer.tk:6969",
    "udp://glotorrents.pw:6969/announce",
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://torrent.gresille.org:80/announce",
    "udp://p4p.arenabg.com:1337",
    "udp://tracker.leechers-paradise.org:6969",
  ];
  const magnetLink = constructMagnetLink(torrentHash, movieName, trackers);
  console.log("Magnet Link:", magnetLink);
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Link href={`/watch/${magnetLink}`}>click to Watch</Link>
    </div>
  );
}
