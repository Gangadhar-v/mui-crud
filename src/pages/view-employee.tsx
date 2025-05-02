import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EmployeeFormValues } from "../schema/form-schema";
import axios from "axios";
import { Card, CardContent, Typography, Box, Divider, List, ListItem, ListItemText } from '@mui/material';

const ViewEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employeeData, setEmployeeData] = useState<EmployeeFormValues | undefined>();

  useEffect(() => {
    if (id) {
      axios.get<EmployeeFormValues>(`http://localhost:3000/employees/${id}`)
        .then((data) => {
          setEmployeeData(data.data);
        })
        .catch((err) => {
          console.error("Error fetching employee data:", err);
        });
    }
  }, [id]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
      <Card sx={{ width: 450, padding: 3, boxShadow: 5, borderRadius: 2 }}>
        <CardContent>
         
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Employee Details
          </Typography>

        
          <Divider sx={{ marginBottom: 2 }} />

        
          <Typography variant="h6" sx={{ marginBottom: 1, color: 'primary.main' }}>
            {employeeData?.name}
          </Typography>

         
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
            <strong>Position: </strong>{employeeData?.position}
          </Typography>

       
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
            <strong>Organization: </strong>{employeeData?.organization}
          </Typography>

         
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
            <strong>Age: </strong>{employeeData?.age}
          </Typography>

     
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
            <strong>Gender: </strong>{employeeData?.gender}
          </Typography>

      
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
            <strong>Address:</strong>
          </Typography>
          <List sx={{ marginBottom: 2 }}>
            {employeeData?.addresses.map((address, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${address.plotNumber}, ${address.cityName}, ${address.stateName}`}
                  secondary={`${address.country}, ${address.postalCode}`}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ marginBottom: 1 }} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewEmployee;

