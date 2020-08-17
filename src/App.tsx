import React from "react";

import "./styles/main.css";
import ProductHunt from "./components/ProductHunt";

const App = () => {
  return (
    <div className="app min-h-screen bg-gray-100">
      <div className="container py-24">
        <ProductHunt />
      </div>
    </div>
  );
};

export default App;
