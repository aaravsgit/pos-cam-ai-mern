export default function ProductCard({ product, onAdd }) {
  const { name, price, imageUrl } = product;

  return (
    <div
      onClick={onAdd}
      className="cursor-pointer rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition flex flex-col"
    >
      {/* Image on top */}
      <img
        src={imageUrl ?? "https://via.placeholder.com/200"}
        alt={name}
        className="w-full h-40 object-cover"
      />

      {/* Text content below */}
      <div className="p-4 text-gray-800 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-md font-bold">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}
