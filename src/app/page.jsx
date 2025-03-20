"use client";
import React from "react";

function MainComponent() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [milkProducts, setMilkProducts] = useState([
    {
      id: 1,
      name: <span className="text-[#0047AB]">6.5% Fat Milk</span>,
      price: (
        <span>
          <span className="text-[#FF0000]">₹</span>81.99 per litre
        </span>
      ),
      description: "Premium milk with 6.5% fat content",
      image:
        "https://ucarecdn.com/e67631b0-39ad-424d-a62b-11eb16090d9f/-/format/auto/",
    },
    {
      id: 2,
      name: <span className="text-[#0047AB]">7% Fat Milk</span>,
      price: (
        <span>
          <span className="text-[#FF0000]">₹</span>85.99 per litre
        </span>
      ),
      description: "Rich and creamy milk with 7% fat content",
      image:
        "https://ucarecdn.com/e67631b0-39ad-424d-a62b-11eb16090d9f/-/format/auto/",
    },
    {
      id: 3,
      name: <span className="text-[#0047AB]">7.5% Fat Milk</span>,
      price: (
        <span>
          <span className="text-[#FF0000]">₹</span>90.99 per litre
        </span>
      ),
      description: "Extra rich milk with 7.5% fat content",
      image:
        "https://ucarecdn.com/e67631b0-39ad-424d-a62b-11eb16090d9f/-/format/auto/",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImagesAndDescriptions = async () => {
      try {
        const imagePrompts = [
          "professional+food+photography+of+a+glass+of+creamy+milk+on+marble+counter,+soft+lighting,+high+end+restaurant+style",
          "luxurious+glass+of+rich+creamy+milk+with+smooth+texture,+professional+food+photography,+white+background",
          "premium+glass+of+extra+rich+milk+with+creamy+texture,+elegant+food+photography,+minimalist+style",
        ];
        const imageResponses = await Promise.all(
          imagePrompts.map(async (prompt) => {
            try {
              const response = await fetch(
                `/integrations/stable-diffusion-v-3/?prompt=${prompt}`
              );
              if (!response.ok) throw new Error("Image generation failed");
              return response;
            } catch (err) {
              console.error("Error fetching image:", err);
              return null;
            }
          })
        );
        const validResponses = imageResponses.filter((r) => r !== null);
        if (validResponses.length === 0) {
          throw new Error("Failed to fetch images");
        }
        const imageResults = await Promise.all(
          validResponses.map((res) => res.json())
        );
        const enhancedProducts = await Promise.all(
          milkProducts.map(async (product, index) => {
            const messages = [
              {
                role: "system",
                content:
                  "You are a dairy product expert. Generate a short, appealing description for a milk product that highlights its fat content and quality.",
              },
              {
                role: "user",
                content: `Write a compelling 15-word description for ${product.name} that emphasizes its richness and quality.`,
              },
            ];

            try {
              const descriptionResponse = await fetch(
                "/integrations/chat-gpt/conversationgpt4",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ messages }),
                }
              );

              if (!descriptionResponse.ok) {
                throw new Error("Failed to fetch description");
              }

              const descriptionData = await descriptionResponse.json();
              const enhancedDescription =
                descriptionData.choices[0].message.content;

              return {
                ...product,
                image: imageResults[index]?.data?.[0] || product.image,
                description: enhancedDescription,
              };
            } catch (error) {
              console.error("Error fetching description:", error);
              return product;
            }
          })
        );

        setMilkProducts(enhancedProducts);
      } catch (err) {
        console.error(err);
        setError("Could not load product information");
      } finally {
        setLoading(false);
      }
    };

    fetchImagesAndDescriptions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-[#0047AB]">Loading products...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="fixed inset-0 bg-gradient-to-b from-amber-50 to-white -z-20" />
          <div
            className="fixed inset-0 pointer-events-none opacity-5 -z-10"
            style={{
              backgroundImage:
                'url("https://ucarecdn.com/e67631b0-39ad-424d-a62b-11eb16090d9f/-/format/auto/")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
              filter: "grayscale(1)",
            }}
          />
          <div className="relative z-10">
            <div className="mb-12 text-left">
              <div className="inline-block bg-white p-6 rounded-2xl shadow-lg">
                <img
                  src="https://ucarecdn.com/e67631b0-39ad-424d-a62b-11eb16090d9f/-/format/auto/-/quality/smart_retina/-/format/auto/"
                  alt="Walia Dairy Farms Logo"
                  className="w-48 md:w-64 transform hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                />
              </div>
            </div>
            <div className="text-left pl-0 mb-16">
              <h1 className="text-[#0047AB] text-5xl md:text-7xl font-bold mb-6">
                Walia Dairy Farms
                <br />
                <span className="text-[#0047AB] text-2xl md:text-3xl font-medium tracking-wide block mt-4">
                  From Our Farm to Your Table
                </span>
              </h1>
              <p className="text-[#FF0000] text-3xl md:text-4xl font-semibold mb-10 transform hover:scale-105 transition-transform duration-300">
                Delivered Daily
              </p>
              <button className="bg-[#0047AB] hover:bg-[#003380] text-white px-8 py-4 rounded-md transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Shop Now
              </button>
              <blockquote className="mt-10 text-xl italic font-serif text-[#8B4513] max-w-md">
                "Milk is nature's most perfect food, delivering nutrition and
                strength in its purest form."
                <p className="mt-2 text-sm text-[#8B4513]">
                  - Ancient Dairy Wisdom
                </p>
              </blockquote>
            </div>
            <div>
              <h2 className="text-[#0047AB] text-2xl font-bold mb-8">
                Our Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {milkProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <img
                      src={product.image}
                      alt={`Image of ${product.name}`}
                      className="w-full h-[200px] object-cover mb-4 rounded-md"
                    />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description}
                    </p>
                    <p className="text-gray-600 mb-2">{product.price}</p>
                    <button
                      onClick={() => {
                        setCartCount(cartCount + 1);
                        setQuantities({
                          ...quantities,
                          [product.id]: (quantities[product.id] || 0) + 1,
                        });
                      }}
                      className="bg-[#0047AB] hover:bg-[#003380] text-white px-4 py-2 rounded-md transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div
              onClick={() => (window.location.href = "/checkout")}
              className="fixed top-4 right-4 bg-[#0047AB] text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-[#003380] transition-colors duration-300"
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MainComponent;