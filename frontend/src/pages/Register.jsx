import registerBg from "../assets/register.jpg";

function Register() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${registerBg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75"></div>

      {/* Register Card */}
      <div className="relative z-10 bg-gray-900/90 backdrop-blur-md p-10 rounded-2xl w-[450px] border border-cyan-500 shadow-2xl">

        <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-4 mb-5 rounded bg-gray-800 text-white placeholder-gray-400"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 mb-5 rounded bg-gray-800 text-white placeholder-gray-400"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 mb-5 rounded bg-gray-800 text-white placeholder-gray-400"
        />

        <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold p-4 rounded">
          Register
        </button>

      </div>
    </div>
  );
}

export default Register;