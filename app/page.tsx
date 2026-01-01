"use client";

import { supabase } from "@/lib/supabase";

export default function Home() {
  const testInsert = async () => {
    const { error } = await supabase
      .from("users")
      .insert({ name: "Test User" });

    if (error) {
      console.error(error);
      alert("Error inserting data");
    } else {
      alert("Test User inserted successfully");
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">
        Supabase Connection Test
      </h1>

      <button
        onClick={testInsert}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Test Insert
      </button>
    </main>
  );
}
