const API_URL = "http://localhost:5000/api"; // adjust if backend runs on another port

export async function getItems() {
  const res = await fetch(`${API_URL}/items`);
  return res.json();
}

export async function checkout(cart) {
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cart }),
  });
  return res.json();
}

export const checkout = async (cart, coupon = "") => {
  const res = await fetch("http://localhost:5000/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart, coupon }),
  });
  if (!res.ok) throw new Error("Checkout failed");
  return res.json();
};
