import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import '../css/Contribution.css';

const Contribution = () => {
  const [data, setData] = useState(null);
  const ref = useRef();

  const [focus, setFocus] = useState(null);

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

    // color of the graphic
    const color = d3.scaleLinear()
      .domain([0, 4])
      .range(["#98e6cc", "#00a5e7"])
      .interpolate(d3.interpolateHcl);

      
    const pack = d3.pack()
      .size([width, height])
      .padding(5);

    // transform json to graph
    const root = d3.hierarchy(data)
      .sum(d => d.value || 1) 
      .sort((a, b) => b.value - a.value);

    pack(root);

    setFocus(root);

    // Sélectionner et créer le SVG
    const svg = d3.select(ref.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .style("max-width", "100%")
      .style("height", "auto")
      .style("display", "block")
      .style("cursor", "pointer");

    const g = svg.append("g");
    // Dessiner les cercles
    g.selectAll("circle")
      .data(root.descendants())
      .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("r", d => d.r)
      .on("click", (event, d) => zoom(event, d));

    // Ajouter les labels des nœuds
    g.selectAll("text")
      .data(root.descendants())
      .join("text")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("text-anchor", "middle")
      .attr("font-size", d => (d.children ? 14 : 10))
      .attr("fill", "black")
      
      
      .text(d => d.data.name);

  }, [data]); // Re-exécuter lorsqu'on a les données

  const zoom = (event, d) => {
    // Mettre à jour le focus sur le nœud cliqué
    setFocus(d);

    alert(d.data.name);
  };
  
  return (
    
    <div>
      <h1> Contribution in the team </h1>
      <svg ref={ref}></svg>
    </div>
    
  );
};

export default Contribution;
