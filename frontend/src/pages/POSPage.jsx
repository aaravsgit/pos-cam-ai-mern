import { useEffect, useState } from "react";
import { getItems, checkout } from "../services/api";
import CameraPage from "./CameraPage"; // 👈 import it

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("products");

  const productMap = {
    Water: products.find(p => p.name === "Water"),
    Duck: products.find(p => p.name === "Duck")
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getItems();
      setProducts(data);
    }
    fetchData();
  }, []);

const addToCart = (product) => {
  // Add item to cart
  setCart((prevCart) => {
    const existing = prevCart.find((p) => p._id === product._id);
    if (existing) {
      return prevCart.map((p) =>
        p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
      );
    }
    return [...prevCart, { ...product, quantity: 1 }];
  });

  // Announce the product name
  speak(product.name);
};

// Helper function for speech
const speak = (text) => {
  const synth = window.speechSynthesis;
  if (!synth.speaking) {
    synth.speak(new SpeechSynthesisUtterance(text));
  }
};


  const removeFromCart = (productId) =>
    setCart((prevCart) => prevCart.filter((p) => p._id !== productId));

  const updateQuantity = (productId, quantity) =>
    setCart((prevCart) =>
      prevCart.map((p) =>
        p._id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    );

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
    <div className="w-full p-5">
      {/* Banner */}
      <div className="w-full flex justify-between items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 text-black font-bold border-b mb-4">
        <div className="px-4">Code For Good</div>
        <div className="text-center flex-1">Non Profit</div>
        <div className="px-4">Prototype</div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4 w-full">
        <button
          className={`px-4 py-2 rounded font-semibold ${
            activeTab === "products"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${
            activeTab === "camera"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("camera")}
        >
          Camera
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && (
        <div className="flex w-full min-h-[80vh] gap-4">
          {/* Products (50%) */}
          <div className="w-1/2 grid grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white text-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center cursor-pointer hover:shadow-xl transition"
                onClick={() => addToCart(p)}
              >
                <img
                  src={p.imageUrl ?? "https://via.placeholder.com/150"}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h2 className="text-xl font-semibold mb-1">{p.name}</h2>
                <p className="text-lg font-bold">${p.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Cart (50%) */}
          <div className="w-1/2 bg-white text-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div className="overflow-y-auto mb-4">
              <h2 className="text-2xl font-semibold mb-4">Cart</h2>
              <table className="w-full text-left border-collapse mb-4">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 px-3">Item</th>
                    <th className="py-4 px-3">Qty</th>
                    <th className="py-4 px-3">Price</th>
                    <th className="py-4 px-3">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="py-3 px-3">{item.name}</td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item._id, parseInt(e.target.value))
                          }
                          className="w-20 border rounded px-2 py-1 text-gray-800"
                        />
                      </td>
                      <td className="py-3 px-3">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total + Checkout */}
            <div className="flex justify-between items-center font-bold text-lg mb-4">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

        {activeTab === "camera" && (
            <CameraPage
          products={products}
          addToCart={addToCart}
          setActiveTab={setActiveTab}
          activeTab={activeTab} // 👈 pass activeTab
        />
        )}
    </div>
  );
}
