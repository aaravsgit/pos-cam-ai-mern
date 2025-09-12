export default function ProductCard({ product, onAdd }) {
  const { name, price, imageUrl } = product;

  return (
    <div
      onClick={onAdd}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: 10,
        width: "100%",
         maxWidth: 150,          // smaller max width
        aspectRatio: "1 / 1",
        textAlign: "center",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <img
        src={imageUrl ?? "https://via.placeholder.com/150"}
        alt={name}
        style={{
          width: "100%",
          height: "70%", // image takes 70% of card height
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
      <div>
        <h3 style={{ margin: "5px 0" }}>{name}</h3>
        <p style={{ margin: 0 }}>${price.toFixed(2)}</p>
      </div>
    </div>
  );
}
