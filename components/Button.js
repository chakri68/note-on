import { styled } from "@stitches/react";
import { violet, blackA, mauve, whiteA } from "@radix-ui/colors";

const Button = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

export const StyledButton = styled(Button, {
  all: "unset",
  flex: "0 0 auto",
  color: whiteA.whiteA12,
  height: 25,
  padding: "0 5px",
  borderRadius: 4,
  display: "inline-flex",
  fontSize: 13,
  lineHeight: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingLeft: 10,
  paddingRight: 10,
  backgroundColor: violet.violet9,
  transition: "all 250ms",
  "&:hover": {
    color: whiteA.whiteA10,
    backgroundColor: violet.violet11,
    cursor: "pointer",
  },
  "&:focus": {
    position: "relative",
    boxShadow: `0 0 0 2px ${violet.violet7}`,
  },
});
