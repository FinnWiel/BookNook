import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../context/ctx";
import { FontAwesome6 } from "@expo/vector-icons";
import Book from "@/components/Book";
import {
  router,
  useGlobalSearchParams,
} from "expo-router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/Api";
import axios from "axios";

interface Genre {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  publicationDate: string;
  totalAmount: number;
  currentAmount: number;
  genres: Genre[];
}

export default function BookView() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const defaultImage = require("@/assets/images/base_img.jpg");
  const { session } = useSession();
  const [book, setBook] = useState<Book>();
  const [genres, setGenres] = useState<Genre[]>([]);
  const { id } = useGlobalSearchParams();
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${API_BASE_URL}books/${id}`, {
        headers: {
          Authorization: `Bearer ${session}`, // Include the Bearer token
        },
      });
  
      // Axios automatically parses the JSON response
      setBook(response.data.data); // Use `response.data.data` to get the book details
      setGenres(response.data.data.genres);
    } catch (error) {
      console.error("Error fetching latest books:", error);
      router.back();
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: theme.background,
      }}
    >
      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => router.back()}
      >
        <FontAwesome6
          name="arrow-left"
          size={24}
          color="#A33B20"
          style={{ margin: 15 }}
        />
        <Text style={styles.backText}>Go back</Text>
      </TouchableOpacity>

      {loading ? ( // Show loading indicator while fetching data
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A33B20" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <Image source={defaultImage} style={styles.image} />
          <View style={styles.bookInfo}>
            <Text style={[styles.title, {color: theme.text}]}>{book?.title}</Text>
            <Text style={[styles.author, {color: theme.text}]}>{book?.author}</Text>
            <Text style={[styles.publication, {color: theme.text}]}>Published on: {book?.publicationDate}</Text>
            <View style={styles.genresContainer}>
              {genres.map((genre, index) => (
                <Text key={index} style={[styles.genre, {color: theme.text, borderColor: theme.text}]}>
                  {genre.name}
                </Text>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    margin: 15,
    width: 300,
    height: 400,
  },
  backContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#A33B20",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#A33B20",
    marginTop: 10,
    fontSize: 16,
  },
  bookInfo: {
    marginHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  author: {
    fontSize: 18,
    color: "white",
    fontStyle: "italic",
  },
  summary: {
    fontSize: 16,
    color: "white",
    margin: 15,
  },
  publication: {
    fontSize: 16,
    color: "white",
    marginVertical: 10,
  },
  genresContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginVertical: 5,
  },
  genre: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "white",
    color: "white",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 7,
    borderRadius: 999,
  },
});