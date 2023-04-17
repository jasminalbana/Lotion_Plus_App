import { useEffect, useState } from "react";
import { useOutletContext, useParams, Link } from "react-router-dom";
import { currentDate } from "./utils";
import ReactQuill from "react-quill";
import Empty from "./EmptyLotion";
import FormattedDate from "./FormattedDate";
import "react-quill/dist/quill.snow.css";

function Create({ edit }) {
  const { noteId } = useParams();
  const [notes, updateNote, deleteNote] = useOutletContext();
  const [noteBody, setNoteBody] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteWhen, setNoteWhen] = useState(currentDate());
  const [id, setId] = useState(null);

  useEffect(() => {
    const currentNote = noteId ? notes[parseInt(noteId) - 1] : null;
    if (currentNote) {
      setNoteBody(currentNote.body);
      setNoteTitle(currentNote.title);
      setNoteWhen(currentNote.when || currentDate());
      setId(currentNote.id);
    }
  }, [noteId, notes]);

  const save = () => {
    updateNote({ body: noteBody, title: noteTitle, when: noteWhen, id }, noteId);
  };

  const tryDelete = () => {
    if (window.confirm("Are you sure?")) {
      deleteNote(id, noteId);
    }
  };

  if (!id) {
    return <Empty />;
  }

  return (
    <>
      <header>
        <div id="note-info">
          {edit ? (
            <>
              <input
                className="note-title"
                value={noteTitle}
                onChange={(event) => setNoteTitle(event.target.value)}
                autoFocus
              />
              <input
                type="datetime-local"
                value={noteWhen}
                onChange={(event) => setNoteWhen(event.target.value)}
              />
            </>
          ) : (
            <>
              <h2 className="note-title">{noteTitle}</h2>
              <FormattedDate date={noteWhen} />
            </>
          )}
        </div>
        <div id="note-controls">
          <Link
            className="button"
            id="edit-button"
            to={`/notes/${noteId}/edit`}
            hidden={edit}
          >
            Edit
          </Link>
          <Link
            className="button"
            id="save-button"
            to=""
            onClick={save}
            hidden={!edit}
          >
            Save
          </Link>
          <Link
            className="button"
            id="delete-button"
            to=""
            onClick={tryDelete}
          >
            Delete
          </Link>
        </div>
      </header>
      {edit ? (
        <ReactQuill
          placeholder="Your Note Here"
          theme="snow"
          value={noteBody}
          onChange={setNoteBody}
        />
      ) : (
        <div
          id="note-content"
          dangerouslySetInnerHTML={{ __html: noteBody }}
        />
      )}
    </>
  );
}

export default Create;
