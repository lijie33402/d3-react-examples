import './App.css';
import { useState } from 'react';
import { getTimelineData, getScatterData } from './utils/getData';
import { useInterval } from './utils/hook';
import Timeline from "./components/Chart/Timeline";
import ScatterPlot from "./components/Chart/ScatterPlot";

function App() {
  const [tData, setTData] = useState(getTimelineData());
  const [sData, setSData] = useState(getScatterData());
  useInterval(() => {
    setTData(getTimelineData());
    setSData(getScatterData());
  }, 4000)
  return (
    <div className="App">
      <h1>d3 timeline by react</h1>
      <Timeline
        data={ tData }
      />
      <h1>d3 scatterplot by react</h1>
      <ScatterPlot
        data={ sData }
      />
    </div>
  );
}

export default App;