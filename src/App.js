import './App.css';
import Home from './components/home';
import useLocalStorage from 'use-local-storage';
import { BrowserRouter } from 'react-router-dom';

function App() {

  const [isDark, setIsDark] = useLocalStorage('isDark', true)

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <>
      <BrowserRouter>
        <Home isDark={isDark} toggleTheme={toggleTheme} />
      </BrowserRouter>
    </>
  );
}

export default App;