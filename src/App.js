import { useState } from 'react';
import './App.css';
import Home from './components/home';
import { BrowserRouter } from 'react-router-dom';

function App() {

  const [mode, setMode] = useState('dark');

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark')
    }
    else if (mode === 'dark') {
      setMode('light')
    }
  }

  return (
    <>
      <BrowserRouter>
        <Home mode={mode} toggleMode={toggleMode} />
      </BrowserRouter>
    </>
  );
}

export default App;