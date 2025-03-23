import React, { useState } from 'react';

function MainComponent({ onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a237e] focus:ring-[#1a237e]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a237e] focus:ring-[#1a237e]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          name="street"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a237e] focus:ring-[#1a237e]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a237e] focus:ring-[#1a237e]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            PIN Code
          </label>
          <input
            type="text"
            name="pinCode"
            required
            pattern="[0-9]{6}"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a237e] focus:ring-[#1a237e]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1a237e] text-white py-2 px-4 rounded-md hover:bg-[#0d1453] transition-colors duration-300 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Continue to Payment"}
      </button>
    </form>
  );
}

function StoryComponent() {
  // Make sure useState is correctly imported
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate a form submission process
    setTimeout(() => {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      console.log("Form submitted with:", data);
      setLoading(false); // Reset loading after form submission is done
    }, 2000); // Simulate network delay
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Default State</h2>
        <MainComponent onSubmit={handleSubmit} loading={loading} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Loading State</h2>
        <MainComponent onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}

// Export the StoryComponent (which uses useState) as default
export default StoryComponent;
