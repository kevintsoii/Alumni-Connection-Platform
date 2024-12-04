import React, { useEffect, useState } from "react";

function FundraisersPage() {
  const token = localStorage.getItem("token");
  const [userType, setUserType] = useState("staff");

  const [fundraisers, setFundraisers] = useState([]);
  const [newFundraiser, setNewFundraiser] = useState({
    name: "",
    goal: "",
    description: "",
    ends: "",
  });
  const [donationAmount, setDonationAmount] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [accessError, setAccesError] = useState("");


  // fetch fundraisers from API
  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const response = await fetch("http://localhost:8000/fundraisers/", {
          method: "GET",
          headers: { Authorization: `${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setFundraisers(data.fundraisers);
        } else {
          setError("Failed to fetch fundraisers. Status: " + response.status);
          setAccesError("You must be logged in.")
        }
      } catch (error) {
        setError("Error fetching fundraisers: " + error.message);
      } finally {
      }
    };

    fetchFundraisers();
  }, []);

  // create new fundraiser
  const handleCreateFundraiser = async () => {
    if (
      newFundraiser.name.trim() !== "" &&
      newFundraiser.goal.trim() !== "" &&
      newFundraiser.description.trim() !== "" &&
      newFundraiser.ends.trim() !== ""
    ) {
      try {
        const payload = {
          name: newFundraiser.name,
          goal: parseFloat(newFundraiser.goal),
          description: newFundraiser.description,
          ends: newFundraiser.ends,
        };

        const response = await fetch("http://localhost:8000/fundraisers/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const createdFundraiser = await response.json();
          setFundraisers([createdFundraiser, ...fundraisers]);
          setNewFundraiser({ name: "", goal: "", description: "", ends: "" });
          setSuccessMessage("Fundraiser created successfully!");
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to create fundraiser.");
        }
      } catch (error) {
        console.error("Error creating fundraiser:", error);
        setError("An error occurred while creating the fundraiser.");
      }
    } else {
      setError("All fields are required.");
    }
  };
  

  const handleDonate = (id) => {
    if (donationAmount[id] && parseFloat(donationAmount[id]) > 0) {
      setFundraisers((prevFundraisers) =>
        prevFundraisers.map((fundraiser) =>
          fundraiser.id === id
            ? {
                ...fundraiser,
                donations: [
                  ...fundraiser.donations,
                  { user: "Anonymous", amount: parseFloat(donationAmount[id]) },
                ],
              }
            : fundraiser
        )
      );
      setDonationAmount((prev) => ({ ...prev, [id]: "" }));
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
        {accessError && (
          <p className="text-red-500 text-center my-4">{accessError}</p>
        )}

        {fundraisers.map((fundraiser) => (
          <div
            key={fundraiser.fundraiserID}
            className="bg-[#fbfbf9] rounded-lg shadow-md p-4 mt-4"
          >
            <h3 className="font-semibold text-xl">{fundraiser.name}</h3>
            <p className="text-gray-500 mt-2">
              Goal: ${parseFloat(fundraiser.goal).toFixed(2)}
            </p>
            <p className="text-gray-500">{fundraiser.description}</p>
            <p className="text-gray-500">Ends: {fundraiser.ends}</p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Donation Amount"
                value={donationAmount[fundraiser.id] || ""}
                onChange={(e) =>
                  setDonationAmount({
                    ...donationAmount,
                    [fundraiser.id]: e.target.value,
                  })
                }
                className="bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleDonate(fundraiser.id)}
                className="bg-green-500 text-white rounded-full px-4 py-2 ml-2 hover:bg-green-600"
              >
                Donate
              </button>
            </div>
            {/* FIX THIS SO THAT PEOPLE CAN DONATE */}
            {/* {fundraiser.donations.length > 0 && (
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
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FundraisersPage;