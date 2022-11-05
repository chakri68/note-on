import * as React from "react";
import { styled, keyframes } from "@stitches/react";
import { violet, blackA, mauve, slate, green } from "@radix-ui/colors";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { Button, Icon } from "semantic-ui-react";
import { createPortal } from "react-dom";
import Portal from "./ReactPortal";

const VIEWPORT_PADDING = 25;

const hide = keyframes({
  "0%": { opacity: 1 },
  "100%": { opacity: 0 },
});

const slideIn = keyframes({
  from: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
  to: { transform: "translateX(0)" },
});

const swipeOut = keyframes({
  from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
});

const StyledViewport = styled(ToastPrimitive.Viewport, {
  position: "fixed",
  bottom: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  padding: VIEWPORT_PADDING,
  gap: 10,
  width: 390,
  maxWidth: "100vw",
  margin: 0,
  listStyle: "none",
  zIndex: 2147483647,
  outline: "none",
});

const StyledToast = styled(ToastPrimitive.Root, {
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  padding: 15,
  display: "grid",
  gridTemplateAreas: '"title action" "description action"',
  gridTemplateColumns: "auto max-content",
  columnGap: 15,
  alignItems: "center",

  "@media (prefers-reduced-motion: no-preference)": {
    '&[data-state="open"]': {
      animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    },
    '&[data-state="closed"]': {
      animation: `${hide} 100ms ease-in`,
    },
    '&[data-swipe="move"]': {
      transform: "translateX(var(--radix-toast-swipe-move-x))",
    },
    '&[data-swipe="cancel"]': {
      transform: "translateX(0)",
      transition: "transform 200ms ease-out",
    },
    '&[data-swipe="end"]': {
      animation: `${swipeOut} 100ms ease-out`,
    },
  },
});

const StyledTitle = styled(ToastPrimitive.Title, {
  gridArea: "title",
  marginBottom: 5,
  fontWeight: 500,
  color: slate.slate12,
  fontSize: 15,
});

const StyledDescription = styled(ToastPrimitive.Description, {
  gridArea: "description",
  margin: 0,
  color: slate.slate11,
  fontSize: 13,
  lineHeight: 1.3,
});

const StyledAction = styled(ToastPrimitive.Action, {
  gridArea: "action",
});

// Exports
export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = StyledViewport;
export const Toast = StyledToast;
export const ToastTitle = StyledTitle;
export const ToastDescription = StyledDescription;
export const ToastAction = StyledAction;
export const ToastClose = ToastPrimitive.Close;

// Your app...
const Box = styled("div", {});
const Notification = ({
  icon = false,
  labelPosition = "left",
  onTrigger = () => {},
  buttonText,
  callback = () => {},
  toast = {
    title: "TITLE",
    description: "DESCRIPTION",
    actionBtn: <Button>Action Btn</Button>,
  },
  duration = 5000,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  let [running, setRunning] = React.useState(false);
  const timerRef = React.useRef(0);
  const openRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  console.log({ toast });
  return (
    <>
      <Button
        {...props}
        icon={icon ? true : false}
        labelPosition={labelPosition}
        loading={running}
        onClick={async () => {
          setOpen(false);
          setRunning(true);
          await onTrigger();
          setRunning(false);
          window.clearTimeout(timerRef.current);
          window.clearTimeout(openRef.current);
          timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 100);
          openRef.current = window.setTimeout(() => {
            console.log("CALLBACK");
            callback();
          }, duration);
        }}
      >
        {icon}
        {buttonText}
      </Button>

      <Toast open={open} onOpenChange={setOpen} duration={duration}>
        <ToastTitle>{toast.title}</ToastTitle>
        <ToastDescription asChild>{toast.description}</ToastDescription>
        <ToastAction asChild altText="Undo the save">
          {toast.actionBtn}
        </ToastAction>
      </Toast>
      <Portal wrapperId="viewports">
        <ToastViewport />
      </Portal>
    </>
  );
};

export default Notification;
