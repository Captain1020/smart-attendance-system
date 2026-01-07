"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between px-8 py-4 bg-blue-600 text-white">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span className="text-2xl">🧠</span>
          Smart Attendance
        </div>
        <nav className="hidden md:flex gap-6 text-sm">
          <span>Secure</span>
          <span>Cloud</span>
          <span>Accurate</span>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section className="bg-linear-to-r from-blue-600 to-blue-400 text-white text-center py-24 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Smart Attendance <br /> Management System
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90 mb-8">
          Face Recognition & GPS based attendance for modern organizations.
        </p>

        <Link
          href="/login"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow hover:scale-105 transition"
        >
          Get Started
        </Link>
      </section>

      {/* ================= WHY SECTION ================= */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Why Smart Attendance?</h2>
        <p className="max-w-3xl mx-auto text-gray-600">
          Traditional attendance methods lead to proxy attendance, manual errors,
          and lack of accuracy. Our solution ensures secure and reliable
          attendance tracking.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-10">Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Face Recognition", icon: "🙂" },
            { title: "GPS Geo‑Fencing", icon: "📍" },
            { title: "Real‑Time Data", icon: "📊" },
            { title: "Cloud Based", icon: "☁️" },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl p-6 shadow text-center hover:shadow-lg transition"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold">{f.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16 px-6">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            "User opens app & enables camera and GPS",
            "System verifies face and location",
            "Attendance is marked securely",
          ].map((step, i) => (
            <div
              key={step}
              className="bg-white p-6 rounded-xl shadow text-center"
            >
              <div className="text-blue-600 text-3xl font-bold mb-2">
                {i + 1}
              </div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ADMIN ================= */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <p className="text-gray-600">
              Manage users, view attendance reports, and export data with ease.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              Dashboard Preview
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-linear-to-r from-blue-700 to-blue-500 text-white text-center py-20 px-6">
        <h2 className="text-2xl font-bold mb-3">
          Upgrade Your Attendance System
        </h2>
        <p className="opacity-90 mb-6">
          Secure • Contactless • Intelligent
        </p>

        <Link
          href="/login"
          className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold shadow hover:scale-105 transition"
        >
          Request Demo
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 text-center text-sm text-gray-500">
        © 2025 Smart Attendance System
      </footer>
    </main>
  );
}
