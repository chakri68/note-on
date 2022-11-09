import { useState, useRef, createRef } from "react";

export default function useNote() {
  let [noteIds, setNoteIds] = useState([]);
  let notesRef = useRef({});
  function getNoteNo(id) {
    let pattern = /note-(\d+)/;
    let res = pattern.exec(id)[1];
    if (res) {
      return parseInt(res);
    } else return null;
  }
  function addNote() {
    let lastNo =
      noteIds.length == 0 ? -1 : getNoteNo(noteIds[noteIds.length - 1]);
    // Update state
    notesRef.current[`note-${lastNo + 1}`] = createRef();
    // Rerender
    setNoteIds(noteIds.concat(`note-${lastNo + 1}`));

    console.log({ ref: notesRef.current });
  }
  function deleteNote(id) {
    // Update refs
    delete notesRef.current[id];
    // Rerender
    setNoteIds(noteIds.filter((noteId) => noteId != id));
  }
  function getAllNotes() {
    let notesState = {};
    Object.keys(notesRef.current).map((noteId) => {
      notesState[noteId] = notesRef.current[noteId].current.getState();
    });
    return notesState;
  }
  function getNote(id) {
    return notesRef.current[id].current.getState();
  }
  return {
    noteIds,
    setNoteIds,
    notesRef,
    addNote,
    deleteNote,
    getAllNotes,
    getNote,
  };
}
