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
  const [donationsByFundraiser, setDonationsByFundraiser] = useState({});
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

  // fetch donations for a specific fundraiser
  const fetchDonations = async (fundraiserID) => {
    try {
      const response = await fetch(
        `http://localhost:8000/donations/${fundraiserID}`,
        {
          method: "GET",
          headers: { Authorization: `${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`Donations for fundraiser ${fundraiserID}:`, data.donations); // Debugging
        setDonationsByFundraiser((prev) => ({
          ...prev,
          [fundraiserID]: data.donations,
        }));
      } else {
        console.error(
          `Failed to fetch donations for fundraiser ${fundraiserID}. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error(
        `Error fetching donations for fundraiser ${fundraiserID}:`,
        error
      );
    }
  };

  // fetch donations for all fundraisers
  useEffect(() => {
    fundraisers.forEach((fundraiser) => {
      fetchDonations(fundraiser.fundraiserID);
    });
  }, [fundraisers]);

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

  // render form for creating a new fundraiser
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

  // handle donation submission
  const handleDonate = (fundraiserID) => {
    if (donationAmount[fundraiserID] && parseFloat(donationAmount[fundraiserID]) > 0) {
      setDonationAmount((prev) => ({ ...prev, [fundraiserID]: "" }));
      // TODO: connect it to donations POST api
    }
  };

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

            {donationsByFundraiser[fundraiser.fundraiserID]?.length > 0 ? (
              <div className="mt-4">
                <h4 className="font-semibold">Donations:</h4>
                {donationsByFundraiser[fundraiser.fundraiserID].map((donation) => (
                  <p key={donation.donationID} className="text-gray-500">
                    {donation.user.first} {donation.user.last}: $
                    {parseFloat(donation.amount).toFixed(2)}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">No donations yet.</p>
            )}

            <div className="mt-4">
              <input
                type="text"
                placeholder="Donation Amount"
                value={donationAmount[fundraiser.fundraiserID] || ""}
                onChange={(e) =>
                  setDonationAmount({
                    ...donationAmount,
                    [fundraiser.fundraiserID]: e.target.value,
                  })
                }
                className="bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleDonate(fundraiser.fundraiserID)}
                className="bg-green-500 text-white rounded-full px-4 py-2 ml-2 hover:bg-green-600"
              >
                Donate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FundraisersPage;