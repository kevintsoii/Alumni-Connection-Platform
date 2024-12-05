import React, { useEffect, useState } from "react";

function FundraisersPage() {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("permission_level");

  const [fundraisers, setFundraisers] = useState([]);
  const [newFundraiser, setNewFundraiser] = useState({
    name: "",
    goal: "",
    description: "",
    ends: "",
  });
  const [donationAmount, setDonationAmount] = useState({});
  const [donationsByFundraiser, setDonationsByFundraiser] = useState({});

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
          setAccesError(
            "Failed to fetch fundraisers. Status: " + response.status
          );
          setAccesError("You must be logged in.");
        }
      } catch (error) {
        setAccesError("Error fetching fundraisers: " + error.message);
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
        console.log(
          `Donations for fundraiser ${fundraiserID}:`,
          data.donations
        ); // Debugging
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
          setAccesError(errorData.detail || "Failed to create fundraiser.");
        }
      } catch (error) {
        console.error("Error creating fundraiser:", error);
        setAccesError("An error occurred while creating the fundraiser.");
      }
    } else {
      setAccesError("All fields are required.");
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
  const handleDonate = async (fundraiserID) => {
    const donationValue = donationAmount[fundraiserID];

    if (donationValue && parseFloat(donationValue) > 0) {
      try {
        const payload = {
          amount: parseFloat(donationValue),
        };

        const response = await fetch(
          `http://localhost:8000/donations/${fundraiserID}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          const donationResponse = await response.json();
          console.log("Donation successful:", donationResponse);

          // update donationsByFundraiser to reflect the new donation
          setDonationsByFundraiser((prev) => {
            const updatedDonations = prev[fundraiserID]
              ? [...prev[fundraiserID], donationResponse]
              : [donationResponse];

            return { ...prev, [fundraiserID]: updatedDonations };
          });

          // clear the input field
          setDonationAmount((prev) => ({ ...prev, [fundraiserID]: "" }));

          // refresh page after successful donation (fixed white screen bug)
          window.location.reload();
        } else {
          const errorData = await response.json();
          console.error(
            "Failed to donate:",
            errorData.detail || response.statusText
          );
        }
      } catch (error) {
        console.error("Error during donation:", error.message);
      }
    } else {
      console.error("Invalid donation amount.");
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
            <p className="text-amber-600 mt-2 font-semibold">
              Goal: ${parseFloat(fundraiser.goal).toFixed(2)}
            </p>
            <p className="text-green-700 font-semibold">
              Total Raised: ${fundraiser.raised}
            </p>
            <p className="text-gray-500">
              Description: {fundraiser.description}
            </p>
            <p className="text-gray-500">Ends: {fundraiser.ends}</p>

            {donationsByFundraiser[fundraiser.fundraiserID]?.length > 0 ? (
              <div className="mt-4">
                <h4 className="font-semibold">Donations:</h4>
                {donationsByFundraiser[fundraiser.fundraiserID].map(
                  (donation) => (
                    <p key={donation.donationID} className="text-gray-500">
                      {donation.user.first} {donation.user.last}: $
                      {parseFloat(donation.amount).toFixed(2)}
                    </p>
                  )
                )}
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
