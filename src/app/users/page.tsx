export default function HomePage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-10">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white rounded-3xl p-12 shadow-lg">
        {/* LEFT SIDE (Illustration placeholder) */}
        <div className="flex justify-center">
          <div className="w-72 h-72 bg-red-100 rounded-3xl flex items-center justify-center">
            <span className="text-red-500 font-semibold">
              Illustration Area
            </span>
          </div>
        </div>

        {/* RIGHT SIDE (Text content) */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BLOOD <br /> DONATION
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Blood donation is a voluntary procedure that can help save lives.
            Donated blood is used in emergencies, surgeries, and medical
            treatments.
          </p>

          <button className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
