// src/App.js
import React from "react";
import TranslationCard from "./components/Translation/TranslationCard";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">한중 번역기</h1>
        <p className="text-gray-600 mt-2">
          텍스트 입력이나 음성 인식으로 번역하세요
        </p>
      </header>
      <main>
        <TranslationCard />
      </main>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Speech Recognition & Translation Service</p>
      </footer>
    </div>
  );
}

export default App;
