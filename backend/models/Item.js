import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
  name: { type: String, required: true },
  itemId: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  imageUrl: { type: String }
});

// Fix OverwriteModelError:
export default mongoose.models.Item || mongoose.model("Item", itemSchema);
