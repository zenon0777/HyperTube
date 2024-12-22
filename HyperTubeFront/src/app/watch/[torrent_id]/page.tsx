import axios from "axios";

const initStream = async (magnetLink: string) => {
  try {
    const { data } = await axios.post(
      `http://localhost:8000/stream/init/`, 
      { magnet_url: magnetLink }
    );
    console.log(data);
    return data.stream_id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const constructMagnetLink = (
  torrentHash: string,
  movieName: string,
  trackers: string[]
): string => {
  const baseUrl = "magnet:?";
  const encodedMovieName = encodeURIComponent(movieName);
  const xtParam = `xt=urn:btih:${torrentHash}`;
  const dnParam = `dn=${encodedMovieName}`;
  const trParams = trackers
    .map((tracker) => `tr=${tracker}`)
    .join("&");
  const magnetLink = `${baseUrl}${xtParam}&${dnParam}&${trParams}`;
  return magnetLink;
};

export default async function Home({
  params,
}: {
  params: Promise<{ torrent_id: string }>;
}) {
  const torrentId = (await params).torrent_id;

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
  const streamId = await initStream(magnetLink);

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
        <p>NotFound...</p>
      )}
    </div>
  );
}
