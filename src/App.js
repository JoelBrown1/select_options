import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <div className="app-shell__body">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
