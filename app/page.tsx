"use client";

import { useEffect, useState } from "react";

type ImageType = {
  id: number;
  attributes?: {
    P?: {
      data?: {
        attributes?: {
          url: string;
        };
      };
    };
  };
};

export default function Home() {
  const [data, setData] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL; // from .env.local

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

  // Helper function to get full image URL
  const getFullImageUrl = (imgPath: string) => {
    // If Strapi already gives full URL (sometimes in dev), just return
    if (imgPath.startsWith("http")) return imgPath;
    // Else prepend backend URL
    return `${API_URL}${imgPath}`;
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-10">📸 Photo Gallery</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((item) => {
            const imgUrl = item.attributes?.P?.data?.attributes?.url;
            return (
              <div key={item.id} className="shadow rounded-xl overflow-hidden">
                {imgUrl ? (
                  <img
                    src={getFullImageUrl(imgUrl)}
                    className="w-full h-48 object-cover"
                    alt="photo"
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
