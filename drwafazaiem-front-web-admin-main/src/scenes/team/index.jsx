import {fetchAndTransformData} from '../../data/mockData';

import { Box, Typography, Button, useTheme, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Team = () => {

  const [mockDataTeam, setMockDataTeam] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);


  const fetchData = async () => {
    const data = await fetchAndTransformData();
    const transformedData = data.map(user => ({
      ...user,
      address: user.address || "" // Normalize missing addresses
    }));
    setMockDataTeam(transformedData);
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  const handleOpen = (id) => {
    setOpen(true);
    setSelectedId(id);
  };
  const handleClick = async (id) => {
    console.log('Role clicked with ID:', id); // This should log when a role is clicked
    try {
      const response = await fetch(`http://127.0.0.1:1129/api/patient/switch-role-cyclic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId: id }),
      });
      if (response.ok) {
        fetchData(); // Call fetchData to update the grid with the latest data

        const updatedData = await response.json();
        // Handle the data update here, possibly updating state
        console.log('Role updated successfully:', updatedData);
      } else {
        console.error('Error switching role:', response.statusText);
      }
    } catch (error) {
      console.error('Error switching role:', error.message);
    }
  };
  
  
  const handleClose = () => {
    setOpen(false);
  };
  const handleArchive = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:1129/api/patient/archiver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId: selectedId }),
      });
      if (response.ok) {
        // Handle success
        const updatedPatientData = await response.json();
        // Update the DataGrid with the updatedPatientData
        setMockDataTeam(updatedPatientData); // Update the state with the updated data
      } else {
        // Handle error
        console.error('Error archiving team member:', response.statusText);
      }
    } catch (error) {
      console.error('Error archiving team member:', error.message);
    }
    handleClose();
  };
  
  

  const columns = [
    { field: "id", headerName: "ID", width: 20 },
    { field: "avatar", headerName: "Avatar", width: 70, renderCell: (params) => <img src={params.value} alt="Avatar" style={{ width: 50, borderRadius: '50%' }} /> },
   
    { field: "fullName", headerName: "Full Name", flex: 0.6 },
    { field: "phone", headerName: "Phone Number", flex: 0.8 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", width: 50, flex: 0.6 }, // Add address field
    {
      field: "accessLevel",
      headerName: "Role",
      width: 120,
      renderCell: ({ value, row }) => (
        <Box
  display="flex"
  alignItems="center"
  gap={1}
  sx={{
    border: '1px solid white', // Sets a solid white border
    borderRadius: '4px', // Applies a border radius of 4px
    padding: '3px', // Adds some padding around the contents
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Sets a slight white transparent background
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Changes background on hover for better UI interaction
      borderColor: 'white' // Ensures the border color stays white on hover
    }
  }}
>
  {value === "admin" && <AdminPanelSettingsOutlinedIcon />}
  {value === "manager" && <SecurityOutlinedIcon />}
  {value === "user" && <LockOpenOutlinedIcon />}
  <Typography sx={{ ml: 1 }}>
    <Button
      onClick={() => handleClick(row.id)}
      sx={{
        color: 'white', // Sets the text color to white
       
        borderRadius: '4px', // Sets border radius for the button
     
      }}
    >
      {value}
    </Button>
  </Typography>
</Box>

      ),
    },
    
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" >
    <Button
      component={Link}
      to={`/update/${params.id}`}
      startIcon={<EditOutlinedIcon />}
      style={{ color: 'green' }}
    >
      
    </Button>          <Button onClick={() => handleOpen(params.id)} startIcon={<ArchiveOutlinedIcon />} style={{ color: 'red' }}></Button>
          <Link to="/calendar">
            <Button startIcon={<VisibilityOutlinedIcon />} style={{ color: colors.blueAccent[700] }}> </Button>
          </Link>
        </Box>
      ),
    },
  ];

  return (
    <Box m={4}>
      <Header title="Team Management" subtitle="Manage Team Members and Their Roles" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>

      <Button
      component={Link}
      to="/form"
      type="submit"
      color="secondary"
      variant="contained"
    >
      Ajouter un utilisateur
    </Button>
    </div>


      <Box sx={{
        height: '75vh',
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
        "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
        "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
      }}>
        <DataGrid rows={mockDataTeam} columns={columns} pageSize={5} checkboxSelection />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box bgcolor="dark" p={2} position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" borderRadius={2}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirm Archive
          </Typography>
          <Typography color={'error'} id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to archive this team member?
          </Typography>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleArchive} color="error">Archive</Button>
            <Button
      onClick={handleClose}
      sx={{
        color: 'white',          // Sets the text color to white
     
      }}
    >
      Cancel
    </Button>          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Team;
