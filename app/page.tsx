"use client";

import { useEffect, useState } from "react";

type ExItem = {
  id: number;
  P?: {
    url: string;
  };
};

export default function Home() {
  const [data, setData] = useState<ExItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://dogs-backend-bn8q.onrender.com";

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/exes?populate=*`);
      const json = await res.json();

      // 🔥 Strapi v5 structure fix
      const formatted = (json.data || []).map((item: any) => ({
        id: item.id,
        P: item.P || item.attributes?.P?.data?.attributes || null,
      }));

      setData(formatted);
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        📸 Photo Gallery
      </h1>

      {loading ? (
        <p className="text-center text-lg">Loading images...</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((item) => {
            const imgUrl = item.P?.url;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                {imgUrl ? (
                  <img
                    src={`${API_URL}${imgUrl}`}
                    alt="dog"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    No Image
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