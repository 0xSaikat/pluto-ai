import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-950 text-white px-10 py-5 flex justify-between items-center border-b border-gray-800">

      <h1 className="text-2xl font-bold text-cyan-400">
        Code Security Analyzer
      </h1>

      <div className="space-x-8">

        <Link className="hover:text-cyan-400 transition" to="/">
          Home
        </Link>

        <Link className="hover:text-cyan-400 transition" to="/features">
          Features
        </Link>

        <Link className="hover:text-cyan-400 transition" to="/dashboard">
          Dashboard
        </Link>

        <Link className="hover:text-cyan-400 transition" to="/login">
          Login
        </Link>

        <Link className="hover:text-cyan-400 transition" to="/register">
          Register
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;