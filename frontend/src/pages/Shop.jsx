import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function CircleShape() {
  return <div className="shape-circle" />;
}

function StarShape() {
  return (
    <svg className="shape-star" viewBox="0 0 100 100" aria-hidden="true">
      <polygon
        points="50,5 61,37 95,37 67,57 78,90 50,70 22,90 33,57 5,37 39,37"
        fill="#c8ac20"
      />
    </svg>
  );
}

function Tile({ name, price, shape, onAdd }) {
  return (
    <div className="tile" onClick={onAdd}>
      <div className="tile-img">
        {shape === "circle" ? <CircleShape /> : <StarShape />}
      </div>
      <div className="tile-meta">
        <span>{name}</span>
        <span className="price">${(price / 100).toFixed(2)}</span>
      </div>
    </div>
  );
}


export default function Shop() {
  const [activeTab, setActiveTab] = useState("shopping");
  const [cart, setCart] = useState([]);

  const products = [
    { id: "circ", name: "Circle", price: 499, shape: "circle" },
    { id: "star", name: "Star", price: 399, shape: "star" },
  ];

  const addToCart = (p) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="shop-bg">
      <div className="shop-wrap">
        <div className="shop-left">
          <div className="shop-title">Quick Shop</div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === "shopping" ? "active" : ""}`}
              onClick={() => setActiveTab("shopping")}
            >
              Shopping
            </button>
            <button
              className={`tab ${activeTab === "camera" ? "active" : ""}`}
              onClick={() => setActiveTab("camera")}
            >
              Camera
            </button>
          </div>

          {activeTab === "shopping" ? (
            <div className="grid">
              {products.map((p) => (
                <Tile key={p.id} {...p} onAdd={() => addToCart(p)} />
              ))}
              {/* placeholders to match mockup grid */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`ph-${i}`} className="tile tile-empty" />
              ))}
            </div>
          ) : (
            <div className="camera-panel">
              <p>Camera preview goes here.</p>
              <Link to="/camera" className="link-btn">Open full Camera screen →</Link>
            </div>
          )}
        </div>

        <div className="shop-right">
          <div className="checkout-card">
            <div className="checkout-head">Checkout</div>
            <div className="checkout-body">
              {cart.length === 0 ? (
                <div className="muted">Your cart is empty</div>
              ) : (
                cart.map((i) => (
                  <div key={i.id} className="row">
                    <span>{i.name} x {i.qty}</span>
                    <span>${(i.price * i.qty / 100).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
            <div className="checkout-total">
              <div>Total</div>
              <div>${(total / 100).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
