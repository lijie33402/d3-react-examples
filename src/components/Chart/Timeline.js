import { useChartDimensions } from './utils.js';
import * as d3 from 'd3';
import { useRef } from 'react';
import './Timeline.css';

const Timeline = ({ data }) => {
  const [ref, dimensions] = useChartDimensions();
  const dateParser = d3.timeParse("%m/%d/%Y");
  const xAccessor = d => dateParser(d.date);
  const yAccessor = d => d.temperature;

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth]);
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)));

  const pathStyle = {
    fill: 'none',
    stroke: '#af9358',
    strokeWidth: 2
  };

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale);
  const yAxisGenerator = d3.axisLeft()
    .scale(yScale);
  const xRef = useRef();
  const yRef = useRef();
  if (xRef.current) {
    d3.select(xRef.current)
      .transition()
      .call(xAxisGenerator)
  }
  if (yRef.current) {
    d3.select(yRef.current)
      .transition()
      .call(yAxisGenerator)
  }
  return (
    <div className="time-line" ref={ref}>
      <svg className="chart" width={dimensions.width} height={dimensions.height}>
        <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>
        <path
          className="line"
          style={pathStyle}
          d={lineGenerator(data)}
        />
        <g className="x-axis" ref={xRef} transform={`translate(0, ${dimensions.boundedHeight})`}></g>
        <g className="y-axis" ref={yRef}></g>
        </g>
      </svg>
    </div>
  )
}

export default Timeline;