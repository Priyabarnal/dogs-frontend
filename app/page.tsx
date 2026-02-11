"use client";

import { useEffect, useState } from "react";

type ImageType = {
  id: number;
  attributes?: any; // flexible, kyunki exact structure unknown
};

export default function Home() {
  const [data, setData] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://dogs-backend-bn8q.onrender.com";

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/exes?populate=*`);
      const json = await res.json();
      console.log("Strapi response:", json); // 🔥 check exact structure
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
    if (imgPath.startsWith("http")) return imgPath;
    return `${API_URL}${imgPath}`;
  };

  // Helper to safely get image URL from nested attributes
  const extractImageUrl = (item: ImageType) => {
    // Try multiple common paths
    return (
      item.attributes?.P?.data?.attributes?.url || // original
      item.attributes?.image?.data?.attributes?.url || // alternate common name
      item.attributes?.P?.url || // fallback
      null
    );
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-10">📸 Photo Gallery</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((item) => {
            const imgUrl = extractImageUrl(item);
            return (
              <div key={item.id} className="shadow rounded-xl overflow-hidden">
                {imgUrl ? (
                  <img
                    src={getFullImageUrl(imgUrl)}
                    className="w-full h-48 object-cover"
                    alt="photo"
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
