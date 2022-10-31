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
  ...props
}) {
  const quillEditor = useRef(null);

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
  return <div {...props} className={`editorWrapper ${className}`}></div>;
}
