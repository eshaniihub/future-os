import { useEffect, useState } from "react";

export default function TypingEffect({
  text,
}) {
  const [displayedText, setDisplayedText] =
    useState("");

  useEffect(() => {
    let index = 0;

    setDisplayedText("");

    const interval = setInterval(() => {
      setDisplayedText(
        text.slice(0, index)
      );

      index++;

      if (index > text.length) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-lg md:text-xl leading-9 text-gray-200 whitespace-pre-line">

      {displayedText}

      <span className="animate-pulse text-cyan-400">
        |
      </span>

    </p>
  );
}