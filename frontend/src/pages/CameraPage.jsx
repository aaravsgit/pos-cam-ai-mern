// CameraPage.jsx
import React from "react";
import TeachableMachine from "../components/TeachableMachine";

export default function CameraPage({ products, addToCart, setActiveTab, activeTab }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Camera</h1>
      <TeachableMachine
        products={products}
        addToCart={addToCart}
        setActiveTab={setActiveTab}
        activeTab={activeTab} // 👈 now TeachableMachine sees tab changes
      />
    </div>
  );
}
