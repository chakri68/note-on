import interact from "interactjs";
import React from "react";
import { useEffect, useRef, Suspense } from "react";
import { Card } from "semantic-ui-react";
import dynamic from "next/dynamic";
import { createStitches } from "@stitches/react";

export const { styled, css } = createStitches({
  media: {
    bp1: "(min-width: 640px)",
    bp2: "(min-width: 768px)",
    bp3: "(min-width: 1024px)",
  },
});

const MoveDiv = styled("div", {
  width: "100%",
  position: "absolute",
  top: 0,
  msTouchAction: "none",
  touchAction: "none",
  ":active": {
    height: "100%",
    opacity: 0,
    zIndex: "1000",
  },
  ":hover": {
    height: "100%",
    opacity: 0,
    zIndex: "1000",
  },
});

const HoverCard = styled(Card, {
  zIndex: "initial !important",
  position: "relative !important",
  padding: "20px 10px 10px 10px !important",
  display: "grid !important",
  gridTemplateRows: "max-content minmax(0, 1fr)",
  gap: "5px 0px",
  "@bp1": {
    msTouchAction: "none",
    touchAction: "none",
    padding: "60px 5px 10px 5px !important",
  },

  // "*": {
  //   msTouchAction: "none",
  //   touchAction: "none",
  // },
  ".content": {
    height: "100%",
    padding: "0 !important",
    display: "grid",
    gridTemplateRows: "max-content minmax(0, 1fr)",
    gap: "0px 0px",
  },
  ".moveBar": {
    backgroundColor: "violet",
    height: "100%",

    opacity: 0,
  },
  "&:focus-within": {
    zIndex: "999 !important",
    ".moveBar": {
      height: "20px",
      "@bp1": {
        height: "60px",
        msTouchAction: "none",
        touchAction: "none",
        padding: "60px 5px 10px 5px !important",
      },
      zIndex: "initial",
    },
  },
});

const DynamicEditor = dynamic(() => import("./QuillEditor"), {
  ssr: false,
});

const Note = React.memo(function MemoNote({ id }) {
  let noteElement = useRef();

  let position = { x: 0, y: 0 };

  useEffect(() => {
    let interactable = interact(`#${id}`)
      .draggable({
        preventDefault: "always",
        allowFrom: `.moveBar`,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
          }),
        ],
        inertia: true,
        listeners: {
          move(event) {
            event.target.style.zIndex = "999";
            position.x += event.dx;
            position.y += event.dy;
            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
        },
      })
      .resizable({
        edges: { top: false, left: true, bottom: true, right: true },
        listeners: {
          move: function (event) {
            let { x, y } = position;

            x = (parseFloat(x) || 0) + event.deltaRect.left;
            y = (parseFloat(y) || 0) + event.deltaRect.top;

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`,
            });

            Object.assign(position, { x, y });
          },
        },
      });
    interactable.on("dragend", (event) => {
      event.target.style.zIndex = "initial";
    });
  }, []);

  return (
    <HoverCard
      tabIndex="0"
      id={id}
      className="draggable note"
      ref={noteElement}
    >
      <MoveDiv className="moveBar"></MoveDiv>
      <Suspense fallback={`Loading...`}>
        <Card.Header>
          <DynamicEditor
            id={id}
            className="note-title"
            placeholder="Title"
            toolbar={false}
          />
        </Card.Header>
        <Card.Content>
          <DynamicEditor
            id={id}
            className="note-body scrolling-container"
            scrollContainer={`#${id}.scrolling-container`}
          />
        </Card.Content>
      </Suspense>
    </HoverCard>
  );
});

export default Note;
