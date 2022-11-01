import { useRef, useState } from "react";
import Note from "./Note";
import NotesToolbar from "./NotesToolbar";
import styles from "./NotesManager.module.css";

export default function NotesManager() {
  let objectsLength = useRef(0);
  let [notes, setNotes] = useState({});
  function addNote() {
    notes[`note-${++objectsLength.current}`] = {};
    setNotes({ ...notes });
  }
  function deleteNote(id) {
    delete notes[id];
    setNotes({ ...notes });
  }
  return (
    <div className={`notes-manager ${styles.notesManager}`}>
      <NotesToolbar handleAddNote={addNote} />
      {Object.keys(notes).map((noteId) => {
        return <Note key={noteId} id={noteId} onDelete={deleteNote} />;
      })}
    </div>
  );
}
