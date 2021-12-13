import './App.css';
import { useState } from 'react';
import { getTimelineData, getScatterData } from './utils/getData';
import { useInterval } from './utils/hook';
import Timeline from "./components/Chart/Timeline";
import ScatterPlot from "./components/Chart/ScatterPlot";

function App() {
  console.log('render app')
  const getData = () => ({
    timeline: getTimelineData(),
    scatter: getScatterData(),
  })
  const [data, setData] = useState(getData());
  useInterval(() => {
    setData(getData());
  }, 4000)
  return (
    <div className="App">
      <h1>d3 timeline by react</h1>
      <Timeline
        data={ data.timeline }
      />
      <h1>d3 scatterplot by react</h1>
      <ScatterPlot
        data={ data.scatter }
      />
    </div>
  );
}

export default App;