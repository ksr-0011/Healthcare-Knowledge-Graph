import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, FormControlLabel,FormControl,RadioGroup,Radio, Checkbox } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import DisplayTable from './Display';


const MyForm2 = () => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender : '',
    sysBp : '',
    diaBp : '',
    family_illness : false,
    glucose : '',
  });

  const navigate = useNavigate();

  const [data, setdata] = useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.isSmoker && !formData.cigarettesPerDay) {
        toast.error('Please enter the number of cigarettes per day for smokers.');
        return false;
      }
  
      // age should be between 0 and 100 and should be a number and not a float
      if (parseInt(formData.age) < 0 || parseInt(formData.age) > 100 || isNaN(formData.age) || formData.age.includes('.')) {
        toast.error('Please enter a valid age between 0 and 100.');
        return false;
      }

     // height is a float and should be between 0 and 3
        if (parseFloat(formData.height) < 0 || parseFloat(formData.height) > 3 || isNaN(formData.height)) {
            toast.error('Please enter a valid height between 0 and 3.');
            return false;
        }

        // weight is an integer and should be between 0 and 300
        if (parseInt(formData.weight) < 0 || parseInt(formData.weight) > 300 || isNaN(formData.weight)) {
            toast.error('Please enter a valid weight between 0 and 300.');
            return false;
        }

        // sysBp is an integer and should be between 0 and 300
        if (parseInt(formData.sysBp) < 60 || parseInt(formData.sysBp) > 200 || isNaN(formData.sysBp)) {
            toast.error('Please enter a valid sysBp between 60 and 200.');
            return false;
        }
          // sysBp is an integer and should be between 0 and 300
          if (parseInt(formData.diaBp) < 30 || parseInt(formData.diaBp) > 160|| isNaN(formData.diaBp)) {
            toast.error('Please enter a valid diaBp between 30 and 160.');
            return false;
        }


        const queryParams = new URLSearchParams(formData).toString();
        console.log(queryParams)
        navigate(`/displaydisease?${queryParams}`);
        toast.success('Form submitted successfully!');

  };

  console.log(data)

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          My Form
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 20 }}>
          <TextField
            label="Age"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          <TextField
            label="Height"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
          />
          <TextField
            label="Weight"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
            <FormControl component="fieldset" fullWidth margin="normal">
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Sys Bp"
            variant="outlined"
            margin="normal"
            fullWidth
            type="number"
            name="sysBp"
            value={formData.sysBp}
            onChange={handleChange}
          />
          <TextField
            label="Dia Bp"
            variant="outlined"
            margin="normal"
            fullWidth
            type="number"
            name="diaBp"
            value={formData.diaBp}
            onChange={handleChange}
          />
           <TextField
            label="Glucose"
            variant="outlined"
            margin="normal"
            fullWidth
            type="number"
            name="glucose"
            value={formData.glucose}
            onChange={handleChange}
          />
            <FormControlLabel
                control={<Checkbox checked={formData.family_illness} onChange={handleChange} name="family_illness" />}
                label="Diabetes in Family"  
            />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
            Submit
          </Button>
        </form>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default MyForm2;
