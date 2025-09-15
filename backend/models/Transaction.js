import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  items: [
    {
      itemId: String,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Fix OverwriteModelError:
export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
