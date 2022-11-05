import { useRef, useState } from "react";
import Note from "./Note";
import NotesToolbar from "./NotesToolbar";
import styles from "./NotesManager.module.css";

export default function NotesManager() {
  let objectsLength = useRef(0);
  let [notes, setNotes] = useState([]);
  function addNote() {
    setNotes(notes.concat({ id: `note-${notes.length}` }));
  }
  function deleteNote(id) {
    let newNotes = notes.filter(({ id: noteId }) => noteId != id);
    setNotes(newNotes);
  }
  return (
    <div className={`notes-manager ${styles.notesManager}`}>
      <NotesToolbar
        handleAddNote={addNote}
        onDelete={(id) => console.log({ id })}
        onSave={(id) => {
          console.log({ id });
        }}
      />
      {notes.map((note) => {
        return <Note key={note.id} id={note.id} />;
      })}
    </div>
  );
}
