// TODO: Restrict the resizeability of the note
// TODO: Resizeable moveBar

import interact from "interactjs";
import React from "react";
import { useEffect, useRef, Suspense } from "react";
import { Card } from "semantic-ui-react";
import dynamic from "next/dynamic";
import { createStitches } from "@stitches/react";

const { styled, css } = createStitches({
  media: {
    bp1: "(max-width: 640px)",
    bp2: "(max-width: 768px)",
    bp3: "(max-width: 1024px)",
  },
});

const MoveDiv = styled("div", {
  width: "100%",
  position: "absolute",
  top: 0,
  "@bp3": {
    msTouchAction: "none",
    touchAction: "none",
  },
  ":active": {
    height: "100% !important",
    opacity: 1,
    zIndex: "1000",
  },
  ":hover": {
    height: "100% !important",
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
  "@bp3": {
    padding: "60px 10px 10px 10px !important",
    msTouchAction: "none",
    touchAction: "none",
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
      "@bp3": {
        height: "60px",
        msTouchAction: "none",
        touchAction: "none",
      },
      zIndex: "initial",
    },
  },
});

const DynamicEditor = dynamic(() => import("./QuillEditor"), {
  ssr: false,
});

const Note = React.memo(function MemoNote({ id }) {
  let resizeDivHeights = { noResize: 30, duringResize: 50 };

  const ResizeBtn = styled("div", {
    "&.resizeBtn.moreSpecific": {
      borderRadius: "50% !important",
      transform: "translate(50%, 50%)",
      height: resizeDivHeights.noResize + "px",
      aspectRatio: 1,
      position: "absolute",
      bottom: 0,
      right: 0,
      zIndex: 100,
      transition: "height 100ms",
      objectFit: "cover",
      objectPosition: "center",
    },
  });

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
    interactable.on("resizestart", (event) => {
      event.target.style.zIndex = "initial";
      document.querySelector(".resizeBtn.moreSpecific").style.height =
        resizeDivHeights.duringResize + "px";
    });
    interactable.on("resizeend", (event) => {
      event.target.style.zIndex = "initial";
      document.querySelector(".resizeBtn.moreSpecific").style.height =
        resizeDivHeights.noResize + "px";
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
            camouflage={true}
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
      <ResizeBtn tabIndex="0" className="resizeBtn moreSpecific">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path
            fill="#001A72"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            opacity="0.15"
          ></path>
          <path
            fill="#001A72"
            d="M14.47 10.53a.75.75 0 101.06-1.06l-1.06 1.06zM12 7l.53-.53a.75.75 0 00-1.06 0L12 7zM8.47 9.47a.75.75 0 101.06 1.06L8.47 9.47zm1.06 4a.75.75 0 00-1.06 1.06l1.06-1.06zM12 17l-.53.53a.75.75 0 001.06 0L12 17zm3.53-2.47a.75.75 0 10-1.06-1.06l1.06 1.06zm0-5.06l-3-3-1.06 1.06 3 3 1.06-1.06zm-4.06-3l-3 3 1.06 1.06 3-3-1.06-1.06zm-3 8.06l3 3 1.06-1.06-3-3-1.06 1.06zm4.06 3l3-3-1.06-1.06-3 3 1.06 1.06zM20.25 12A8.25 8.25 0 0112 20.25v1.5c5.385 0 9.75-4.365 9.75-9.75h-1.5zM12 20.25A8.25 8.25 0 013.75 12h-1.5c0 5.385 4.365 9.75 9.75 9.75v-1.5zM3.75 12A8.25 8.25 0 0112 3.75v-1.5c-5.385 0-9.75 4.365-9.75 9.75h1.5zM12 3.75A8.25 8.25 0 0120.25 12h1.5c0-5.385-4.365-9.75-9.75-9.75v1.5z"
          ></path>
        </svg>
      </ResizeBtn>
    </HoverCard>
  );
});

export default Note;
