import { useState } from "react";

function ProductCard({ name, price, onAdd }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "5px" }}>
      <h3>{name}</h3>
      <p>${(price / 100).toFixed(2)}</p>
      <button onClick={onAdd}>Add to Cart</button>
    </div>
  );
}

export default function App() {
  const products = [
    { id: 1, name: "Water Bottle", price: 299 },
    { id: 2, name: "Notebook", price: 499 },
    { id: 3, name: "Coffee Mug", price: 799 },
  ];

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>POS System</h1>
      <h2>Products</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            name={p.name}
            price={p.price}
            onAdd={() => addToCart(p)}
          />
        ))}
      </div>
      <h2>Cart</h2>
      <ul>
        {cart.map((p, i) => (
          <li key={i}>{p.name} - ${(p.price / 100).toFixed(2)}</li>
        ))}
      </ul>
      <h3>Total: ${(total / 100).toFixed(2)}</h3>
    </div>
  );
}
