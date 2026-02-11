"use client";

import { useEffect, useState } from "react";

type ImageType = {
  id: number;
  P?: {
    url: string;
  };
};

export default function Home() {
  const [data, setData] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);

  // Backend URL without trailing slash
  const API_URL = "https://dogs-backend-bn8q.onrender.com";

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/exes?populate=*`);
      const json = await res.json();
      console.log("🔥 Full response:", json); // Check JSON in console
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

  const getFullImageUrl = (imgPath: string | undefined) => {
    if (!imgPath) return "";
    // Ensure only one slash
    return imgPath.startsWith("/") ? `${API_URL}${imgPath}` : `${API_URL}/${imgPath}`;
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-10">📸 Photo Gallery</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((item) => {
            const imgUrl = item.P?.url; // ✅ Correct path from your JSON
            return (
              <div key={item.id} className="shadow rounded-xl overflow-hidden">
                {imgUrl ? (
                  <img
                    src={getFullImageUrl(imgUrl)}
                    className="w-full h-48 object-cover"
                    alt={item.P?.name || "photo"}
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-200">
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
