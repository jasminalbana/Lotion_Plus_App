// import { useEffect, useRef, useState } from "react";
// import { Outlet, useNavigate, Link } from "react-router-dom";
// import List from "./List";
// import { v4 as uuidv4 } from "uuid";
// import { currentDate } from "./utils";


// function Layout({ logOut, profile, user }) {
//   const navigate = useNavigate();
//   const mainContainerRef = useRef(null);
//   const [collapse, setCollapse] = useState(false);
//   const [notes, setNotes] = useState([]);
//   const [editMode, setEditMode] = useState(false);
//   const [currentNote, setCurrentNote] = useState(-1);

//   useEffect(() => {
//     const height = mainContainerRef.current.offsetHeight;
//     mainContainerRef.current.style.maxHeight = `${height}px`;
//     setNotes([]);
    
//   }, []);
 
//   useEffect(() => {
//     if (currentNote < 0) {return;}
//     if (!editMode) {
//       navigate(`/notes/${currentNote + 1}`);
//       return;
//     }
//     navigate(`/notes/${currentNote + 1}/edit`);
//     // eslint-disable-next-line
//   }, [notes]);

//   const saveNote = async (note, index) => {
//     note.body = note.body.replaceAll("<p><br></p>", "");
//     setNotes([...notes.slice(0, index),{ ...note },...notes.slice(index + 1),]);
//     setCurrentNote(index);
//     setEditMode(false);

//     let url =`https://atsdpkbw4yxk5s4svqyk5ikzuu0qeclq.lambda-url.ca-central-1.on.aws/save?email=${profile.email}&id=${note.id}`
//     fetch(url,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",email: profile.email},
//         body: JSON.stringify({ ...note, email: profile.email }),
//       });
//   }

//   useEffect(() => {
//     const getNoteEffect = async () => {
//       if (profile.email) {
//         let url =`https://dkginyvellythm3sx7iuvaaxbe0cqqjv.lambda-url.ca-central-1.on.aws/get?email=${profile.email}`
//         const rev = await fetch(
//         url,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               email: profile.email,
//             },
//           }
//         );
//         const notes = await rev.json();
        
//         setNotes(notes);
//       }
//     };
//     getNoteEffect();
//   }, [profile.email]);

//   const deleteNote = async (id, index) => {

//     const rev = await fetch(
//       `https://rgs7rfgrcc344a2ehwan2yiyk40pvyrt.lambda-url.ca-central-1.on.aws/`,
//       {
//         mode: 'no-cors',
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           email: profile.email,
//         },
//         body: JSON.stringify({ email: profile.email, id: id }),
//       }
//     );
//     if (rev.status === 200) {
//       setNotes([...notes.slice(0, index), ...notes.slice(index + 1)]);
//       setCurrentNote(0);
//       setEditMode(false);
//     }
//     console.log(rev.status);
//   };

//   const addNote = () => {
//     setNotes([
//       {
//         id: uuidv4(),
//         title: "Untitled",
//         body: "",
//         when: currentDate(),
//       },
//       ...notes,
//     ]);
//     setEditMode(true);
//     setCurrentNote(0);
//   };

//   useEffect(() => {
//     localStorage.setItem("username", JSON.stringify(user));
//     // eslint-disable-next-line
//     localStorage.setItem("userProfile", JSON.stringify(profile));
//     // eslint-disable-next-line
//   }, [user]);

//   return (
//     <div>
//       <div id="container">
//         <header>
//           <aside>
//             <button id="menu-button" onClick={() => setCollapse(!collapse)}>
//               &#9776;
//             </button>
//           </aside>
//           <div id="app-header">
//             <h1>
//               <Link to="/notes">Lotion</Link>
//             </h1>
//             <h6 id="app-moto">Like Notion, but worse.</h6>
//           </div>
//           <aside>
//             <button onClick={logOut}>
//               <strong>{profile.name} (Log-out)</strong>
//             </button>
//           </aside>
//         </header>
//         <div id="main-container" ref={mainContainerRef}>
//           <aside id="sidebar" className={collapse ? "hidden" : null}>
//             <header>
//               <div id="notes-list-heading">
//                 <h2>Notes</h2>
//                 <button id="new-note-button" onClick={addNote}>
//                   +
//                 </button>
//               </div>
//             </header>
//             <div id="notes-holder">
//               <List notes={notes} />
//             </div>
//           </aside>
//           <div id="write-box">
//             <Outlet context={[notes, saveNote, deleteNote]} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Layout;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useOutletContext } from "./OutletContext";
import { currentDate } from "./utils";
import ReactQuill from "react-quill";
import EmptyLotion from "./EmptyLotion";
import FormattedDate from "./FormattedDate";
import "react-quill/dist/quill.snow.css";

function Create({ edit }) {
  const { noteId } = useParams();
  const parsedNoteId = noteId ? parseInt(noteId, 10) - 1 : undefined;
  const [notes, updateNote, deleteNote] = useOutletContext();
  const [currentNote, setCurrentNote] = useState({
    title: "",
    body: "",
    when: "",
  });
  const [noteBody, setNoteBody] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteWhen, setNoteWhen] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    if (parsedNoteId !== undefined && notes.length > parsedNoteId) {
      setCurrentNote(notes[parsedNoteId]);
    }
  }, [parsedNoteId, notes]);

  useEffect(() => {
    setNoteBody(currentNote.body);
    setNoteTitle(currentNote.title);
    setNoteWhen(currentNote.when || currentDate());
    setId(currentNote.id);
  }, [currentNote]);

  const save = () => {
    updateNote(
      {
        body: noteBody,
        title: noteTitle,
        when: noteWhen,
        id,
      },
      parsedNoteId
    );
  };

  const tryDelete = () => {
    const answer = window.confirm("Are you sure?");
    if (answer) {
      deleteNote(id, parsedNoteId);
    }
  };

  return id ? (
    <>
      <header>
        <div id="note-info">
          {!edit ? (
            <>
              <h2 className="note-title">{noteTitle}</h2>
              <FormattedDate date={noteWhen} />
            </>
          ) : (
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
          )}
        </div>
        <div id="note-controls">
          <Link
            className="button"
            id="edit-button"
            to={`/notes/${parsedNoteId + 1}/edit`}
          >
            Edit
          </Link>
          <button className="button" id="delete-button" onClick={tryDelete}>
            Delete
          </button>
          {edit && (
            <button className="button" id="save-button" onClick={save}>
              Save
            </button>
          )}
        </div>
      </header>
      {!edit ? (
        <div id="note-content" dangerouslySetInnerHTML={{ __html: noteBody }} />
      ) : (
        <ReactQuill
          placeholder="Your Note Here"
          theme="snow"
          value={noteBody}
          onChange={setNoteBody}
        />
      )}
    </>
  ) : (
    <EmptyLotion />
  );
}

export default Create;





