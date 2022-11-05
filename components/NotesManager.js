import { useRef, useState } from "react";
import Note from "./Note";
import NotesToolbar from "./NotesToolbar";
import styles from "./NotesManager.module.css";
import { getFromStorage, storeToStorage } from "../public/scripts/Utils";

export default function NotesManager() {
  let [notes, setNotes] = useState([]);
  let noOfNotes = useRef(0);
  function addNote() {
    setNotes(notes.concat({ id: `note-${++noOfNotes.current}` }));
  }
  function deleteNote(id) {
    let newNotes = notes.filter(({ id: noteId }) => noteId != id);
    setNotes(newNotes);
  }
  function saveNote(editorContent, id) {
    let saveObj = getFromStorage("saveObj");
    if (!saveObj) {
      localStorage.setItem("saveObj", JSON.stringify({}));
      saveObj = {};
    }
    saveObj[id] = editorContent;
    console.log({ saveObj });
    storeToStorage("saveObj", saveObj);
  }
  return (
    <div className={`notes-manager ${styles.notesManager}`}>
      <NotesToolbar handleAddNote={addNote} />
      {notes.map((note) => {
        return (
          <Note
            key={note.id}
            id={note.id}
            onDelete={deleteNote}
            onSave={saveNote}
          />
        );
      })}
    </div>
  );
}
