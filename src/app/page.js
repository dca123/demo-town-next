import dynamic from "next/dynamic";

const GameShell = dynamic(() => import("./_components/game-shell"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <GameShell />
    </div>
  );
}
