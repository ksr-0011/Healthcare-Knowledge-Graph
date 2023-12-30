import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const MyGraph = (props) => {
  const svgRef = useRef(null);

    const [data, setdata] = useState([])



  useEffect(() => {
    const width = 1200;
    const height = 800;
    console.log("My Graph " , props.array[0])
    setdata(props.array)

    // Convert data to nodes and links
    const datanodes = [];
    const datalinks = [];

    props.array.forEach((dictionary, i) => {
      Object.keys(dictionary).forEach((key, j) => {
        datanodes.push({ id: `${dictionary[key].identity.low}` });

        // Connect each key to every other key in the same dictionary
        for (let k = j + 1; k < Object.keys(dictionary).length; k++) {
            let otherkey = Object.keys(dictionary)[k]

          datalinks.push({
            source: `${dictionary[key].identity.low}`,
            target: `${dictionary[otherkey].identity.low}`,
          });
        }
      });
    });

    // Now give some x and y values to the nodes
    datanodes.forEach((el, i) => {
      el.x = Math.random() * width; // Initialize with random X position
      el.y = Math.random() * height; // Initialize with random Y position
    });

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('border', '1px solid black')
      .style('background-color', 'beige')

    const simulation = d3.forceSimulation(datanodes)
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(datalinks).id(d => d.id).distance(200));

    // Create SVG elements for links and nodes
    const links = svg.selectAll('line')
    .data(datalinks)
    .enter()
    .append('line')
    .attr('stroke-width', 2)
    .attr('stroke', 'black');

    const nodes = svg.selectAll('circle')
    .data(datanodes)
    .enter()
    .append('circle')
    .attr('r', 40)
    .attr('fill', 'blue')
    .attr('stroke', 'black');


    const label = svg.selectAll('text')
    .data(datanodes)
    .enter()
    .append('text')
    .text(d => d.id)
    .attr('dy', '0.3em') // Adjust text positioning
    .attr('text-anchor', 'middle') // Center the text
    .style('fill', 'white')
    .style('font-size', 8); // Font color

    // Define the tick function
    simulation.on('tick', () => {

        const svgLeft = svg.node().getBoundingClientRect().left;
        const svgTop = svg.node().getBoundingClientRect().top;
        const svgWidth = svg.node().getBoundingClientRect().width;
        const svgHeight = svg.node().getBoundingClientRect().height;


        nodes
          .attr('cx', d => {
            if (d.x - 40 < svgLeft) {
              d.x = svgLeft + 40;
            } else if (d.x + 40 > svgLeft + svgWidth) {
              d.x = svgLeft + svgWidth - 40;
            }
            return d.x;
          } )
          .attr('cy', d => {
            if (d.y - 40 < svgTop) {
              d.y = svgTop + 40;
            } else if (d.y + 40 > svgTop + svgHeight) {
              d.y = svgTop + svgHeight - 40;
            }
            return d.y;
          })
          .attr('fill', 'black')
          .attr('stroke', 'black')
          .attr('stroke-width', '2px')
          .call(d3.drag());
          
        
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);

        links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    });


  }, []);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default MyGraph;
