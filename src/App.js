import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import BeforeOptimization from './components/BeforeOptimization';
import AfterOptimization from './components/AfterOptimization';

function App() {
  const [type, settype] = useState('before');
  return (
    <div className="App">
      <button onClick={() => settype('before')}>
        before list optimization
      </button>
      <button onClick={() => settype('after')}>
        after list optimization
      </button>
      {type === 'before' ?
        <BeforeOptimization />
        :
        <AfterOptimization />
      }
    </div>
  );
}

export default App;
