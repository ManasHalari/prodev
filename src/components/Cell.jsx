
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

case "select": {
  let selectedOption = column.options.find(opt => opt.id === value);

  return (
    <div className="select-wrapper">
      <select
        className="input"
        value={value || ""}
        onChange={e => onChange(e.target.value || null)}
      >
        <option value="">Select</option>
        {column.options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>

      {value && selectedOption && (
        <div className="chip-container mt-2">
          <div className="chip">
            {selectedOption.label}
            <span
              className="chip-close"
              onClick={e => {
                e.stopPropagation();
                onChange(() => {
                  selectedOption = null;
                });
              }}
            >
              ×
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

case "multi-select": {
  const selectedValues = value || [];

  return (
    <div className="select-wrapper">
      <select
        className="input"
        onChange={e => {
          const selected = column.options.find(
            opt => opt.id === e.target.value
          );
          if (selected && !selectedValues.some(v => v.id === selected.id)) {
            onChange([...selectedValues, selected]);
          }
        }}
      >
        <option value="">Add item</option>
        {column.options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>

      {selectedValues.length > 0 && (
        <div className="chip-container mt-2">
          {selectedValues.map(item => (
            <div key={item.id} className="chip">
              {item.label}
              <span
                className="chip-close"
                onClick={() =>
                  onChange(selectedValues.filter(v => v.id !== item.id))
                }
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


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
