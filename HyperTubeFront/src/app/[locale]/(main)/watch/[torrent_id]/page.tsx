import axios from "axios";
import CustomReactPlayer from '@/components/Video/CustomReactPlayer';
import { fetchSubtitlesForMovie, extractMovieInfoFromName } from '@/api/subtitles/movieSubtitles';

const initStream = async (torrentHash: string, movieName: string) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/stream/init/`,
      {
        params: {
          torrent_hash: torrentHash,
          movie_name: movieName,
        },
      }
    );
    console.log("Stream init data:", data);
    return data.stream_id;
  } catch (error) {
    console.error("Error initializing stream:", error);
    return null;
  }
};

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; torrent_id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, torrent_id: torrentHash } = await params;
  const searchParamsData = await searchParams;
  const movieName = searchParamsData?.movieName as string || "Unknown Movie";

  if (!torrentHash) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black text-white">
        <p className="text-xl text-red-500">Error: Torrent ID is missing.</p>
      </div>
    );
  }

  // console.log(`Attempting to stream: Torrent Hash = ${torrentHash}, Movie Name = ${movieName}`);

  const streamId = await initStream(torrentHash, movieName);

  const movieInfo = extractMovieInfoFromName(movieName);
  const preferredLanguage = locale === 'fr' ? 'fr' : 'en';
  const tracks = await fetchSubtitlesForMovie(movieInfo, preferredLanguage);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black text-white">
      {streamId ? (
        <CustomReactPlayer 
          streamUrl={`http://localhost:8000/stream/?stream_id=${streamId}`}
          tracks={tracks}
          movieId={torrentHash}
        />
      ) : (
        <div className="text-center">
          <p className="text-xl text-red-500">Could not load stream.</p>
          <p className="text-md">Please check if the torrent is valid or try again later.</p>
          <p className="text-sm mt-4 text-gray-400">Details: Torrent Hash - {torrentHash}, Movie Name - {movieName}</p>
        </div>
      )}
    </div>
  );
}
