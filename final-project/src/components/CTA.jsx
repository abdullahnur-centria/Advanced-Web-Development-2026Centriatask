export default function CTA() {
  const viewRentals = () => {
    alert("Redirecting to rentals page...");
  };

  return (
    <div className="cta">
      <h2>Ready to Ride?</h2>
      <p>Explore the city like never before. Click below to see our rental options!</p>
      <button onClick={viewRentals}>See Available Rentals</button>
    </div>
  );
}