import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Paper, Typography, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressFormValues, EmployeeFormValues, employeeSchema } from "../schema/form-schema";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import AddressDialog from "./address-dialog";


interface EmployeeFormProps {
  isEdit?: boolean;
  defaultValues?: EmployeeFormValues;
  onSuccess?: () => void;
}


const EmployeeForm: React.FC<EmployeeFormProps> = ({ isEdit = false, defaultValues, onSuccess }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    getValues,
   
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues || {
      id: "",
      name: "",
      age: 18,
      gender: "Male",
      position: "",
      organization: "",
      addresses: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "addresses",
  });

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [dialogAddress, setDialogAddress] = useState<AddressFormValues | null>(null);
  const [addressSearch, setAddressSearch] = useState<string>(""); 
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);


  const onSubmit: SubmitHandler<EmployeeFormValues> = async (data) => {
    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/employees/${data.id}`, data);
        toast.success("Employee updated successfully!");
      } else {
        await axios.post("http://localhost:3000/employees", data);
        toast.success("Employee created successfully!");
      }
      if (onSuccess) {
       
        onSuccess();
      }
    } catch (error) {
      toast.error("Error saving employee data!");
      console.error("Form submission failed:", error);
    }
  };


  const handleAddAddress = (e: React.MouseEvent) => {
    e.preventDefault(); 
    setEditingAddressIndex(null);
    setDialogAddress(null);
    setOpenDialog(true);
  };

  const handleEditAddress = (index: number) => {
    setEditingAddressIndex(index);
    setDialogAddress(fields[index]);
    setOpenDialog(true);
  };


  const handleSaveAddress = (address: AddressFormValues) => {
    if (editingAddressIndex !== null) {
    
      update(editingAddressIndex, address);
    } else {
    
      append(address);
    }

    
    setOpenDialog(false);
    setDialogAddress(null);
    setEditingAddressIndex(null);
  };


  const handleDeleteAddress = (index: number) => {
    remove(index);
  };

  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogAddress(null);
    setEditingAddressIndex(null);
  };


  const addressColumns: GridColDef[] = [
    { field: "plotNumber", headerName: "Plot No", width: 120 },
    { field: "cityName", headerName: "City", width: 150 },
    { field: "stateName", headerName: "State", width: 150 },
    { field: "postalCode", headerName: "Postal Code", width: 150 },
    { field: "country", headerName: "Country", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => {
        const index = fields.findIndex(field => field.id === params.row.id);
        return (
          <>
            <IconButton onClick={() => handleEditAddress(index)} color="primary" size="small">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteAddress(index)} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];


  const filteredAddresses = fields.filter((address) =>
    address.cityName.toLowerCase().includes(addressSearch.toLowerCase())
  );

 
  const handleOverallDelete = async () => {
    if (selectedRows.size === 0) {
      toast.error("Please select at least one address to delete");
      return;
    }

    try {
      
      const remainingAddresses = fields.filter((address) => !selectedRows.has(address.id));
      setSelectedRows(new Set()); 
    
      reset({ ...getValues(), addresses: remainingAddresses });
      toast.success("Selected addresses deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete selected addresses");
      console.error("Delete failed:", error);
    }
  };


  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    
    const selectedRowIds = selectionModel.ids;
    
    if (selectedRowIds instanceof Set) {
      
      setSelectedRows(new Set(Array.from(selectedRowIds).map(id => id.toString())));
    } else {
      
      setSelectedRows(new Set());
    }
  
    console.log("Selected Rows:", selectedRowIds); 
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '900px', margin: '0 auto' }}>
        <Box mb={2}>
          <TextField 
            label="Employee ID" 
            fullWidth 
            {...register("id")} 
            error={!!errors.id} 
            helperText={errors.id?.message} 
            disabled={isEdit} 
          />
        </Box>
        
        <Box mb={2}>
          <TextField 
            label="Name" 
            fullWidth 
            {...register("name")} 
            error={!!errors.name} 
            helperText={errors.name?.message} 
          />
        </Box>
        
        <Box mb={2}>
          <TextField 
            label="Age" 
            type="number" 
            fullWidth 
            {...register("age", { valueAsNumber: true })} 
            error={!!errors.age} 
            helperText={errors.age?.message} 
          />
        </Box>
        
        <Box mb={2}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              {...register("gender")}
              defaultValue={defaultValues?.gender || "Male"}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
            {errors.gender && <Typography color="error">{errors.gender.message}</Typography>}
          </FormControl>
        </Box>
        
        <Box mb={2}>
          <TextField 
            label="Position" 
            fullWidth 
            {...register("position")} 
            error={!!errors.position} 
            helperText={errors.position?.message} 
          />
        </Box>
        
        <Box mb={2}>
          <TextField 
            label="Organization" 
            fullWidth 
            {...register("organization")} 
            error={!!errors.organization} 
            helperText={errors.organization?.message} 
          />
        </Box>

        <Box mt={4}>

        <Box mt={4}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
   
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h6" sx={{ marginRight: 2 }}>
        Addresses
      </Typography>
      <TextField
        label="Search by City"
        fullWidth
        value={addressSearch}
        onChange={(e) => setAddressSearch(e.target.value)}
        sx={{ width: '200px' }}
      />
    </Box>

   
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        variant="outlined"
        onClick={handleAddAddress}
        type="button"
        sx={{ backgroundColor: 'blue', color: 'white', marginLeft: 2 }}
       
      >
       <AddIcon />
      </Button>

      <Button
        variant="outlined"
        color="error"
        onClick={handleOverallDelete}
        sx={{ marginLeft: 2, backgroundColor: 'red', color: 'white' }}
        
      >
        <DeleteIcon />
       
      </Button>
    </Box>
  </Box>


  <Paper sx={{ height: '300px', width: '100%', overflow: 'hidden' }}>
    <DataGrid
      rows={filteredAddresses.map((field,) => ({ ...field, id: field.id || `addr-${Date.now()}` }))} 
      columns={addressColumns}
      autoHeight
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
      pageSizeOptions={[5, 10]}
      checkboxSelection
      onRowSelectionModelChange={handleRowSelection}
    />
  </Paper>
</Box>

  
</Box>

        <Box mt={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            type="submit" 
            color="primary" 
            sx={{ minWidth: '150px' }}
          >
            {isEdit ? "Update Employee" : "Create Employee"}
          </Button>
        </Box>
      </Box>

      <AddressDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveAddress}
        address={dialogAddress}
      />
    </form>
  );
};

export default EmployeeForm;


