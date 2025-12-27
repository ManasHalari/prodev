import { useState, useEffect } from "react";
import Cell from "./components/Cell";

const API_BASE_URL = "http://localhost:8080/api"; 

const typeLabels = {
  text: "Text",
  email: "Email",
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
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [showNewTableForm, setShowNewTableForm] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTableId) {
      fetchColumns(selectedTableId);
      fetchRows(selectedTableId);
    }
  }, [selectedTableId]);

  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/table`);
      const data = await response.json();
      setTables(data);
      if (data.length > 0 && !selectedTableId) {
        setSelectedTableId(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const createTable = async () => {
    if (!newTableName.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/table`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTableName }),
      });
      const newTable = await response.json();
      setTables(prev => [newTable, ...prev]);
      setSelectedTableId(newTable._id);
      setNewTableName("");
      setShowNewTableForm(false);
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  const fetchColumns = async (tableId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/column/table/${tableId}`);
      const data = await response.json();
      setColumns(data);
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  const fetchRows = async (tableId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/row/table/${tableId}`);
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error("Error fetching rows:", error);
    }
  };

  const addColumn = async (columnData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/column`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: selectedTableId,
          name: columnData.name,
          type: columnData.type,
          options: columnData.options || [],
          order: columns.length,
        }),
      });
      const newColumn = await response.json();
      setColumns(prev => [...prev, newColumn]);
      setOpen(false);
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const addRow = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/row`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: selectedTableId,
          cells: {},
        }),
      });
      const newRow = await response.json();
      setRows(prev => [...prev, newRow]);
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };

  const updateCell = async (rowId, colId, value) => {
    const currentRow = rows.find(r => r._id === rowId);
    if (!currentRow) return;

    // Update local state immediately for better UX
    const updatedCells = { ...currentRow.cells, [colId]: value };
    setRows(rows =>
      rows.map(row =>
        row._id === rowId
          ? { ...row, cells: updatedCells }
          : row
      )
    );

    try {
      await fetch(`${API_BASE_URL}/row/${rowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cells: updatedCells }),
      });
    } catch (error) {
      console.error("Error updating cell:", error);
    }
  };

  const deleteRow = async (rowId) => {
    setRows(prev => prev.filter(r => r._id !== rowId));
    
    try {
      await fetch(`${API_BASE_URL}/row/${rowId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const availableColumns = [
    { id: "text-col", name: "Text Column", type: "text" },
    { id: "email-col", name: "Email Column", type: "email" },
    { id: "date-col", name: "Date Column", type: "date" },
    { id: "status-col", name: "Status", type: "select", options: [
      { id: "todo", label: "To Do" },
      { id: "in-progress", label: "In Progress" },
      { id: "done", label: "Done" }
    ]},
    { id: "tags-col", name: "Tags", type: "multi-select", options: [
      { id: "urgent", label: "Urgent" },
      { id: "important", label: "Important" },
      { id: "low", label: "Low Priority" }
    ]},
    { id: "file-col", name: "Attachment", type: "file" },
  ];

  const remainingColumns = availableColumns.filter(
    col => !columns.some(c => c.name === col.name)
  );

  const grouped = groupColumnsByType(remainingColumns);

  const sectionOrder = ["text", "email", "date", "select", "multi-select", "file"];

  if (!selectedTableId) {
    return (
      <div className="container">
        <h2>No Tables Available</h2>
        <button className="btn btn-primary" onClick={() => setShowNewTableForm(true)}>
          Create New Table
        </button>
        {showNewTableForm && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Table name"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              className="input"
            />
            <button className="btn btn-primary" onClick={createTable}>
              Create
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="table-controls">
        <select
          value={selectedTableId}
          onChange={(e) => setSelectedTableId(e.target.value)}
          className="input table-select"
        >
          {tables.map(table => (
            <option key={table._id} value={table._id}>
              {table.name}
            </option>
          ))}
        </select>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowNewTableForm(!showNewTableForm)}
        >
          New Table
        </button>
      </div>

      {showNewTableForm && (
        <div className="form-group">
          <input
            type="text"
            placeholder="Table name"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            className="input"
          />
          <button className="btn btn-primary" onClick={createTable}>
            Create
          </button>
          <button 
            className="btn" 
            onClick={() => {
              setShowNewTableForm(false);
              setNewTableName("");
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <button className="btn btn-primary" onClick={addRow}>
        Add Row
      </button>

      <table className="table" border="1" cellPadding="8">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col._id}>{col.name}</th>
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
                            <div className="menu-section-title">
                              {typeLabels[type]}
                            </div>
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
            <tr key={row._id}>
              {columns.map(col => (
                <td key={col._id}>
                  <Cell
                    column={col}
                    value={row.cells[col._id]}
                    onChange={e =>
                      updateCell(
                        row._id,
                        col._id,
                        e.target?.value ?? e
                      )
                    }
                  />
                </td>
              ))}
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteRow(row._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}