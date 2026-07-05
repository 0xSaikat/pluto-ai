import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import homeImg from "../assets/home.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

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
          <button
            onClick={() => navigate("/register")}
            className="mt-8 bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3 rounded-lg font-semibold transition"
          >
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