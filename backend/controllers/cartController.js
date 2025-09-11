let carts = {}; // simple in-memory cart per user (not persistent)

export const getCart = (req, res) => {
  const userId = req.userId; // from auth middleware
  res.json(carts[userId] || []);
};

export const addToCart = (req, res) => {
  const userId = req.userId;
  const { itemId, quantity } = req.body;

  if (!carts[userId]) carts[userId] = [];
  const cart = carts[userId];

  const existing = cart.find(i => i.itemId === itemId);
  if (existing) existing.quantity += quantity;
  else cart.push({ itemId, quantity });

  res.json(cart);
};

export const removeFromCart = (req, res) => {
  const userId = req.userId;
  const { itemId } = req.body;
  if (!carts[userId]) return res.json([]);
  
  carts[userId] = carts[userId].filter(i => i.itemId !== itemId);
  res.json(carts[userId]);
};
