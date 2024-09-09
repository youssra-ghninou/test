import "./index.css";
import { useQuery } from "@tanstack/react-query";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

export default function App() {
  return (
    <div>
      <div style={{ display: "flex", gap: "50px", padding: "15px" }}>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          STANDARD
        </div>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "18px",
            fontWeight: "bold",
            textDecoration: "underline",
            textDecorationColor: "blue",
            color: "black",
          }}
        >
          ONLY RENOVATION
        </div>
      </div>

      <Data />
    </div>
  );
}

// Data component
function Data() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["data"],
    queryFn: fetchData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data?.rows}
        columns={data?.columns || []}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#000000",
            borderBottom: "1px solid black",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "#000",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid black",
            borderRight: "1px solid black",
          },
          "& .MuiDataGrid-row": {
            borderBottom: "1px solid black",
          },
        }}
      />{" "}
    </div>
  );
}

// Fetch data function
const fetchData = async () => {
  try {
    const response = await fetch(
      "https://66dd75fcf7bcc0bbdcde2a03.mockapi.io/view"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data: any = await response.json();

    const columns: GridColDef[] = [
      { field: "Area", headerName: "Area", width: 150 },
      ...data[0].headers.map((header: any) => ({
        field: header,
        headerName: header,
        width: 150,
        renderHeader: (params: any) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <span>{header}</span>
            <input
              type="text"
              placeholder={`Skriv for a sok ${header}`}
              style={{ marginTop: 4, width: "100%" }}
            />
          </div>
        ),
      })),
      { field: "Verdik", headerName: "Verdik", width: 150 },
    ];
    const rows: GridRowsProp = processRows(data);
    console.log(rows);

    return { rows, columns };
  } catch (error) {
    console.error("Error:", error);
    return { rows: [], columns: [] };
  }
};

// Process rows function
const processRows = (data: any) => {
  let idCounter = 0;

  return data.flatMap((item: any) => {
    return item.data.flatMap((innerItem: any) => {
      return innerItem.nodes.flatMap((node: any) => {
        return node.nodes.flatMap((nestedNode: any) => {
          return nestedNode.nodes.flatMap((secondNestedNode: any) => {
            return secondNestedNode.nodes.map((thirdNestedNode: any) => ({
              id: idCounter++,
              Area: innerItem.name,
              Organisation: node.value,
              "Organisation_(t)": node.secondColumn,
              Department: nestedNode.value,
              "Department_(t)": nestedNode.secondColumn,
              Project: secondNestedNode.value,
              Team: thirdNestedNode.value,
            }));
          });
        });
      });
    });
  });
};
