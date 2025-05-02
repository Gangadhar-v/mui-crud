
import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormValues } from "../schema/form-schema";

interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AddressFormValues) => void;
  address?: AddressFormValues | null;
}

const AddressDialog: React.FC<AddressDialogProps> = ({
  open,
  onClose,
  onSave,
  address,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: address || {
      plotNumber: "",
      cityName: "",
      stateName: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        address || {
          plotNumber: "",
          cityName: "",
          stateName: "",
          postalCode: "",
          country: "",
        }
      );
    }
  }, [open, address, reset]);

  const handleFormSubmit: SubmitHandler<AddressFormValues> = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
      {/* Isolated form to prevent bubbling */}
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          handleSubmit(handleFormSubmit)(e);
        }}
      >
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Plot Number"
              fullWidth
              {...register("plotNumber")}
              error={!!errors.plotNumber}
              helperText={errors.plotNumber?.message}
              margin="normal"
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="City"
              fullWidth
              {...register("cityName")}
              error={!!errors.cityName}
              helperText={errors.cityName?.message}
              margin="normal"
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="State"
              fullWidth
              {...register("stateName")}
              error={!!errors.stateName}
              helperText={errors.stateName?.message}
              margin="normal"
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Postal Code"
              fullWidth
              {...register("postalCode")}
              error={!!errors.postalCode}
              helperText={errors.postalCode?.message}
              margin="normal"
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Country"
              fullWidth
              {...register("country")}
              error={!!errors.country}
              helperText={errors.country?.message}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} type="button" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Address
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddressDialog;

