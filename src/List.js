import Item from "./Item";

function List({ notes }) {
  return notes.length > 0 ? (
    <ul>
      {notes.map((note, index) => (
        <Item note={note} index={index} key={`node-item-${index}`} />
      ))}
    </ul>
  ) : (
    <p id="no-note-yet">No Note Yet</p>
  );
}

export default List;