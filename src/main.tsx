import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const answerGrid = [
  ['h', null, 'n'],
  ['h', 'i', 'n'],
  ['h', 'i', 'n'],
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App answerGrid={answerGrid} />
  </StrictMode>
);
