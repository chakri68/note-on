// TODO: Restrict the resizeability of the note
// TODO: Resizeable moveBar

import interact from "interactjs";
import React from "react";
import { useEffect, useRef, Suspense } from "react";
import { Card } from "semantic-ui-react";
import dynamic from "next/dynamic";
import { createStitches } from "@stitches/react";
import Modal from "./Modal";
import PopupMenu from "./PopupMenu";
import Notification from "./Toast";

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

const Note = React.memo(function MemoNote({ id, onDelete, onSave }) {
  let divHeights = {
    resizeDivHeights: { noResize: 30, duringResize: 50 },
    deleteDivHeights: { noDelete: 25, duringDelete: 30 },
  };

  const ResizeBtn = styled("div", {
    "&.resizeBtn.moreSpecific": {
      borderRadius: "50% !important",
      transform: "translate(50%, 50%)",
      height: divHeights.resizeDivHeights.noResize + "px",
      aspectRatio: 1,
      position: "absolute",
      bottom: 0,
      right: 0,
      zIndex: 2,
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
        divHeights.resizeDivHeights.duringResize + "px";
    });
    interactable.on("resizeend", (event) => {
      event.target.style.zIndex = "initial";
      document.querySelector(".resizeBtn.moreSpecific").style.height =
        divHeights.resizeDivHeights.noResize + "px";
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
