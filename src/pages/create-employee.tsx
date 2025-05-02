

import React from "react";
import EmployeeForm from "../components/employee-form";
import { useNavigate } from "react-router-dom";

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/employees");
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <EmployeeForm isEdit={false} onSuccess={handleSuccess} />
    </div>
  );
};

export default AddEmployee;

