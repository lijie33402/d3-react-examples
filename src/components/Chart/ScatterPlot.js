import { useChartDimensions } from './utils.js';
import * as d3 from 'd3';
import './ScatterPlot.css';

const ScatterPlot = ({ data }) => {
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 60
  });
  const xAccessor = d => d.temperature;
  const yAccessor = d => d.humidity;

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))

  const xLabel = '温度';
  const yLabel = '湿度';
  return (
    <div className="scatter-plot wrapper" ref={ref}>
      <svg className="chart" width={dimensions.width} height={dimensions.height}>
        <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>
          <Circles data={data} xAccessorScaled={xAccessorScaled} yAccessorScaled={yAccessorScaled} />
          <XAxis dimensions={dimensions} xScale= {xScale} label={xLabel} />
          <YAxis dimensions={dimensions} yScale= {yScale} label={yLabel} />
        </g>
      </svg>
    </div>
  )
}

// 不用d3直接生成坐标轴，而是dom自己写，借用d3的方法来生成。
const XAxis = ({ dimensions, xScale, formatTick, label }) => {
  const ticks = xScale.ticks();
  return (
    <g className="x-axis" transform={`translate(0, ${dimensions.boundedHeight})`}>
      <line
        className="x-axis-line"
        x2={dimensions.boundedWidth}
      />

      {ticks.map((tick, i) => (
        <text
          key={tick}
          className="x-axis-text"
          transform={`translate(${xScale(tick)}, 25)`}
        >
          { formatTick ? formatTick(tick) : tick }
        </text>
      ))}

      {label && (
        <text
          className="x-axis-label"
          transform={`translate(${dimensions.boundedWidth / 2}, 50)`}
        >
          { label }
        </text>
      )}
    </g>
  )
}

// 不用d3直接生成坐标轴，而是dom自己写，借用d3的方法来生成。
const YAxis = ({ dimensions, yScale, formatTick, label }) => {
  const ticks = yScale.ticks();
  return (
    <g className="y-axis">
      <line
        className="y-axis-line"
        y2={dimensions.boundedHeight}
      />

      {ticks.map((tick, i) => (
        <text
          key={tick}
          className="y-axis-text"
          transform={`translate(-25, ${yScale(tick)})`}
        >
          { formatTick ? formatTick(tick) : tick }
        </text>
      ))}

      {label && (
        <text
          className="y-axis-label"
          style={{
            transform: `translate(-50, ${dimensions.boundedHeight / 2}px) rotate(-90deg)`
          }}        >
          { label }
        </text>
      )}      
    </g>
  )
}

// 散点
const Circles = ({ data, xAccessorScaled, yAccessorScaled }) => {
  return (
    <>
      {data.map((d, i) => (
        <circle
          key={i}
          className="scatter-plot-circle"
          cx={xAccessorScaled(d)}
          cy={yAccessorScaled(d)}
          r={5}
        >
        </circle>
      ))}
    </>
  )
}



export default ScatterPlot;