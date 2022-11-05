import { styled } from "@stitches/react";
import Quill, { Delta } from "quill";
import { useEffect, useRef } from "react";

const CamoQuillWrapper = styled("div", {
  border: "none !important",
  ":focus": {
    border: "1px solid #ccc !important",
  },
});
const QuillWrapper = styled("div", {
  border: "1px solid #ccc !important",
});

export default function QuillEditor({
  toolbar = true,
  placeholder = "Type Something...",
  id,
  scrollContainer,
  theme = "snow",
  readOnly = false,
  className,
  camouflage = false,
  selector,
  onLoad,
  initDelta = {},
  ...props
}) {
  const quillEditor = useRef(null);

  useEffect(() => {
    if (quillEditor.current == null) {
      quillEditor.current = new Quill(selector, {
        readOnly: readOnly,
        placeholder: placeholder,
        theme: theme,
        modules: {
          toolbar: toolbar,
        },
      });
      if (initDelta) quillEditor.current.setContents(initDelta);
      onLoad(quillEditor.current);
    }
  }, [placeholder, readOnly, selector, theme, toolbar]);
  return camouflage ? (
    <CamoQuillWrapper
      id={id}
      {...props}
      className={`editorWrapper ${className}`}
    />
  ) : (
    <QuillWrapper id={id} {...props} className={`editorWrapper ${className}`} />
  );
}
