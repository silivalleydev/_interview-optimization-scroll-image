import './App.css';
import React, { useState } from 'react';
import BeforeOptimization from './components/BeforeOptimization';

const AfterOptimization = React.lazy(() => import('./components/AfterOptimization'))

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
