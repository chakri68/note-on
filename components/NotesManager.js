import { useEffect, useRef, useState } from "react";
import { Note } from "./Note";
import NotesToolbar from "./NotesToolbar";
import styles from "./NotesManager.module.css";
import { getFromStorage, storeToStorage } from "../public/scripts/Utils";
import useNote from "./hooks/useNote";

export default function NotesManager({ signIn, signOut, authenticated }) {
  let {
    noteIds,
    setNoteIds,
    notesRef,
    addNote,
    deleteNote,
    getAllNotes,
    getNote,
  } = useNote();
  let saveObj = useRef(null);
  // function checkSaveObjRef() {
  //   if (!saveObj.current) {
  //     saveObj.current =
  //       localStorage.setItem("saveObj", JSON.stringify({})) || {};
  //   }
  // }
  function deleteNoteLocal(id) {
    // checkSaveObjRef();
    storeToStorage("saveObj", saveObj.current);
  }
  function saveNote(id, overrideState = null) {
    // checkSaveObjRef();
    if (overrideState != null) saveObj.current[id] = overrideState;
    else saveObj.current[id] = getNote(id);
    console.log({ saveObj: saveObj.current });
    storeToStorage("saveObj", saveObj.current);
  }
  useEffect(() => {
    // Restore if possible
    let newNotes = [];
    let newSaveObj = {};
    let newIdsRef = {};
    saveObj.current = getFromStorage("saveObj") || {};
    Object.keys(saveObj.current).map((noteId, ind) => {
      newSaveObj[`note-${ind}`] = saveObj.current[noteId];
      newIdsRef[`note-${ind}`] = {};
      newNotes.push(noteId);
    });
    storeToStorage("saveObj", newSaveObj);
    saveObj.current = newSaveObj;
    // Update RefsObj
    notesRef.current = newIdsRef;
    // Rerender
    setNoteIds(newNotes);
    console.log({ ls: saveObj.current, notesRef: notesRef.current });
  }, []);
  return (
    <div className={`notes-manager ${styles.notesManager}`}>
      <NotesToolbar
        handleAddNote={addNote}
        signIn={signIn}
        signOut={signOut}
        authenticated={authenticated}
      />
      {Object.keys(notesRef.current).map((noteId, ind) => {
        return (
          <Note
            initState={saveObj.current?.[noteId] || null}
            key={noteId}
            id={noteId}
            onDelete={deleteNoteLocal}
            onSave={saveNote}
            ref={notesRef.current[noteId]}
          />
        );
      })}
    </div>
  );
}
