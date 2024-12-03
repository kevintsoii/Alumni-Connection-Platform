import React, { useState } from "react";

function FundraisersPage() {
  const [userType, setUserType] = useState("staff");

  const [fundraisers, setFundraisers] = useState([
    {
      id: 1,
      name: "Community Center Renovation",
      goal: 5000.0,
      description:
        "Help us renovate our community center to provide better services to our neighborhood!",
      ends: "2024-12-31",
      donations: [
        { user: "Alice", amount: 100 },
        { user: "Bob", amount: 50 },
      ],
    },
    {
      id: 2,
      name: "School Supplies for Kids",
      goal: 3000.0,
      description:
        "We are raising funds to provide school supplies to underprivileged children.",
      ends: "2024-11-30",
      donations: [
        { user: "Charlie", amount: 150 },
        { user: "David", amount: 75 },
      ],
    },
  ]);

  const [newFundraiser, setNewFundraiser] = useState({
    name: "",
    goal: "",
    description: "",
    ends: "",
  });
  const [donationAmount, setDonationAmount] = useState("");

  const handleCreateFundraiser = () => {
    if (
      newFundraiser.name.trim() !== "" &&
      newFundraiser.goal.trim() !== "" &&
      newFundraiser.description.trim() !== "" &&
      newFundraiser.ends.trim() !== ""
    ) {
      const newEntry = {
        ...newFundraiser,
        id: fundraisers.length + 1,
        goal: parseFloat(newFundraiser.goal),
        donations: [],
      };
      setFundraisers([newEntry, ...fundraisers]);
      setNewFundraiser({
        name: "",
        goal: "",
        description: "",
        ends: "",
      });
    }
  };

  const handleDonate = (id) => {
    if (donationAmount.trim() !== "" && parseFloat(donationAmount) > 0) {
      setFundraisers((prevFundraisers) =>
        prevFundraisers.map((fundraiser) =>
          fundraiser.id === id
            ? {
                ...fundraiser,
                donations: [
                  ...fundraiser.donations,
                  { user: "Anonymous", amount: parseFloat(donationAmount) },
                ],
              }
            : fundraiser
        )
      );
      setDonationAmount("");
    }
  };

  function renderNewFundraiserForm() {
    if (userType === "staff") {
      return (
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Fundraiser Name"
            value={newFundraiser.name}
            onChange={(e) =>
              setNewFundraiser({ ...newFundraiser, name: e.target.value })
            }
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Goal Amount"
            value={newFundraiser.goal}
            onChange={(e) =>
              setNewFundraiser({ ...newFundraiser, goal: e.target.value })
            }
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Fundraiser Description"
            value={newFundraiser.description}
            onChange={(e) =>
              setNewFundraiser({
                ...newFundraiser,
                description: e.target.value,
              })
            }
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            placeholder="End Date"
            value={newFundraiser.ends}
            onChange={(e) =>
              setNewFundraiser({ ...newFundraiser, ends: e.target.value })
            }
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateFundraiser}
            className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
          >
            Add Fundraiser
          </button>
        </div>
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Fundraisers</h1>
        {renderNewFundraiserForm()}

        {fundraisers.map((fundraiser) => (
          <div
            key={fundraiser.id}
            className="bg-[#fbfbf9] rounded-lg shadow-md p-4 mt-4"
          >
            <h3 className="font-semibold text-xl">{fundraiser.name}</h3>
            <p className="text-gray-500 mt-2">
              Goal: ${fundraiser.goal.toFixed(2)}
            </p>
            <p className="text-gray-500">{fundraiser.description}</p>
            <p className="text-gray-500">Ends: {fundraiser.ends}</p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Donation Amount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleDonate(fundraiser.id)}
                className="bg-green-500 text-white rounded-full px-4 py-2 ml-2 hover:bg-green-600"
              >
                Donate
              </button>
            </div>
            {fundraiser.donations.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Top Donations:</h4>
                {fundraiser.donations
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 5)
                  .map((donation, index) => (
                    <p key={index} className="text-gray-500">
                      {donation.user}: ${donation.amount.toFixed(2)}
                    </p>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FundraisersPage;
