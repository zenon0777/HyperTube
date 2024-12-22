import Link from "next/link";

export default function Home() {

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Link href={"/watch/2A6360525E22BB69DB38D3359CF7D9133081E778"}>
        click to Watch
      </Link>
    </div>
  );
}
