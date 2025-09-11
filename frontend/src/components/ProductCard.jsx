export default function ProductCard({ product, onAdd }) {
  const { name, price, imageUrl } = product;

  return (
    <div
      onClick={onAdd}
      style={{
        border: "1px solid #ccc",
        padding: 10,
        width: 200,
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <img
        src={imageUrl ?? "https://via.placeholder.com/150"}
        alt={name}
        style={{ width: 100, height: 100, objectFit: "cover" }}
      />
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>
    </div>
  );
}
