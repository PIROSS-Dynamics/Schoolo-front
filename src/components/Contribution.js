import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import '../css/Contribution.css';

const Contribution = () => {
  const [data, setData] = useState(null);
  const ref = useRef();

  const [focus, setFocus] = useState(null);

  let zoomedNode = null;
  let actualLevel = 0;

  // laod the JSON
  useEffect(() => {
    fetch("/Contribution.json")
      .then(response => response.json())
      .then(setData);
  }, []);

  useEffect(() => {
    if (!data) return; // wait the loading

    
    const width = 780;
    const height = 780;

    // transform json to graph
    const root = d3.hierarchy(data)
      .sum(d => d.value || 1) 
      .sort((a, b) => b.value - a.value);


    const pack = d3.pack()
      .size([width, height])
      .padding(5);

    
    setFocus(root);
    pack(root);
    
     // color of the graphic
    const color = d3.scaleLinear()
      .domain([0, 4])
      .range(["#98e6cc", "#00a5e7"])
      .interpolate(d3.interpolateHcl);

    // Sélectionner et créer le SVG
    const svg = d3.select(ref.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%") 
      .attr("height", "100%")
    
      .style("display", "block")
      .style("cursor", "pointer");


    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `scale(1)`);

    // Dessiner les cercles
    g.selectAll("circle")
      .data(root.descendants())
      .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .attr("stroke", "none") 
      .attr("stroke-width", 2) 
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("r", d => d.r)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke", "#000"); 
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("stroke", "none"); 
      })
      .on("click", (event, d) => zoom(event, d));
      
      
      

    // Ajouter les labels des nœuds
    g.selectAll("text")
      .data(root.descendants())
      .join("text")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("text-anchor", "middle")
      .attr("font-size", d => (d.children ? 20 : 14))
      .attr("fill", "black")
      
      .style("display", d => (d.data.level == actualLevel + 1 ? "block" : "none")) 
      .text(d => d.data.name);

  }, [data]); // Re-exécuter lorsqu'on a les données

  
  const zoom = (event, d) => {
    

    if (!d.children && (d.data.name === zoomedNode)) {
      alert(d.data.worker);
    }

    zoomedNode = d.data.name;
    actualLevel = d.data.level;

    setFocus(d); 

    //smooth animation
    const transition = d3.select(ref.current)
    .transition()
    .duration(750);


    
    const zoomFactor = 0.8;

    
    var k;
    //we don't apply zoomFactor for root
    if (d.data.name === "Root"){
      k = 1;
    } else {
      var k = (800 / (d.r * 2)) * zoomFactor; 
    }


    
    let x = 800 / 2 - d.x * k; // horizontaly move
    let y = 800 / 2 - d.y * k; // vertivaly move

    let g = d3.select(ref.current).select("g");

    g.transition(transition)
      .attr("transform", `translate(${x},${y}) scale(${k})`);


      setTimeout(() => {
        g.selectAll("text")
          .style("display", d => (d.data.level === actualLevel + 1 || d.data.level === actualLevel ? "block" : "none"));

        
      }, 750); // Attendre la fin de l'animation pour mettre à jour

    };

  
  return (
    
    <div>
      <h1 className="contribution-title"> Contribution in the team </h1>

      <div className="graph-container">
        <svg ref={ref}></svg>
      </div>
    </div>
    
  );
};

export default Contribution;
