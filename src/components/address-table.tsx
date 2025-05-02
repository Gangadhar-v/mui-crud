import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  addresses: any[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const AddressTable: React.FC<Props> = ({ addresses, onEdit, onDelete }) => {
  const rows = addresses.map((addr, index) => ({ id: index, ...addr }));

  const columns: GridColDef[] = [
    { field: "plotNumber", headerName: "Plot", width: 100 },
    { field: "cityName", headerName: "City", width: 130 },
    { field: "stateName", headerName: "State", width: 130 },
    { field: "postalCode", headerName: "Postal", width: 110 },
    { field: "country", headerName: "Country", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => onEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 2, height: 300, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        hideFooterPagination={rows.length <= 5}
      />
    </Box>
  );
};

export default AddressTable;
