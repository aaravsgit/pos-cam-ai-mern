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

