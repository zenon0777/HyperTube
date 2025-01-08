import axios from "axios";

const initStream = async (torrentHash: string, movieName: string) => {
  try {
    const { data } = await axios.get(
      `http://localhost:9000/stream/init/`,
      {
        params: {
          torrent_hash: torrentHash,
          movie_name: movieName,
        },
      }
    );
    console.log(data);
    return data.stream_id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default async function Home({
  params,
}: {
  params: Promise<{ torrent_id: string }>;
}) {
  const torrentId = (await params).torrent_id;

  // const torrentHash = "7D2E222138AEF25FFE38577E4CB9AD04E7D30356";
  // const movieName = "Oppenheimer (2023) [720p] [YTS.MX]";
  const torrentHash = "96DCE3AEFFF1F881BC4953C89E13B8C823EB5C5C";
  const movieName = "Gladiator II (2024) [720p] [WEBRip] [YTS.MX]";


  const streamId = await initStream(torrentHash, movieName);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {streamId ? (
        <video controls>
          <source
            src={`http://localhost:9000/stream/?stream_id=${streamId}`}
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
