// src/App.js
import React from "react";
import TranslationCard from "./components/Translation/TranslationCard";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="main-title">한중 번역기</h1>
      </header>
      <main className="main-content">
        <TranslationCard />
      </main>
      <footer className="footer">
        <p>Speech Recognition & Translation Service</p>
      </footer>
    </div>
  );
}

export default App;
