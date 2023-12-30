// src/components/BmiCalculator.js
import * as d3 from 'd3';
import React, { useState , useEffect, useRef } from 'react';

function BmiCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [diseases, setDiseases] = useState([]);
  const svgRef = useRef();

  const handleCalculate = () => {
    // Handle your BMI calculation here

    if (!weight || isNaN(weight) || !height || isNaN(height)) {
        alert('Please enter valid weight and height values.');
        return;
      }

      const requestData = {
        weight: parseFloat(weight),
        height: parseFloat(height),
      };

      fetch('http://localhost:3001/api/sampleget2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data as needed
        console.log(data.records);
        setDiseases(data.records);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('svg > *').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(diseases.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(diseases, d => d.count)])
      .nice()
      .range([height, 0]);

    const bars = svg.selectAll('.bar')
      .data(diseases)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.count));
    
      bars.transition()
      .duration(1000)
      .attr('y', d => y(d.count))
      .attr('height', d => height - y(d.count));

      const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("opacity", 0);

      bars.on("mouseover", function(event, d) {
        d3.select(this).style("fill", "orange");
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`<strong>${d.name}</strong><br>Count: ${d.count}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
      } )

      bars.on("mouseout", function(d) {
        d3.select(this).style("fill", "black");
        tooltip.transition().duration(200).style("opacity", 0);
      } )


    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-10)')
      .attr('text-anchor', 'end');


    svg.append('g')
      .call(d3.axisLeft(y));

  }, [diseases]);


  return (

    <>
    <div>
      <h2>Check your Health</h2>
      <div>
        <label>Weight (kg):</label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>
      <div>
        <label>Height (m):</label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>
      <button onClick={handleCalculate}>Calculate</button>
    </div>

    {/* <div>
    <h2>List of Diseases with Count of People associated</h2>
    <ul>
    {diseases.length > 0 && diseases.map((disease, index) => (
    <li key={index}>{disease.name} - {disease.count}</li>
    ))}

        {diseases.length === 0 && <h3 style={{color : 'red'}}>Congratulations !! No diseases found.</h3>}

    </ul>
    </div> */}

    {diseases.length > 0 && <svg ref={svgRef}></svg>}
    {!diseases.length && <h3 style={{color : 'red'}}>Congratulations !! No diseases found.</h3>}

    </>
  );
}

export default BmiCalculator;
