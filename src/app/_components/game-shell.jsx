"use client";

import { useEffect } from "react";
import { startGame } from "@/game/game";
import { PokemonDialogue } from "./pokemon-dialogue";
import { useDialogStore } from "./state";

export default function GameShell() {
  const showDialog = useDialogStore((s) => s.showDialog);

  useEffect(() => {
    const game = startGame();
    return () => game.stop();
  }, []);
  return (
    <div className="container mx-auto flex justify-center items-center flex-col h-screen">
      <h1 className="text-xl text-white">
        Welcome to my game in a react shell
      </h1>
      <div className="relative max-w-sm lg:max-w-screen-lg h-[600px]">
        <canvas id="game" />
        {showDialog ? (
          <div className="absolute bottom-0 lg:bottom-2 w-full h-[30%] lg:px-16">
            <DialogBox />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DialogBox() {
  const texts = useDialogStore((s) => s.texts);
  const houseId = useDialogStore((s) => s.houseId);
  const closeDialog = useDialogStore((s) => s.closeDialog);
  function handleComplete() {
    alert(`navigate to ${houseId}`);
    closeDialog();
  }
  return <PokemonDialogue messages={texts} onComplete={handleComplete} />;
}
