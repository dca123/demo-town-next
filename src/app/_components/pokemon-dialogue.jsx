import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";

const TIMER = 30;

export function PokemonDialogue({ messages, onComplete }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSkipped, setIsSkipped] = useState(false);
  const timeoutsRef = useRef([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const loadMessage = useCallback(
    (message) => {
      setIsLoading(true);
      setCurrentMessage("");
      clearTimeouts();

      for (let i = 0; i < message.length; i++) {
        const timeout = window.setTimeout(() => {
          setCurrentMessage((prev) => prev + message[i]);
          if (i === message.length - 1) {
            setIsLoading(false);
          }
        }, TIMER * i);
        timeoutsRef.current.push(timeout);
      }
    },
    [clearTimeouts],
  );

  const nextMessage = useCallback(() => {
    if (isLoading || isSkipped) {
      setIsSkipped(false);
      return;
    }

    const nextIndex = messageIndex + 1;
    if (nextIndex < messages.length) {
      setMessageIndex(nextIndex);
      loadMessage(messages[nextIndex]);
    } else {
      onComplete();
    }
  }, [isLoading, isSkipped, messageIndex, messages, loadMessage, onComplete]);

  const handleClick = () => {
    if (isLoading) {
      clearTimeouts();
      setCurrentMessage(messages[messageIndex]);
      setIsLoading(false);
    } else {
      nextMessage();
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && isLoading && !isSkipped) {
      clearTimeouts();
      setCurrentMessage(messages[messageIndex]);
      setIsLoading(false);
      setIsSkipped(true);
    }
  };

  const handleKeyUp = (e) => {
    if ((e.key === "Enter" || e.key === " ") && !isLoading) {
      if (!isSkipped) {
        nextMessage();
      }
      setIsSkipped(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      loadMessage(messages[0]);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      clearTimeouts();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [messages, loadMessage, clearTimeouts]);

  const isTitle = messageIndex === 0 || messageIndex === messages.length - 1;

  return (
    <div
      className={`
          h-full relative p-4 bg-white border border-white rounded-sm
          shadow-[0_1px_0_1px_black,inset_0_1px_0_1px_black,0_0_0_1px_black,inset_0_0_0_1px_black]
          cursor-default select-none
          ${isTitle ? "text-center text-lg font-bold leading-[2.9em] underline" : "text-left text-lg font-normal "}
        `}
      style={{ fontFamily: '"Pokemon GB", Monospace, sans-serif' }}
      onClick={handleClick}
    >
      {currentMessage}
      {!isLoading && messageIndex < messages.length - 1 && (
        <ChevronDown className="absolute right-2 bottom-4 w-2.5 h-2.5 animate-bounce" />
      )}
    </div>
  );
}
