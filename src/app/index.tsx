
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Artwork, searchArtworks } from "../api/museum";

export default function PocketGallery() {
  const [screen, setScreen] = useState("explore");
  const [keyword, setKeyword] = useState("flowers");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [favourites, setFavourites] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  function toggleFavourite(artwork: Artwork) {
  const alreadySaved = favourites.some(
    (item) => item.id === artwork.id
  );

  if (alreadySaved) {
    setFavourites(
      favourites.filter((item) => item.id !== artwork.id)
    );
  } else {
    setFavourites([...favourites, artwork]);
  }
}

  async function loadArtworks() {
    try {
      setLoading(true);
      setError("");

      const results = await searchArtworks(keyword);
      setArtworks(results);
    } catch (err) {
      setError("Unable to load artworks. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArtworks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pocket Gallery</Text>

      <View style={styles.navigation}>
        <Pressable onPress={() => setScreen("explore")}>
          <Text style={styles.navText}>Explore</Text>
        </Pressable>

        <Pressable
          onPress={() => selectedArtwork && setScreen("details")}
        >
          <Text style={styles.navText}>Artwork Details</Text>
        </Pressable>
      </View>

      {screen === "explore" ? (
        <ScrollView>
          <Text style={styles.title}>Explore Artworks</Text>

          <TextInput
            style={styles.search}
            placeholder="Search artworks..."
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={loadArtworks}
          />

          <Pressable style={styles.searchButton} onPress={loadArtworks}>
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>

          {loading && <ActivityIndicator size="large" />}

          {error !== "" && <Text style={styles.error}>{error}</Text>}

          {!loading && !error && artworks.length === 0 && (
            <Text>No artworks found.</Text>
          )}

          {artworks.map((artwork) => (
            <Pressable
              key={artwork.id}
              style={styles.card}
              onPress={() => {
                setSelectedArtwork(artwork);
                setScreen("details");
              }}
            >
              {artwork.imageUrl ? (
                <Image
                  source={{ uri: artwork.imageUrl }}
                  style={styles.artworkImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text>No image available</Text>
                </View>
              )}

              <Text style={styles.artTitle}>{artwork.title}</Text>
              <Text style={styles.artist}>{artwork.artist}</Text>
              <Text style={styles.link}>View Details →</Text>
            </Pressable>
            
          ))}
        </ScrollView>
      ) : (
        <ScrollView>
          <Text style={styles.title}>Artwork Details</Text>

          {selectedArtwork && (
            <>
              {selectedArtwork.imageUrl && (
                <Image
                  source={{ uri: selectedArtwork.imageUrl }}
                  style={styles.largeImage}
                  resizeMode="contain"
                />
              )}

              <Text style={styles.artTitle}>{selectedArtwork.title}</Text>
              <Text style={styles.artist}>
                Artist: {selectedArtwork.artist}
              </Text>
              <Text style={styles.description}>
                Created: {selectedArtwork.creationDate}
              </Text>
              <Pressable
  style={styles.searchButton}
  onPress={() => toggleFavourite(selectedArtwork)}
>
  <Text style={styles.buttonText}>
    {favourites.some(
      (item) => item.id === selectedArtwork.id
    )
      ? "♥ Remove from Favourites"
      : "♡ Save to Favourites"}
  </Text>
</Pressable>
            </>
          )}

          <Pressable
            style={styles.backButton}
            onPress={() => setScreen("explore")}
          >
            <Text style={styles.backText}>← Back to Explore</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2EC",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#283D35",
    textAlign: "center",
    marginBottom: 20,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#DDE7DF",
    borderRadius: 12,
  },
  navText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#283D35",
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
    color: "#283D35",
  },
  search: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#BBBBBB",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#315E48",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  artworkImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#DDE7DF",
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: "#DDE7DF",
    justifyContent: "center",
    alignItems: "center",
  },
  largeImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#DDE7DF",
  },
  artTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#283D35",
    marginTop: 12,
  },
  artist: {
    fontSize: 15,
    color: "#555555",
    marginTop: 6,
  },
  link: {
    color: "#315E48",
    fontWeight: "bold",
    marginTop: 12,
  },
  description: {
    fontSize: 16,
    marginTop: 15,
  },
  error: {
    color: "red",
    marginBottom: 15,
  },
  backButton: {
    padding: 15,
    marginTop: 10,
  },
  backText: {
    color: "#315E48",
    textAlign: "center",
    fontWeight: "bold",
  },
});
