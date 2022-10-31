import React, { useEffect } from "react";
import interact from "interactjs";
import { styled } from "@stitches/react";
import { violet, blackA, mauve } from "@radix-ui/colors";
import {
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  FontBoldIcon,
  PlusIcon,
  FontItalicIcon,
} from "@radix-ui/react-icons";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import Link from "next/link";

const StyledToolbar = styled(ToolbarPrimitive.Root, {
  display: "flex",
  padding: 10,
  width: "100%",
  minWidth: "max-content",
  borderRadius: 6,
  backgroundColor: "white",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  maxWidth: "600px",
  position: "relative", // To ensure that Z-Index works
  zIndex: "999",
});

const itemStyles = {
  all: "unset",
  flex: "0 0 auto",
  color: mauve.mauve11,
  height: 25,
  padding: "0 5px",
  borderRadius: 4,
  display: "inline-flex",
  fontSize: 13,
  lineHeight: 1,
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: violet.violet3,
    color: violet.violet11,
    cursor: "pointer",
  },
  "&:focus": { position: "relative", boxShadow: `0 0 0 2px ${violet.violet7}` },
};

const StyledButton = styled(
  ToolbarPrimitive.Button,
  {
    ...itemStyles,
    paddingLeft: 10,
    paddingRight: 10,
    color: "white",
    backgroundColor: violet.violet9,
  },
  {
    "&:hover": {
      color: "white",
      backgroundColor: violet.violet10,
      cursor: "pointer",
    },
  }
);

const StyledLink = styled(
  ToolbarPrimitive.Link,
  {
    ...itemStyles,
    backgroundColor: "transparent",
    color: mauve.mauve11,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  },
  { "&:hover": { backgroundColor: "transparent", cursor: "pointer" } }
);

const StyledSeparator = styled(ToolbarPrimitive.Separator, {
  width: 1,
  backgroundColor: mauve.mauve6,
  margin: "0 10px",
});

const StyledToggleGroup = styled(ToolbarPrimitive.ToggleGroup, {
  display: "inline-flex",
  borderRadius: 4,
});

const StyledToggleItem = styled(ToolbarPrimitive.ToggleItem, {
  ...itemStyles,
  boxShadow: 0,
  backgroundColor: "white",
  marginLeft: 2,
  "&:first-child": { marginLeft: 0 },
  "&[data-state=on]": {
    backgroundColor: violet.violet5,
    color: violet.violet11,
  },
});

// Exports
export const Toolbar = StyledToolbar;
export const ToolbarButton = StyledButton;
export const ToolbarSeparator = StyledSeparator;
export const ToolbarLink = StyledLink;
export const ToolbarToggleGroup = StyledToggleGroup;
export const ToolbarToggleItem = StyledToggleItem;

const NotesToolbar = ({ handleAddNote }) => {
  let position = { x: 0, y: 0 };
  useEffect(() => {
    interact("#notes-toolbar").draggable({
      listeners: {
        move(event) {
          position.x += event.dx;
          position.y += event.dy;

          event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
        },
      },
    });
  }, []);
  return (
    <Toolbar aria-label="Notes Toolbar" id="notes-toolbar">
      <ToolbarButton aria-label="New Note" onClick={handleAddNote}>
        <PlusIcon />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton css={{ marginLeft: "auto" }}>
        <Link href="/help" style={{ color: "inherit" }}>
          Help
        </Link>
      </ToolbarButton>
    </Toolbar>
  );
};

export default NotesToolbar;
