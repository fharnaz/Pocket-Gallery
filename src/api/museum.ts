
const API_URL =
  "https://openaccess-api.clevelandart.org/api/artworks/";

export type Artwork = {
  id: number;
  title: string;
  artist: string;
  imageUrl: string | null;
  creationDate: string;
};

type MuseumResponse = {
  data: {
    id: number;
    title: string;
    creators?: {
      description?: string;
    }[];
    images?: {
      web?: {
        url?: string;
      };
    };
    creation_date?: string;
  }[];
};

export async function searchArtworks(
  keyword: string
): Promise<Artwork[]> {
  const url =
    `${API_URL}?q=${encodeURIComponent(keyword)}` +
    "&has_image=1&limit=20";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not load artworks.");
  }

  const result: MuseumResponse = await response.json();

  return result.data.map((item) => ({
    id: item.id,
    title: item.title,
    artist: item.creators?.[0]?.description || "Unknown artist",
    imageUrl: item.images?.web?.url || null,
    creationDate: item.creation_date || "Date unknown",
  }));
}
