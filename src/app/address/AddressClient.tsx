"use client";

import { useState, useEffect } from "react";


export default function AddressClient(){

  const [addresses, setAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("addresses") || "[]");

    setAddresses(stored);
  }, []);

  function addAddress() {

    if (!newAddress.trim()) return;

    const updated = [...addresses, newAddress];

    setAddresses(updated);

    localStorage.setItem(
      "addresses",
      JSON.stringify(updated)
    );

    setNewAddress("");
  }

  function removeAddress(index: number) {

    const updated = addresses.filter(
      (_, i) => i !== index
    );

    setAddresses(updated);

    localStorage.setItem(
      "addresses",
      JSON.stringify(updated)
    );
  }

  return (
    <main className="min-h-screen bg-white py-10 pb-24">

      <div className="max-w-md mx-auto px-6">

        <h1 className="text-xl font-semibold mb-6">
          Saved Addresses
        </h1>

        {/* ADD ADDRESS */}
        <div className="flex gap-2 mb-6">

          <input
            value={newAddress}
            onChange={(e) =>
              setNewAddress(e.target.value)
            }
            placeholder="Add new address"
            className="flex-1 border px-4 py-2 rounded-lg"
          />

          <button
            onClick={addAddress}
            className="bg-black text-white px-4 rounded-lg"
          >
            Add
          </button>

        </div>

        {/* ADDRESS LIST */}
        <div className="space-y-3">

          {addresses.length === 0 && (
            <p className="text-sm text-gray-500">
              No saved addresses yet.
            </p>
          )}

          {addresses.map((addr, index) => (

            <div
              key={index}
              className="border rounded-lg p-4 flex justify-between"
            >
              <span className="text-sm">
                {addr}
              </span>

              <button
                onClick={() => removeAddress(index)}
                className="text-red-500 text-xs"
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}