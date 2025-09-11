import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Tile({ name, price, emoji, onAdd }) {
  return (
    <div className="tile" onClick={onAdd}>
      <div className="tile-img">
        <span className="tile-emoji" aria-hidden="true">{emoji}</span>
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

  // Real grocery items
  const products = [
    { id: "milk",    name: "Whole Milk (1 gal)",   price: 449, emoji: "🥛" },
    { id: "eggs",    name: "Eggs (12 ct)",         price: 329, emoji: "🥚" },
    { id: "bread",   name: "Sandwich Bread",       price: 299, emoji: "🍞" },
    { id: "bananas", name: "Bananas (1 lb)",       price: 139, emoji: "🍌" },
    { id: "apples",  name: "Apples (3 lb bag)",    price: 499, emoji: "🍎" },
    { id: "cereal",  name: "Cereal (box)",         price: 529, emoji: "🥣" },
    { id: "chips",   name: "Potato Chips",         price: 349, emoji: "🍟" },
    { id: "soda",    name: "Soda (12 oz)",         price: 149, emoji: "🥤" },
    { id: "water",   name: "Bottled Water (1 L)",  price: 129, emoji: "💧" },
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
