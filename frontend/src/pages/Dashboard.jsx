function Dashboard() {
  return (
    <div className="bg-black text-white min-h-screen p-10">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-gray-900 border border-cyan-500 p-8 rounded-xl">
          <h3 className="text-xl">Total Scans</h3>
          <h2 className="text-5xl mt-4 text-cyan-400">125</h2>
        </div>

        <div className="bg-gray-900 border border-red-500 p-8 rounded-xl">
          <h3 className="text-xl">Threats Found</h3>
          <h2 className="text-5xl mt-4 text-red-400">34</h2>
        </div>

        <div className="bg-gray-900 border border-green-500 p-8 rounded-xl">
          <h3 className="text-xl">Safe Projects</h3>
          <h2 className="text-5xl mt-4 text-green-400">91</h2>
        </div>

      </div>

      <div className="mt-16 bg-gray-900 p-8 rounded-xl border border-gray-700">

        <h2 className="text-3xl text-cyan-400 mb-6">
          Recent Activity
        </h2>

        <ul className="space-y-4 text-gray-300">
          <li>✔ Java Project Scan Completed</li>
          <li>✔ SQL Injection Vulnerability Found</li>
          <li>✔ Report Generated Successfully</li>
          <li>✔ Authentication Module Verified</li>
        </ul>

      </div>

    </div>
  );
}

export default Dashboard;