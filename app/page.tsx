"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* ================= HEADER ================= */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <span className="text-2xl">🧠</span>
            Smart Attendance
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <span>Secure</span>
            <span>Cloud</span>
            <span>Accurate</span>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="bg-linear-to-r from-blue-600 to-blue-400 text-white">
        <div className="max-w-7xl mx-auto text-center px-6 py-28">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Smart Attendance <br /> Management System
          </h1>

          <p className="max-w-2xl mx-auto text-lg opacity-90 mb-10">
            Face Recognition & GPS based attendance for modern organizations.
          </p>

          <Link
            href="/login"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold shadow hover:scale-105 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Why Smart Attendance?
          </h2>
          <p className="text-gray-600 text-lg">
            Traditional attendance methods lead to proxy attendance, manual
            errors, and lack of accuracy. Our solution ensures secure and reliable
            attendance tracking.
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">
            Key Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Face Recognition", icon: "🙂" },
              { title: "GPS Geo‑Fencing", icon: "📍" },
              { title: "Real‑Time Data", icon: "📊" },
              { title: "Cloud Based", icon: "☁️" },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 shadow text-center hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "User opens app & enables camera and GPS",
              "System verifies face and location",
              "Attendance is marked securely",
            ].map((step, i) => (
              <div
                key={step}
                className="bg-white p-8 rounded-2xl shadow text-center"
              >
                <div className="text-blue-600 text-4xl font-bold mb-4">
                  {i + 1}
                </div>
                <p className="text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ADMIN ================= */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Admin Dashboard
            </h2>
            <p className="text-gray-600 text-lg">
              Manage users, view attendance reports, and export data with ease.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Dashboard Preview
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-linear-to-r from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto text-center px-6 py-24">
          <h2 className="text-3xl font-bold mb-4">
            Upgrade Your Attendance System
          </h2>
          <p className="opacity-90 mb-8">
            Secure • Contactless • Intelligent
          </p>

          <Link
            href="/login"
            className="inline-block bg-white text-blue-700 px-10 py-4 rounded-xl font-semibold shadow hover:scale-105 transition"
          >
            Request Demo
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 text-center text-sm text-gray-500">
        © 2025 Smart Attendance System
      </footer>
    </main>
  );
}