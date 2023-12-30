import React, { useEffect, useRef , useState } from 'react';
import * as d3 from 'd3';

const NetworkVisualization = () => {
  const svgRef = useRef(null);
  const legendsvgref = useRef(null);
  const [data, setData] = useState({ nodes: [], links: [] });
  const [elements, setElements] = useState([]);

  useEffect(() => {
    
    const api_url = 'http://localhost:3001/api/query7'
    fetch(api_url)
      .then(response => response.json())
      .then(data => {
        setElements(data['records']);
      });
    
  }, []);

  
  useEffect(() => {
    const width = 1500;
    const height = 1000;
    console.log(elements)

    const agenodes = []
    const glucosenodes = []
    const family_illnessnodes = []
    const p2nodes = []
    const datalinks = []

    elements.forEach(element => {

      const p1 = element['p1']
      const p2 = element['p2']

      // get the age group of p1 
      const age = p1.properties.Age.low
      let age_group = ''

      if (age < 18) {
        age_group = 'child (<18)'
      }
      else if (age >= 18 && age < 40) {
        age_group = 'adult (18-40)'
      }
      else if (age >= 40 && age < 55) {
        age_group = 'middle (40-55)'
      } 
      else {
        age_group = 'senior (>55)'
      }

        const glucose = p2.properties.Glucose.low
        console.log(glucose)
        let glucose_group = ''
        
        if (glucose < 90) {
            glucose_group = 'low'
        }
        else if(glucose >= 90 && glucose < 130) {
            glucose_group = 'normal'
        }
        else if(glucose >= 130 && glucose < 180) {
            glucose_group = 'high'  
        }
        else{
            glucose_group = 'very high'
        }



      const family_illness = p1.properties['Family History'] == 'None' ? 'No' : 'Yes'

      // add smoker node to the smokernodes if not already exists
      if (!family_illnessnodes.find(node => node.id === family_illness)) {
        family_illnessnodes.push({id:family_illness, label: `${family_illness}`, properties: {type: 'family_illness'} , x: Math.random() * width , y: Math.random() * height , color : 'green' , radius : 35})
      }

      // add age group to the age node if not already exists
      if (!agenodes.find(node => node.id === age_group)) {
        agenodes.push({id: age_group, label: age_group, properties: {type: 'age'} , x: Math.random() * width , y: Math.random() * height , color : 'red' , radius : 35})
      }

      // add glucose group to the glucose node if not already exists
        if (!glucosenodes.find(node => node.id === glucose_group)) {
            glucosenodes.push({id: glucose_group, label: glucose_group, properties: {type: 'glucose'} , x: Math.random() * width , y: Math.random() * height , color : 'blue' , radius : 35})
        }

      // add p2 to the p2 node
      let p2color = 'steelblue'
      if (p2.properties['Outcome'].low == 1) {
        p2color = 'yellow'
      }

      p2nodes.push({id: p2.identity.low, label: '', properties: p2.properties , x: Math.random() * width , y: Math.random() * height , color : p2color , radius : 8})

      // add link between age group and p2
      datalinks.push({source: age_group, target: p2.identity.low, label: 'has' , properties: {type: 'has'}})

      // add link between smoker and p2
      datalinks.push({source: family_illness, target: p2.identity.low, label: 'family_illness' , properties: {type: 'family_illness'}})

        // add link between glucose and p2
        datalinks.push({source: glucose_group, target: p2.identity.low, label: 'glucose' , properties: {type: 'glucose'}})
    }
    )

    // CONCAT AGE NODES , SMOKER NODES AND P2 NODES
    const datanodes = agenodes.concat(family_illnessnodes).concat(glucosenodes).concat(p2nodes)
    


    setData({ nodes: datanodes, links: datalinks });

    console.log(datanodes , datalinks)

    
      // give some padding
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('border', '1px solid black')
      .style('background-color', 'beige')


    const simulation = d3.forceSimulation(data.nodes)
      .force('charge', d3.forceManyBody().strength(-80))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(100));

    const links = svg.selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('stroke', 'black');

    const nodes = svg.selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.radius)
      .style('fill', d => d.color)


    const label = svg.selectAll('text')
        .data(data.nodes)
        .enter()
        .append('text')
        .text(d => d.label)
        .attr('dy', '0.3em') // Adjust text positioning
        .attr('text-anchor', 'middle') // Center the text
        .style('fill', 'white')
        .style('font-size', 10); // Font colo

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
          
          
        
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);

        links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

       
    });


    const node_types = [{name:'Family Illness' , color : 'green'} , {name:'age' , color : 'red'} , {name:'Diabetic' , color:'yellow'} , {name: 'Non-Diabetic' , color:'steelblue'} , {name:'Glucose' , color:'blue'}]

    // Don't select all text as labels from nodes are getting removed

    // create a new svg and put the legend in it

    const legend_svg = d3.select(legendsvgref.current)
      .attr('width', 200)
      .attr('height', 200)
      .style('border', '1px solid black')
      .style('background-color', 'lightpink')

    const legend = legend_svg.selectAll('g')
        .data(node_types)
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(0, ${i * 30})`);  

    legend.append('circle')
        .attr('cx', 20)
        .attr('cy', 20)
        .attr('r', 10)
        .style('fill', d => d.color);

    legend.append('text')
        .attr('x', 40)
        .attr('y', 25)
        .text(d => d.name)
        .attr('text-anchor', 'start')
        .style('font-family', 'sans-serif')
        .style('font-size', '24px');
   


  }, [elements]);

  return (
    <>
    <h1>Age with Diabetes Correlation with family history and glucose levels</h1>
    <svg ref={svgRef}></svg>
    <h1>Legend</h1>
    <svg ref={legendsvgref}></svg>
    </>
  );
}

export default NetworkVisualization;
