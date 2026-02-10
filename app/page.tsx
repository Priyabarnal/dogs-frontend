"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://dogs-backend-bn8q.onrender.com";

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/exes?populate=*`);
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        📸 Photo Gallery
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((item) => {
            const imgUrl =
              item?.P?.url ||
              item?.attributes?.P?.data?.attributes?.url ||
              null;

            return (
              <div key={item.id} className="shadow rounded-xl overflow-hidden">
                {imgUrl ? (
                  <img
                    src={`${API_URL}${imgUrl}`}
                    className="w-full h-48 object-cover"
                    alt="dog"
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    No image
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}