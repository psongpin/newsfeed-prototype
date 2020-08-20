import React from "react";

import "./styles/main.css";
import ProductHunt from "./components/ProductHunt";
import HackerNews from "./components/HackerNews";
import DevTo from "./components/DevTo";

const App = () => {
  return (
    <div className="app min-h-screen bg-gray-100">
      <div className="container py-24">
        <div className="grid gap-12">
          <ProductHunt />
          <HackerNews />
          <DevTo />
        </div>
      </div>
    </div>
  );
};

export default App;
