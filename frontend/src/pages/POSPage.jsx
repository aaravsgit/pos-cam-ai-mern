import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getItems, checkout } from "../services/api";

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getItems();
      setProducts(data);
    }
    fetchData();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p._id === product._id);
      if (existing) {
        return prevCart.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    const coupon = prompt("Enter a coupon code (or leave blank):");

    try {
      const result = await checkout(cart, coupon);
      alert(
        `Checkout successful!\nTotal: $${result.total.toFixed(
          2
        )}\nDiscount applied: $${result.discount.toFixed(2)}`
      );
      setCart([]);
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>POS System</h1>
      <div
        style={{
        display: "flex",
        justifyContent: "space-between", // pushes left column left & right column right
        alignItems: "flex-start",
        paddingLeft: "15px",
        paddingRight: "15px",
        width: "100%",
        boxSizing: "border-box",
        }}
      >
        {/* Left: Products */}
        <div style={{ flex: 2, marginRight: "15px" }}>
          <h2>Products</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onAdd={() => addToCart(p)} />
            ))}
          </div>
        </div>

        {/* Right: Cart */}
        <div
          style={{
          flex: 1,
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            minWidth: "200px",
            height: "fit-content",
          }}
        >
          <h2>Cart</h2>
          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <ul>
              {cart.map((p) => (
                <li key={p._id}>
                  {p.name} x {p.quantity} - ${(p.price * p.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
          )}
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={handleCheckout} style={{ marginTop: "10px" }}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
