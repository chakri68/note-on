import { useRef, useState } from "react";
import Note from "./Note";
import NotesToolbar from "./NotesToolbar";
import styles from "./NotesManager.module.css";

export default function NotesManager() {
  let [notes, setNotes] = useState([]);
  function addNote() {
    setNotes(notes.concat({ id: `note-${notes.length}` }));
  }
  return (
    <div className={`notes-manager ${styles.notesManager}`}>
      <NotesToolbar handleAddNote={addNote} />
      {notes.map((note) => {
        return <Note key={note.id} id={note.id} />;
      })}
    </div>
  );
}
