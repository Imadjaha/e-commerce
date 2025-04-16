import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function CartItem({ item, onIncrease, onDecrease, onDelete }) {
  const product = item.productId;
  
  if(!product) return <p>Loading product...</p>;

  function generateRandomShippingDate(minDays = 0, maxDays = 2) {
    const randomDays =
      Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + randomDays);
    return randomDate;
  }

  // Generate start and end shipping dates
  const startShippingDate = generateRandomShippingDate(1, 3); // Random between today and 2 days from today
  const endShippingDate = generateRandomShippingDate(4, 8); // Random between 3 to 5 days from today

  const totalProductPrice = (product?.price || 0 * item.quantity).toFixed(2);

  const imageSrc = product.images?.[0]
    ? product.images[0].startsWith("http")
      ? product.images[0]
      : `http://localhost:3000/${product.images[0]}`
    : "/default-image.jpg"; // Replace with your default image URL

  return (
    <div className="flex border-b border-gray-300 py-4 gap-4">
      <img
        src={imageSrc}
        alt={product.productName}
        className="w-full max-w-[180px] object-contain"
      />
      <div className="flex flex-col flex-1 gap-2">
        <h3 className="text-lg font-semibold">{product.productName}</h3>

        <p className="text-xs text-orange-600 mt-1">
          {startShippingDate.toLocaleDateString()} -{" "}
          {endShippingDate.toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500">FREE International Returns</p>
        <label className="flex items-center gap-2 mt-2 text-sm">
          <input type="checkbox" />
          This is a gift
        </label>

        <div className="flex items-center mt-3 gap-4 text-sm">
          <div className="flex items-center border border-gray-300 shadow rounded">
            <button
              onClick={onDecrease}
              className="px-2 text-xl cursor-pointer"
            >
              {item.quantity === 1 ? (
                <DeleteForeverIcon
                  sx={{
                    color: "red",
                    fontSize: 20,
                    marginBottom: 0.2,
                    cursor: "pointer",
                  }}
                />
              ) : (
                "-"
              )}
            </button>
            <span className="px-2">{item.quantity}</span>
            <button
              onClick={onIncrease}
              className="px-2 text-xl cursor-pointer"
            >
              ＋
            </button>
          </div>
          <button
            onClick={onDelete}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="text-right font-semibold text-lg">
        ${totalProductPrice}
      </div>
    </div>
  );
}

export default CartItem;
