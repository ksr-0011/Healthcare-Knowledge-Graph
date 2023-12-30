import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MyGraph from './Reactgraph';

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your API or any data source
        const response = await fetch('http://localhost:3001/api/query2');
        const result = await response.json();

        // Update the state with the fetched data
        setData(result.records);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData(); // Invoke the fetchData function
  }, []); // The empty dependency array ensures that useEffect runs once when the component mounts


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
            <TableCell style={{ width: '25%' , backgroundColor: 'black', color: 'white'}} align="right">Heart Disease</TableCell>
            <TableCell style={{ width: '25%', backgroundColor: 'black', color: 'white' }} align="right">Blood Pressure</TableCell>
            <TableCell style={{ width: '25%' , backgroundColor: 'black', color: 'white'}} align="right">Diseases and Causes</TableCell>
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
              <TableCell align="right">{dataFormat(item.p3)}</TableCell>
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

export default TableComponent;
