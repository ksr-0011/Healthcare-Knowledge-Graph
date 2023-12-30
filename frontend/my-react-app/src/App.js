import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NetworkVisualization from './components/D3.js';
import Disease from './components/Disease.js';
import TableComponent from './components/Table';
import HeartDisease from './components/HeartDisease';
import AllDiseases from './components/AllDiseases';
import LandingPage from './components/Landing.js';
import MyForm from './components/Form.js';
import DisplayTable from './components/Display.js';
import MyForm2 from './components/Formdisase.js';
import DisplayTable2 from './components/Displaydisease.js';
import DiabetesAge from './components/DiabetesAge.js';


function App() {
  return (
    <Router>
      <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/d3" element={<NetworkVisualization />} />
        <Route path="/disease" element={< Disease/>} />
        <Route path="/table" element={<TableComponent />} />
        <Route path="/table2" element={<HeartDisease />} />
        <Route path="/table3" element={<AllDiseases />} />
        <Route path = '/form' element={<MyForm />} />
        <Route path = '/display' element={<DisplayTable />} />
        <Route path = '/form2' element={<MyForm2 />} />
        <Route path = '/displaydisease' element={<DisplayTable2 />} />
        <Route path = '/diabetesage' element={<DiabetesAge />} />

      </Routes>
      </div>
    </Router>
    
  );
}

//nodes
// .attr('cx', d => ) // ensure nodes don't go out of bounds
// .attr('cy', d => d.y)
// .attr('r', 40)
// .attr('fill', 'black')
// .attr('stroke', 'black')
// .attr('stroke-width', '2px')
// .call(d3.drag()
// .on('start', dragstarted)
// .on('drag', dragged)
// .on('end', dragended));

export default App;
