import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";

const UpdateUser = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(initialValues);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:1129/api/patient/getbyid', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData({
                        ...data,
                        contact: data.phoneNumber, // Assuming phoneNumber needs to be mapped to contact
                    });
                } else {
                    console.error('Failed to fetch user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
    
        fetchUserData();
    }, [userId]);

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = async (values) => {
        const payload = {
            patientId: userId,
            ...values,
            phoneNumber: values.contact, // Ensure that phoneNumber is sent back as phoneNumber
        };

        try {
            const response = await fetch(`http://127.0.0.1:1129/api/patient/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(`Failed to update user: ${errorMsg}`);
            }

            const updatedData = await response.json();
            alert('User updated successfully!');
            setUserData({ ...updatedData, contact: updatedData.phoneNumber }); // Update local state with new data
        } catch (error) {
            console.error('Error updating user:', error);
            alert(error.message);
        }
    };

    return (
        <Box m="20px">
            <Header title="Modifier l'utilisateur" subtitle="Modifier l'utilisateur" />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={userData}
                validationSchema={validationSchema}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="First Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.prenom}
                                name="prenom"
                                error={touched.prenom && !!errors.prenom}
                                helperText={touched.prenom && errors.prenom}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Last Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.nom}
                                name="nom"
                                error={touched.nom && !!errors.nom}
                                helperText={touched.nom && errors.nom}
                                sx={{ gridColumn: "span 2" }}
                            />
                        <TextField
    fullWidth
    variant="filled"
    type="email"
    label="Email"
    onBlur={handleBlur}
    onChange={handleChange}
    value={values.email}
    name="email"
    error={touched.email && !!errors.email}
    helperText={touched.email && errors.email}
    sx={{ gridColumn: "span 4" }}
/>

                            <TextField
                                fullWidth
                                variant="filled"
                                type="tel"
                                label="Contact Number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.contact}
                                name="contact"
                                error={touched.contact && !!errors.contact}
                                helperText={touched.contact && errors.contact}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Address"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.address}
                                name="address"
                                error={touched.address && !!errors.address}
                                helperText={touched.address && errors.address}
                                sx={{ gridColumn: "span 4" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Update User
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const validationSchema = yup.object().shape({
    prenom: yup.string().required("First name is required"),
    nom: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    contact: yup.string().matches(phoneRegExp, "Phone number is not valid").required("Contact number is required"),
    address: yup.string().required("Address is required"),
});

const initialValues = {
    prenom: "",
    nom: "",
    email: "",
    contact: "",
    address: "",
};

export default UpdateUser;
