import mongoose from "mongoose";

const status = ["pending", "delivered", "cancelled", "shipped"];

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total_price: { type: Number, required: true },
    status: { type: String, required: true, enum: status, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
