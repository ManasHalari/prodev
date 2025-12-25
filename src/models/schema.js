export const initialColumns = [
  { id: "col_1", name: "Name", type: "text" },
  { id: "col_2", name: "Email", type: "email" },
  { id: "col_3", name: "date", type: "date" },
  { id: "col_4", name: "url", type: "url" },
  {
  id: "col_5",
  name: "File",
  type: "file",
},
  {
    id: "col_6",
    name: "Status",
    type: "select",
    options: [
      { id: "s1", label: "Todo" },
      { id: "s2", label: "In Progress" },
      { id: "s3", label: "Done" },
    ],
  },
  {
    id: "col_7",
    name: "Tags",
    type: "multi-select",
    options: [
      { id: "t1", label: "Frontend" },
      { id: "t2", label: "Backend" },
      { id: "t3", label: "UI" },
    ],
  }
];

export const initialRows = [
  {
    id: "row_1",
    cells: {
      col_1: "Alice",
      col_2: "alice@mail.com",
      col_5: { id: "s1", label: "Todo" },
      col_6: [{ id: "t1", label: "Frontend" }],
    }
  }
];
