import { useState } from "react";
import { initialColumns, initialRows } from "./models/schema";
import Cell from "./components/Cell";


export default function App() {
  const [columns] = useState(initialColumns);

  const [rows, setRows] = useState(initialRows);

  const updateCell = (rowId, colId, value) => {
    setRows(rows =>
      rows.map(row =>
        row.id === rowId
          ? { ...row, cells: { ...row.cells, [colId]: value } }
          : row
      )
    );
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
