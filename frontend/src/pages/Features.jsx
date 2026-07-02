import featureBg from "../assets/dashboard.jpg";

function Features() {
  const features = [
    {
      title: "AI Vulnerability Detection",
      desc: "Automatically detect software vulnerabilities using Artificial Intelligence."
    },
    {
      title: "Secure Code Analysis",
      desc: "Analyze source code for security flaws and bad coding practices."
    },
    {
      title: "Risk Assessment",
      desc: "Calculate security risks and prioritize vulnerabilities."
    },
    {
      title: "Security Reports",
      desc: "Generate professional security reports instantly."
    },
    {
      title: "Real-Time Monitoring",
      desc: "Monitor applications continuously for threats."
    },
    {
      title: "Compliance Checking",
      desc: "Check security compliance against industry standards."
    }
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${featureBg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/85"></div>

      {/* Content */}
      <div className="relative z-10 p-10 text-white">

        <h1 className="text-5xl font-bold text-cyan-400 mb-10">
          Features
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="
                bg-gray-900/70
                backdrop-blur-md
                border
                border-cyan-500
                p-8
                rounded-2xl

                transition-all
                duration-500

                hover:scale-105
                hover:border-cyan-300
                hover:shadow-[0_0_35px_rgba(6,182,212,0.9)]

                cursor-pointer
              "
            >
              <h2 className="text-2xl text-cyan-400 mb-4 font-semibold">
                {feature.title}
              </h2>

              <p className="text-gray-300 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Features;