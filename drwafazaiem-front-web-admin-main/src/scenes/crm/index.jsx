import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography ,Grid} from "@mui/material";
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header"; // Adjust this path as needed

// Form validation schema
const validationSchema = yup.object({
  primaryColor: yup.string().required("Primary color is required"),
  logo: yup.mixed().nullable(),
  instagram: yup.string().url("Enter a valid URL").required("Instagram URL is required"),
  phone: yup.string().matches(/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/, "Phone number is not valid").required("Phone number is required"),
  address: yup.string().required("Address is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const Crm = () => {
  const [initialValues, setInitialValues] = useState({
    primaryColor: "",
    logo: undefined,
    instagram: "",
    phone: "",
    address: "",
    email: "",
  });
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch('http://127.0.0.1:1129/api/crm/settings');
      const data = await response.json();
      if (response.ok) {
        setInitialValues({
          primaryColor: data.color || "",
          logo: data.logoImage || undefined,
          instagram: data.instagramUrl || "",
          phone: data.phoneNumber || "",
          address: data.address || "",
          email: data.email || "",
        });
      } else {
        console.error('Failed to fetch settings:', data.error);
      }
    };

    fetchSettings();
  }, []);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    if (values.logo && values.logo instanceof File) {
      const formData = new FormData();
      formData.append('image', values.logo);
      formData.append('imageType', 'logoImage'); // Ensure this corresponds with your backend logic
  
      try {
          const response = await fetch('http://127.0.0.1:1129/api/crm/uploadImage', {
              method: 'POST',
              body: formData,
          });
  
          if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
          }
  
          const data = await response.json();
          console.log('Image updated successfully:', data);
      } catch (error) {
          console.error('Failed to upload image:', error);
      }
  }
  
    // Handle other settings updates
    const settingsData = {
      color: values.primaryColor,
      instagramUrl: values.instagram,
      phoneNumber: values.phone,
      address: values.address,
      email: values.email,
    };
  
    try {
      const response = await fetch('http://127.0.0.1:1129/api/crm/updateSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Settings updated successfully:', data);
    } catch (error) {
      console.error('Failed to update settings:', error.message || 'Unknown error');
    }
  
    setSubmitting(false);
  };
  

  return (
    <Box m="20px">
      <Header title="CRM Settings" subtitle="Update CRM Settings" />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="color"
                  label="Primary Color"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.primaryColor}
                  name="primaryColor"
                  error={touched.primaryColor && Boolean(errors.primaryColor)}
                  helperText={touched.primaryColor && errors.primaryColor}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="text"
                  label="Instagram URL"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.instagram}
                  name="instagram"
                  error={touched.instagram && Boolean(errors.instagram)}
                  helperText={touched.instagram && errors.instagram}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="tel"
                  label="Phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  name="phone"
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="text"
                  label="Address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address}
                  name="address"
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  name="email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  accept="image/*"
                  type="file"
                  onChange={(event) => setFieldValue("logo", event.currentTarget.files[0])}
                  name="logo"
                  style={{ display: 'block', width: '100%' }} // Adjust style as necessary
                />
                {touched.logo && errors.logo && <Typography color="error">{errors.logo}</Typography>}
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                Update Settings
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
  
};

export default Crm;
