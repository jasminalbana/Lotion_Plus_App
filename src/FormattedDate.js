const formatDate = (when) => new Date(when).toLocaleString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

const FormattedDate = ({ date }) => <p className="note-when">{formatDate(date)}</p>;

export default FormattedDate;
