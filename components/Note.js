// TODO: Restrict the resizeability of the note
// TODO: Resizeable moveBar

import interact from "interactjs";
import React from "react";
import { useEffect, useRef, Suspense } from "react";
import { Button, Card, Container } from "semantic-ui-react";
import dynamic from "next/dynamic";
import { createStitches } from "@stitches/react";
import Modal from "./Modal";

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

const Note = React.memo(function MemoNote({ id, onDelete }) {
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
      zIndex: 100,
      transition: "height 100ms",
      objectFit: "cover",
      objectPosition: "center",
    },
  });

  const DeleteBtn = styled("button", {
    "&.deleteBtn.moreSpecific": {
      borderRadius: "50% !important",
      transform: "translate(50%, -50%)",
      height: divHeights.deleteDivHeights.noDelete + "px",
      aspectRatio: 1,
      position: "absolute",
      top: 0,
      right: 0,
      zIndex: 100,
      transition: "height 100ms",
      objectFit: "cover",
      objectPosition: "center",
    },
    "&.deleteBtn.moreSpecific:hover": {
      height: divHeights.deleteDivHeights.duringDelete + "px",
    },
  });

  let noteElement = useRef();

  let position = { x: 0, y: 0 };

  function handleDelete() {
    onDelete(id);
  }

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
      <Modal
        openTrigger={
          <DeleteBtn tabIndex="0" className="deleteBtn moreSpecific">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0"
              y="0"
              enableBackground="new 0 0 512 512"
              version="1.1"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
            >
              <path
                fill="#CEE8FA"
                d="M104.923 191.732H407.086V496.256H104.923z"
              ></path>
              <g fill="#2D527C">
                <path d="M180.066 413.377c-8.69 0-15.738-7.047-15.738-15.738V296.918c0-8.69 7.047-15.738 15.738-15.738s15.738 7.047 15.738 15.738v100.721c-.001 8.69-7.048 15.738-15.738 15.738zM256 413.377c-8.69 0-15.738-7.047-15.738-15.738V296.918c0-8.69 7.047-15.738 15.738-15.738 8.69 0 15.738 7.047 15.738 15.738v100.721c0 8.69-7.048 15.738-15.738 15.738zM331.934 413.377c-8.69 0-15.738-7.047-15.738-15.738V296.918c0-8.69 7.047-15.738 15.738-15.738s15.738 7.047 15.738 15.738v100.721c0 8.69-7.047 15.738-15.738 15.738z"></path>
                <path d="M395.935 73.706c-8.69 0-15.738 7.047-15.738 15.738s7.047 15.738 15.738 15.738c18.295 0 33.18 14.885 33.18 33.18v37.64H82.886v-37.64c0-18.295 14.885-33.18 33.18-33.18h163.541c8.69 0 15.738-7.047 15.738-15.738s-7.047-15.738-15.738-15.738h-92.852v-42.23h138.492v57.968c0 8.69 7.047 15.738 15.738 15.738s15.738-7.047 15.738-15.738V15.738c0-8.69-7.047-15.738-15.738-15.738H171.017c-8.69 0-15.738 7.047-15.738 15.738v57.968h-39.214c-35.651 0-64.655 29.005-64.655 64.655v53.377c0 8.69 7.047 15.738 15.738 15.738h22.034v288.786c0 8.69 7.047 15.738 15.738 15.738h302.16c8.69 0 15.738-7.047 15.738-15.738V207.476h22.034c8.69 0 15.738-7.047 15.738-15.738v-53.377c0-35.651-29.005-64.655-64.655-64.655zm-4.593 406.819H120.658V207.476h270.685v273.049z"></path>
              </g>
            </svg>
          </DeleteBtn>
        }
        closeTrigger={<Button negative>delete</Button>}
        title="Are you sure?"
        body={<Container>Are you sure you want to delete the note?</Container>}
        onClick={handleDelete}
      />

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
