import { StrictMode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from './components/app/app.jsx';
import { store } from './services/store.js';

import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </Provider>
  </StrictMode>
);
