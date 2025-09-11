import Item from "../models/Item.js";
import Transaction from "../models/Transaction.js";

export const checkout = async (req, res) => {
  try {
    const { items } = req.body; // [{ itemId, quantity }]
    let total = 0;
    const transactionItems = [];

    for (let cartItem of items) {
      const dbItem = await Item.findOne({ itemId: cartItem.itemId });
      if (!dbItem || dbItem.quantity < cartItem.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${cartItem.itemId}` });
      }
      dbItem.quantity -= cartItem.quantity;
      await dbItem.save();

      total += dbItem.price * cartItem.quantity;
      transactionItems.push({
        itemId: dbItem.itemId,
        name: dbItem.name,
        price: dbItem.price,
        quantity: cartItem.quantity
      });
    }

    const transaction = new Transaction({ items: transactionItems, totalPrice: total });
    await transaction.save();

    res.json({ message: "Checkout successful", transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
