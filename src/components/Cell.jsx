

export default function Cell({ column, value, onChange }) {
  switch (column.type) {

    case "email":
      return (
        <input
          type="email"
          className="input"
          value={value || ""}
          onChange={onChange}
        />
      );

    case "url":
      return (
        <input
          type="url"
          className="input"
          value={value || ""}
          onChange={onChange}
        />
      );

    case "date":
      return (
        <input
          type="date"
          className="input"
          value={value || ""}
          onChange={onChange}
        />
      );

    case "file":
      return (
        <input
          type="file"
          className="input"
          onChange={e => onChange(e.target.files[0])}
        />
      );

    default: 
      return (
        <input
          className="input"
          value={value || ""}
          onChange={onChange}
        />
      );
  }
}
