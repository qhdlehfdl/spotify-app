import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import versor from "versor";

const Globe = ({ onCountryClick, selectedCountry }) => {
  const containerRef = useRef();
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 회전 및 스케일 유지
  const rotationRef = useRef([-127.5, -37.5]); // 한국 중심
  const scaleRef = useRef(1);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const { width, height } = dimensions;
    const baseScale = (Math.min(width, height) - 20) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#121212");

    svg.selectAll("*").remove();
    const g = svg.append("g");

    const projection = d3
      .geoOrthographic()
      .scale(baseScale * scaleRef.current)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate(rotationRef.current);

    const path = d3.geoPath(projection);

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("padding", "6px 12px")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "#fff")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("opacity", 0);

    g.append("path")
      .datum({ type: "Sphere" })
      .attr("fill", "#121212")
      .attr("stroke", "#ffff")
      .attr("d", path);

    d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((world) => {
      const countries = topojson.feature(
        world,
        world.objects.countries
      ).features;

      g.selectAll("path.country")
        .data(countries)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("fill", "#ffff")
        .attr("stroke", "#121212")
        .attr("stroke-width", 0.5)
        .attr("d", path)
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", "#0D6EFD");
          const tooltipContent = d.properties.name;
          tooltip
            .style("opacity", 0.9)
            .style("z-index",99)
            .html(tooltipContent)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "#ffff");
          tooltip.style("opacity", 0);
        })
        .on("click", function (event, d) {
          onCountryClick(d.properties.name);
        });
    });

    let v0, r0, q0;
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 6])
      .on("start", (event) => {
        const [x, y] = d3.pointer(event, svg.node());
        v0 = versor.cartesian(projection.invert([x, y]));
        r0 = projection.rotate();
        q0 = versor(r0);
      })
      .on("zoom", (event) => {
        const k = event.transform.k;
        const [x, y] = d3.pointer(event, svg.node());
        const v1 = versor.cartesian(projection.rotate(r0).invert([x, y]));
        const q1 = versor.multiply(q0, versor.delta(v0, v1));
        const r1 = versor.rotation(q1);
        projection.rotate(r1).scale(baseScale * k);

        rotationRef.current = r1;
        scaleRef.current = k;

        g.selectAll("path")
          .attr("d", path);
      });

    svg.call(zoom);

    let lastTime = Date.now();
    const rotateSpeed = 0.02; // 낮을수록 느림

    const timer = d3.timer(() => {
      const currentTime = Date.now();
      const delta = (currentTime - lastTime) / 1000; // 초 단위
      lastTime = currentTime;

      const rotation = projection.rotate();
      rotation[0] += rotateSpeed * delta * 360; // 동쪽으로 회전 (x축 회전)
      projection.rotate(rotation);
      rotationRef.current = rotation;

      g.selectAll("path").attr("d", path);
    });


    return () => {
      svg.selectAll("*").remove();
      tooltip.remove();
    };
  }, [dimensions, selectedCountry, onCountryClick]);

  return (
    <div ref={containerRef} className="globe-wrapper" style={{ width: "100%", height: "100vh" }}>
      <svg ref={svgRef} />
    </div>
  );
};

export default Globe;
