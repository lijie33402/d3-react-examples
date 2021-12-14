import React, { useRef, useEffect } from "react";
import { useResizeObserver, usePrevious } from '../../utils/hook';
import { select, hierarchy, tree, linkHorizontal } from "d3";
import './TreeChart.css';

const TreeChart = ({ data }) => {
  console.log('render treechart');
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef, {
    marginLeft: 30,
    marginTop: 0
  });
  // 存储上次数据
  const previouslyRenderedData = usePrevious(data);
  // mounted和每次依赖数据更新时候刷新树图
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    const svg = select(svgRef.current);
    const { boundedWidth, boundedHeight } = dimensions;
    // transform hierarchical data
    const root = hierarchy(data);
    const treeLayout = tree().size([boundedHeight, boundedWidth]);

    const linkGenerator = linkHorizontal()
      .x(link => link.y)
      .y(link => link.x);

    // enrich hierarchical data with coordinates
    treeLayout(root);
    // 这两个数据可用作后面自定义dom提升性能
    // console.log("descendants", root.descendants());
    // console.log("links", root.links());
    const gContainer = svg.select('g');
    // nodes
    gContainer
      .selectAll(".node")
      .data(root.descendants())
      .join(enter => enter.append("circle").attr("opacity", 0))
      .attr("class", "node")
      .attr("cx", node => node.y)
      .attr("cy", node => node.x)
      .attr("r", 4)
      .transition()
      .duration(500)
      .delay(node => node.depth * 300)
      .attr("opacity", 1);

    // links
    const enteringAndUpdatingLinks = gContainer
      .selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("d", linkGenerator)
      .attr("stroke-dasharray", function() {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr("stroke", "black")
      .attr("fill", "none");
    // 只有数据变化的时候link会来一个动画从父到子逐级刷新，如果只是容器大小变化则不触发动画。
    if (data !== previouslyRenderedData) {
      enteringAndUpdatingLinks
        .attr("stroke-dashoffset", function() {
          return this.getTotalLength();
        })
        .transition()
        .duration(500)
        .delay(link => link.source.depth * 500)
        .attr("stroke-dashoffset", 0);
    }

    // labels
    gContainer
      .selectAll(".label")
      .data(root.descendants())
      .join(enter => enter.append("text").attr("opacity", 0))
      .attr("class", "label")
      .attr("x", node => node.y)
      .attr("y", node => node.x - 12)
      .attr("text-anchor", "middle")
      .attr("font-size", 24)
      .text(node => node.data.name)
      .transition()
      .duration(500)
      .delay(node => node.depth * 300)
      .attr("opacity", 1);
  }, [data, dimensions, previouslyRenderedData]);
  return (
    <div className='tree-chart wrapper' ref={wrapperRef}>
      <svg ref={svgRef}>
        <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>
        </g>
      </svg>
    </div>
  )
}

export default TreeChart;