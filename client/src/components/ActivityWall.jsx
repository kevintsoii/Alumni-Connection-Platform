import React from 'react';

function ActivityWall() {
  const activities = [
    { id: 1, user: 'John Doe', content: 'Just joined a new project!', timestamp: '2h ago' },
    { id: 2, user: 'Jane Smith', content: 'Looking for volunteers for our upcoming event.', timestamp: '4h ago' },
    { id: 3, user: 'Mike Johnson', content: 'Excited to announce our new fundraising campaign!', timestamp: '1d ago' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Recent Activity</h2>
      {activities.map((activity) => (
        <div key={activity.id} className="border-b border-gray-200 py-4 last:border-b-0">
          <h3 className="font-semibold">{activity.user}</h3>
          <p className="mt-2">{activity.content}</p>
          <span className="text-sm text-gray-500">{activity.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

export default ActivityWall;

