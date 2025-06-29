import CustomReactPlayer from '@/components/Video/CustomReactPlayer';
import { fetchSubtitlesForMovie, extractMovieInfoFromName } from '@/api/subtitles/movieSubtitles';
import api from "@/lib/axios";

// This function runs on the server
const initStream = async (torrentHash: string, movieName: string) => {
  try {
    // `api` will now correctly use http://backend:8000 inside Docker
    const { data } = await api.get(
      `${process.env.INTERNAL_BACKEND_URL}/stream/init/`, // No need for full URL, axios `baseURL` handles it
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

  const streamId = await initStream(torrentHash, movieName);

  const movieInfo = extractMovieInfoFromName(movieName);
  const preferredLanguage = locale === 'fr' ? 'fr' : 'en';
  const tracks = await fetchSubtitlesForMovie(movieInfo, preferredLanguage);

  // This URL is for the client (browser), so it must use the public URL
  const streamUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/?stream_id=${streamId}`;

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black text-white">
      {streamId ? (
        <CustomReactPlayer 
          // Use the dynamically generated streamUrl
          streamUrl={streamUrl} 
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