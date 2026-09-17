import { Fragment, type CSSProperties } from "react";

export function AnimatedWords({
  text,
  offset = 0,
}: {
  text: string;
  offset?: number;
}) {
  return text.split(" ").map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      {index > 0 && " "}
      <span
        className="motion-word"
        style={
          { "--word-delay": `${(index + offset) * 100}ms` } as CSSProperties
        }
      >
        {word}
      </span>
    </Fragment>
  ));
}
