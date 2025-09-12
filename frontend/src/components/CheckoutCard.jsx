export default function CheckoutCard({ cart, total, onCheckout }) {
  return (
    <div className="flex-1 border border-gray-300 rounded-lg p-4 min-w-[200px] h-fit shadow-sm bg-white text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 mb-4">No items in cart</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {cart.map((p) => (
            <li key={p._id} className="flex justify-between text-sm">
              <span>{p.name} x {p.quantity}</span>
              <span className="font-medium">${(p.price * p.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-lg font-bold mb-4">Total: ${total.toFixed(2)}</h3>

      <button
        onClick={onCheckout}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
      >
        Checkout
      </button>
    </div>
  );
}
