import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PythonQuiz from './PythonQuiz.jsx'

// Polyfill window.storage → localStorage
// (The quiz was built for an environment with a custom storage API)
window.storage = {
  get: async (key) => {
    const value = localStorage.getItem(key);
    return value ? { value } : null;
  },
  set: async (key, value) => {
    localStorage.setItem(key, value);
  },
  delete: async (key) => {
    localStorage.removeItem(key);
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PythonQuiz />
  </StrictMode>,
)
