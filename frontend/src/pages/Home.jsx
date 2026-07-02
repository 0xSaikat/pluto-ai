import { Link } from "react-router-dom";
import homeImg from "../assets/home.jpg";

function Home() {
  return (
    <div className="bg-black text-white min-h-screen">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-6 border-b border-gray-800">

        <h1 className="text-2xl font-bold text-cyan-400">
          Code Security Analyzer
        </h1>

        <div className="space-x-8 text-lg font-medium">
          <Link className="hover:text-cyan-400 transition" to="/">Home</Link>
          <Link className="hover:text-cyan-400 transition" to="/features">Features</Link>
          <Link className="hover:text-cyan-400 transition" to="/dashboard">Dashboard</Link>
          <Link className="hover:text-cyan-400 transition" to="/login">Login</Link>
          <Link className="hover:text-cyan-400 transition" to="/register">Register</Link>
        </div>

      </nav>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-16 py-20 gap-10">

        <div className="max-w-xl">

          <h1 className="text-6xl font-bold leading-tight">
            AI Powered
            <br />
            Code Security
            <br />
            Analyzer
          </h1>

          <p className="mt-6 text-gray-400 text-lg">
            Detect vulnerabilities, scan code, analyze risks and generate
            professional security reports using Artificial Intelligence.
          </p>

          <button className="mt-8 bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3 rounded-lg font-semibold transition">
            Get Started
          </button>

        </div>

        <div>
          <img
            src={homeImg}
            alt="Cyber Security"
            className="w-[600px] rounded-2xl shadow-2xl"
          />
        </div>

      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-8 px-16 pb-20">

        <div className="bg-gray-900 p-8 rounded-xl border border-cyan-500">
          <h3 className="text-xl">Projects Analyzed</h3>
          <h2 className="text-5xl text-cyan-400 mt-4">500+</h2>
        </div>

        <div className="bg-gray-900 p-8 rounded-xl border border-red-500">
          <h3 className="text-xl">Threats Detected</h3>
          <h2 className="text-5xl text-red-400 mt-4">1200+</h2>
        </div>

        <div className="bg-gray-900 p-8 rounded-xl border border-green-500">
          <h3 className="text-xl">Secure Projects</h3>
          <h2 className="text-5xl text-green-400 mt-4">98%</h2>
        </div>

      </section>

    </div>
  );
}

export default Home;