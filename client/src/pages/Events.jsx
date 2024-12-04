import React, { useState } from 'react';

function EventsPage() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Tech Meetup",
      timestamp: "2024-12-10 18:00",
      street: "123 Tech Ave",
      city: "Tech City",
      state: "CA",
      ZIP: "90001",
      description: "A meetup for tech enthusiasts to discuss the latest in technology.",
      rsvps: ["Alice", "Bob"],
    },
    {
      id: 2,
      name: "Business Networking Event",
      timestamp: "2024-11-25 17:00",
      street: "456 Business St",
      city: "Finance Town",
      state: "NY",
      ZIP: "10001",
      description: "Network with professionals from various industries.",
      rsvps: ["Charlie"],
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    name: "",
    timestamp: "",
    street: "",
    city: "",
    state: "",
    ZIP: "",
    description: "",
  });

  const handleCreateEvent = () => {
    if (
      newEvent.name.trim() !== "" &&
      newEvent.timestamp.trim() !== "" &&
      newEvent.street.trim() !== "" &&
      newEvent.city.trim() !== "" &&
      newEvent.state.trim() !== "" &&
      newEvent.ZIP.trim() !== "" &&
      newEvent.description.trim() !== ""
    ) {
      const newEntry = {
        ...newEvent,
        id: events.length + 1,
        rsvps: [],
      };
      setEvents([newEntry, ...events]);
      setNewEvent({
        name: "",
        timestamp: "",
        street: "",
        city: "",
        state: "",
        ZIP: "",
        description: "",
      });
    }
  };

  const handleRSVP = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id
          ? {
              ...event,
              rsvps: event.rsvps.includes("Current User")
                ? event.rsvps.filter((rsvp) => rsvp !== "Current User")
                : [...event.rsvps, "Current User"],
            }
          : event
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="datetime-local"
            placeholder="Event Date & Time"
            value={newEvent.timestamp}
            onChange={(e) => setNewEvent({ ...newEvent, timestamp: e.target.value })}
            className="bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Street Address"
            value={newEvent.street}
            onChange={(e) => setNewEvent({ ...newEvent, street: e.target.value })}
            className="bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="City"
            value={newEvent.city}
            onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
            className="bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="State"
            value={newEvent.state}
            onChange={(e) => setNewEvent({ ...newEvent, state: e.target.value })}
            className="bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="ZIP Code"
            value={newEvent.ZIP}
            onChange={(e) => setNewEvent({ ...newEvent, ZIP: e.target.value })}
            className="bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateEvent}
            className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
          >
            Add Event
          </button>
        </div>
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md p-4 mt-4">
            <h3 className="font-semibold text-xl">{event.name}</h3>
            <p className="text-gray-500 mt-2">Date & Time: {event.timestamp}</p>
            <p className="text-gray-500">Location: {event.street}, {event.city}, {event.state}, {event.ZIP}</p>
            <p className="text-gray-500">{event.description}</p>
            <div className="mt-4">
              <button
                onClick={() => handleRSVP(event.id)}
                className={`${
                  event.rsvps.includes("Current User") ? "bg-red-500" : "bg-green-500"
                } text-white rounded-full px-4 py-2 hover:bg-opacity-75`}
              >
                {event.rsvps.includes("Current User") ? "Cancel RSVP" : "RSVP"}
              </button>
            </div>
            {event.rsvps.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Attendees:</h4>
                {event.rsvps.map((rsvp, index) => (
                  <p key={index} className="text-gray-500">
                    {rsvp}
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

export default EventsPage;
