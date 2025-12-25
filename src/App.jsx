import { useState , useRef} from "react";
import { initialColumns, initialRows } from "./models/schema";
import Cell from "./components/Cell";

const typeLabels = {
  text: "Text",
  email: "Text",
  date: "Date",
  select: "Select",
  "multi-select": "Multi Select",
  file: "File",
};

function groupColumnsByType(columns) {
  return columns.reduce((acc, col) => {
    acc[col.type] = acc[col.type] || [];
    acc[col.type].push(col);
    return acc;
  }, {});
}


export default function App() {
  const [columns , setColumns] = useState(initialColumns.slice(0,2));
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  const updateCell = (rowId, colId, value) => {
    setRows(rows =>
      rows.map(row =>
        row.id === rowId
          ? { ...row, cells: { ...row.cells, [colId]: value } }
          : row
      )
    );
  };

  const remainingColumns = initialColumns.filter(
    col => !columns.some(c => c.id === col.id)
  );

  const grouped = groupColumnsByType(remainingColumns);

  const sectionOrder = [
      "text",
      "email",
      "date",
      "select",
      "multi-select",
      "file",
    ];

  const addColumn = col => {
    setColumns(prev => [...prev, col]);
    setOpen(false);
  };

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() =>
          setRows(prev => [
            ...prev,
            { id: Date.now(), cells: {} }
          ])
        }
      >
        Add Row
      </button>
    <table className="table" border="1" cellPadding="8">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.id}>{col.name}</th>
          ))}

          <th className="action-header">
            {remainingColumns.length > 0 && (
              <div className="notion-add">
                <button
                  className="header-plus"
                  onClick={() => setOpen(o => !o)}
                >
                  +
                </button>

                {open && (
                <div className="notion-menu">
                  {sectionOrder.map(type => {
                    const cols = grouped[type];
                    if (!cols) return null;

                    return (
                      <div key={type}>

                        {cols.map(col => (
                          <div
                            key={col.id}
                            className="menu-item"
                            onClick={() => addColumn(col)}
                          >
                            {col.name}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                )}
              </div>
            )}
            <span>Action</span>
          </th>
        </tr>
      </thead>

      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={col.id}>
                  <Cell
                    column={col}
                    value={row.cells[col.id]}
                    onChange={e =>
                          updateCell(
                            row.id,
                            col.id,
                            e.target?.value ?? e
                          )
                    }
                  />
              </td>
            ))}
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    setRows(prev =>
                      prev.filter(r => r.id !== row.id)
                    )
                  }
                >
                  Delete
                </button>
              </td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}
