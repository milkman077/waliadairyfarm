"use client";
import React from "react";
import AddressForm from "../../components/address-form";

function MainComponent() {
  const [step, setStep] = useState("address");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const dummyCart = [
      {
        id: 1,
        name: <span className="text-[#0047AB]">6.5% Fat Milk</span>,
        price: 81.99,
        quantity: 2,
      },
      {
        id: 2,
        name: <span className="text-[#0047AB]">7% Fat Milk</span>,
        price: 85.99,
        quantity: 1,
      },
    ];
    setCart(dummyCart);
    setTotal(
      dummyCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 0) {
      const updatedCart = cart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      setTotal(
        updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      );
    }
  };
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const addressData = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      street: formData.get("street"),
      city: formData.get("city"),
      pinCode: formData.get("pinCode"),
    };

    setAddress(addressData);
    setStep("payment");
    setLoading(false);
  };
  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "inr",
          address,
          items: cart,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      const { clientSecret } = await response.json();
      alert("Order placed successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6 space-x-4">
        <button
          onClick={() => (window.location.href = "/milk-selling")}
          className="flex items-center text-[#1a237e] hover:text-[#0d1453] transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            />
          </svg>
          Back to Home
        </button>
      </div>
      <h1 className="text-3xl font-bold text-[#1a237e] mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-grow">
                <h3 className="font-medium">{item.name}</h3>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#1a237e] text-[#1a237e] hover:bg-[#1a237e] hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="mx-3 min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#1a237e] text-[#1a237e] hover:bg-[#1a237e] hover:text-white transition-colors"
                  >
                    +
                  </button>
                  <span className="ml-4">
                    <span className="text-[#FF0000]">₹</span>
                    {item.price} per litre
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-medium">
                  <span className="text-[#FF0000]">₹</span>
                  {(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  for {item.quantity} {item.quantity === 1 ? "litre" : "litres"}
                </p>
              </div>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-bold">
              <p>Total</p>
              <div className="text-right">
                <p>
                  <span className="text-[#FF0000]">₹</span>
                  {total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  for {cart.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  {cart.reduce((sum, item) => sum + item.quantity, 0) === 1
                    ? "litre"
                    : "litres"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {step === "address" ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <AddressForm onSubmit={handleAddressSubmit} loading={loading} />
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium">Delivery Address</h3>
                <p className="text-sm text-gray-600">{address.fullName}</p>
                <p className="text-sm text-gray-600">{address.street}</p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.pinCode}
                </p>
                <p className="text-sm text-gray-600">{address.phone}</p>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#1a237e] text-white py-2 px-4 rounded-md hover:bg-[#0d1453] transition-colors duration-300 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Pay ₹" + total}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MainComponent;