import { styled } from "@stitches/react";
import Quill from "quill";
import { useEffect, useRef } from "react";

export default function QuillEditor({
  toolbar = true,
  placeholder = "Type Something...",
  id,
  scrollContainer,
  theme = "snow",
  readOnly = false,
  className,
  camouflage = false,
  ...props
}) {
  const quillEditor = useRef(null);

  const CamoQuillWrapper = styled("div", {
    border: "none !important",
    ":focus": {
      border: "1px solid #ccc !important",
    },
  });
  const QuillWrapper = styled("div", {
    border: "1px solid #ccc !important",
  });

  useEffect(() => {
    if (quillEditor.current == null) {
      console.log("CREATED QUILL EDITOR");
      quillEditor.current = new Quill(`#${id} .${className.split(" ")[0]}`, {
        readOnly: readOnly,
        placeholder: placeholder,
        theme: theme,
        modules: {
          toolbar: toolbar,
        },
      });
    }
  }, []);
  return camouflage ? (
    <CamoQuillWrapper {...props} className={`editorWrapper ${className}`} />
  ) : (
    <QuillWrapper {...props} className={`editorWrapper ${className}`} />
  );
}
