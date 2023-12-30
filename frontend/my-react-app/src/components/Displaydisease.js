import React, { useEffect , useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useLocation } from 'react-router-dom';
import MyGraph from './Reactgraph.js';

const DisplayTable = () => {
    
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const formData = Object.fromEntries(queryParams);

    useEffect(() => {
        console.log(formData)

        // SEND a post request to the backend with the form data
    fetch('http://localhost:3001/api/query5', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((data) => {
            // Handle the response data as needed
            console.log(data.records);
            setdata(data.records);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }
    , [])

    const dataFormat = (data) => {
      // Return a string similar to (:Person {Weight (kg): 62, Smoker: false, Family History: "None", CigsPerDay: 0.0, Sex: "Female", Height (cm): 163, Id: 36, Age: 53, BMI: 23.33546614})
  
      // Color the label green and the key Red
  
      const out = '(' + data.labels[0] + ' {' + 
      Object.keys(data.properties).map((key) => {
  
          // some data.properties[key] are objects , in that case take their low value
          let value = data.properties[key];
          if (typeof value === 'object' && value != null){
              value = value.low !== undefined ? value.low : value.toString();
          }
          
          return `${key} : ${value}`;
      }).join(', ') 
      + '})';
  
      return out;
    }
    
    console.log(data)
  return (
    <div>
        {loading ? (
        <p>Loading...</p>
      ) : (
        <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '25%' , backgroundColor: 'black', color: 'white'}} align="right" >Person</TableCell>
            <TableCell style={{ width: '25%' , backgroundColor: 'black', color: 'white'}} align="right">Diabetic</TableCell>
            <TableCell style={{ width: '25%' , backgroundColor: 'black', color: 'white'}} align="right">Disease</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.p1.identity.low}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">{dataFormat(item.p1)}</TableCell>
              <TableCell align="right">{dataFormat(item.p2)}</TableCell>
              <TableCell align="right">{dataFormat(item.p4)}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <MyGraph array={data} />
    </>
)}
    </div>
  );
};

export default DisplayTable;
