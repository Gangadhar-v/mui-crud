import { useEffect, useState } from "react";
import { Box, Button, IconButton, TextField, Select, MenuItem, Typography, Collapse, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import debounce from "lodash.debounce"; 
import toast from "react-hot-toast";
import { EmployeeFormValues } from "../schema/form-schema";

const Home: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeFormValues[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeFormValues[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [filterExpanded, setFilterExpanded] = useState<boolean>(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get<EmployeeFormValues[]>("http://localhost:3000/employees");
      setEmployees(res.data);
      setFilteredEmployees(res.data);
      const uniqueOrgs = Array.from(new Set(res.data.map(emp => emp.organization)));
      setOrganizations(uniqueOrgs);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  const handleFilterToggle = () => {
    setFilterExpanded(prev => !prev);
    if (filterExpanded) {
      setFilteredEmployees(employees);
      setSelectedOrg("");
    }
  };

  const handleFilterChange = (org: string) => {
    setSelectedOrg(org);
    const filtered = employees.filter(emp => emp.organization === org);
    setFilteredEmployees(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/employees/${id}`);
      toast.success(`Employee ${id} deleted`);
      fetchEmployees();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete employee");
    }
  };

  const handleOverallDelete = async () => {
    console.log("Selected Employees for Deletion:", selectedEmployees);

    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee to delete");
      console.log("No employees selected for deletion.");
      return;
    }

    try {
      const deletePromises = selectedEmployees.map((id: string) =>
        axios.delete(`http://localhost:3000/employees/${id}`)
      );
      await Promise.all(deletePromises);
      toast.success("Selected employees deleted successfully");
      setSelectedEmployees([]);
      fetchEmployees();
    } catch (err) {
      console.error("Failed to delete employees:", err);
      toast.error("Failed to delete selected employees");
    }
  };

 
  const debouncedSearch = debounce((searchTerm: string) => {
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, 500); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    console.log("Selection model updated:", selectionModel);

    if (selectionModel && selectionModel.ids instanceof Set) {
      const selectedRows = Array.from(selectionModel.ids).map(id => id.toString());
      setSelectedEmployees(selectedRows);
      console.log("Selected employee IDs:", selectedRows);
    } else {
      setSelectedEmployees([]);
      console.log("Selection model is empty, clearing selected employees.");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "position", headerName: "Position", width: 150 },
    { field: "organization", headerName: "Organization", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`/employees/view/${params.row.id}`)} color="primary">
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => navigate(`/employees/edit/${params.row.id}`)} color="secondary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
   <h4>Employee Management </h4>
    <Box sx={{ p: 3 }}>
      <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchText}
          onChange={handleSearchChange}
          sx={{ width: 200, mr: 2 }}
        />
        <IconButton onClick={handleFilterToggle}>
          <FilterListIcon />
        </IconButton>

        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => navigate("/employees/add")}
        >
          <AddIcon />
        </Button>

        <Button
          variant="contained"
          sx={{ backgroundColor: 'red' }}
          onClick={handleOverallDelete}
        >
          <DeleteIcon />
        </Button>
      </Box>

      <Collapse in={filterExpanded}>
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1">Filter by Organization</Typography>
          <Select
            value={selectedOrg}
            displayEmpty
            onChange={(e) => handleFilterChange(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Organizations</MenuItem>
            {organizations.map((org) => (
              <MenuItem key={org} value={org}>
                {org}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Collapse>

      <Paper sx={{ height: 400, mt: 3 }}>
        <DataGrid
          sx={{
            width: '100%',
            minWidth: 800,
          }}
          rows={filteredEmployees.map(emp => ({ ...emp, id: emp.id }))}
          columns={columns.map(col => ({
            ...col,
            flex: 1,
            minWidth: 150,
          }))}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick={false}
          autoHeight={true}
          onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => handleRowSelection(newSelection)}
        />
      </Paper>
    </Box>
    </>
  );
};

export default Home;
