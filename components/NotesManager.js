import { useEffect, useRef, useState } from "react";
import { Note } from "./Note";
import NotesToolbar from "./NotesToolbar";
import styles from "./NotesManager.module.css";
import { getFromStorage, storeToStorage } from "../public/scripts/Utils";

export default function NotesManager() {
  let [notes, setNotes] = useState([]);
  let saveObj = useRef(null);
  let noOfNotes = useRef(0);
  function checkSaveObjRef() {
    if (!saveObj.current) {
      saveObj.current =
        localStorage.setItem("saveObj", JSON.stringify({})) || {};
    }
  }
  function addNote() {
    setNotes(notes.concat({ id: `note-${noOfNotes.current++}` }));
  }
  function deleteNote(id) {
    checkSaveObjRef();
    let newNotes = notes.filter(({ id: noteId }) => noteId != id);
    setNotes(newNotes);
    delete saveObj.current[id];
    storeToStorage("saveObj", saveObj.current);
  }
  function saveNote(editorContent, id) {
    checkSaveObjRef();
    saveObj.current[id] = editorContent;
    storeToStorage("saveObj", saveObj.current);
  }
  useEffect(() => {
    // Restore if possible
    let newNotes = [];
    let newSaveObj = {};
    saveObj.current = getFromStorage("saveObj") || {};
    Object.keys(saveObj.current).map((noteId, ind) => {
      newSaveObj[`note-${ind}`] = saveObj.current[noteId];
      newNotes.push({ id: `note-${ind}`, state: saveObj.current[noteId] });
    });
    storeToStorage("saveObj", newSaveObj);
    saveObj.current = newSaveObj;
    setNotes(newNotes);
    noOfNotes.current = newNotes.length;
  }, []);
  return (
    <div className={`notes-manager ${styles.notesManager}`}>
      <NotesToolbar handleAddNote={addNote} />
      {notes.map((note) => {
        return (
          <Note
            initState={note?.state}
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
