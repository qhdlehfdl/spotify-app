import React, { useRef, useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

const CollaborationGraph = ({ main, data }) => {
  const containerRef = useRef();
  const fgRef = useRef();

  const [dimensions, setDimensions] = useState({ width: 0, height: 500 });

  // 부모 div 크기 관찰 (ResizeObserver 사용)
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({
        width: width,
        height: height > 0 ? height : 500,
      });
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (data && fgRef.current) {
      setTimeout(() => {
        fgRef.current
          .d3Force("link")
          .distance((link) => 100 + (link.count || 1) * 15);
      }, 200);
    }
  }, [data]);

  if (!data) return null;

  const nodeCollabCounts = (() => {
    const counts = {};
    data.nodes.forEach((node) => {
      counts[node.id] = 0;
    });
    data.links.forEach((link) => {
      const sourceId =
        typeof link.source === "object" ? link.source.id : link.source;
      const targetId =
        typeof link.target === "object" ? link.target.id : link.target;
      counts[sourceId] = (counts[sourceId] || 0) + link.count;
      counts[targetId] = (counts[targetId] || 0) + link.count;
    });
    return counts;
  })();

  const computeNodeValues = () => {
    return (node) =>
      node.id === main ? 15 : (nodeCollabCounts[node.id] || 1) * 10;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "60vh", // 반응형 높이 (뷰포트 60%)
        backgroundColor: "#121212",
        borderRadius: "12px",
        boxSizing: "border-box",
      }}
    >
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeAutoColorBy="id"
        nodeLabel={(node) =>
          `${node.id}<br>Collaborations: ${nodeCollabCounts[node.id] || 0}`
        }
        nodeVal={computeNodeValues()}
        linkWidth={(link) => Math.min(10, link.count)}
        backgroundColor="#121212"
        linkColor={() => "white"}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "white";
          ctx.fillText(label, node.x, node.y);
        }}
        nodeCanvasObjectMode={() => "after"}
      />
    </div>
  );
};

export default CollaborationGraph;
