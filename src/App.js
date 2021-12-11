import './App.css';
import { useState } from 'react';
import { getTimelineData } from './utils/getData';
import { useInterval } from './utils/hook';
import Timeline from "./components/Chart/Timeline";

function App() {
  const [data, setData] = useState(getTimelineData());
  useInterval(() => {
    setData(getTimelineData())
  }, 4000)
  return (
    <div className="App">
      <h1>d3 timeline by react</h1>
      <Timeline
        data={ data }
      />
    </div>
  );
}

export default App;