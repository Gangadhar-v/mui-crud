import { z } from 'zod';


export const addressSchema = z.object({
  id: z.string().optional(),
  plotNumber: z.string().min(1, "Plot number is required"),
  cityName: z.string().min(1, "City is required"),
  stateName: z.string().min(1, "State is required"),
  postalCode: z.string().length(6, "Postal code must be 6 digits"),
  country: z.string().min(1, "Country is required"),
});


export const employeeSchema = z.object({
  id: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
  age: z.number().min(18, "Age must be at least 18"),
  gender: z.enum(["Male", "Female", "Others"], { required_error: "Gender is required" }),
  position: z.string().min(1, "Position is required"),
  organization: z.string().min(1, "Organization is required"),
  addresses: z
    .array(addressSchema)
    .min(1, { message: "At least one address is required" }),
});


export type EmployeeFormValues = z.infer<typeof employeeSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
