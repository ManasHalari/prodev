import { useState } from "react";
import { initialColumns, initialRows } from "./models/schema";

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
    <table border="1" cellPadding="8">
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
                <input
                  value={row.cells[col.id] || ""}
                  onChange={e =>
                    updateCell(row.id, col.id, e.target.value)
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
