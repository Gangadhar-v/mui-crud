import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeForm from "../components/employee-form";
import { EmployeeFormValues } from "../schema/form-schema";
import axios from "axios";

const EditEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios
        .get<EmployeeFormValues>(`http://localhost:3000/employees/${id}`)
        .then((res) => {
          const data = res.data;

          
          if (!data.addresses || data.addresses.length === 0) {
            data.addresses = [
              {
                plotNumber: "",
                cityName: "",
                stateName: "",
                postalCode: "",
                country: "",
              },
            ];
          }

          setEmployee(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch employee", err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSuccess = () => {
    navigate("/employees");
  };

  if (loading) return <p>Loading employee data...</p>;

  if (!employee) return <p>No employee found with id {id}</p>;

  return (
    <div>
      <h2>Edit Employee</h2>
      <EmployeeForm isEdit={true} defaultValues={employee} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditEmployee;
