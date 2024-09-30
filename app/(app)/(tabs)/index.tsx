import { Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../context/ctx";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { FontAwesome6 } from "@expo/vector-icons";
import Book from "@/components/Book";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/Api";

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

export default function Index() {
  const { signOut, adminToken, userToken } = useSession();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { session } = useSession();

  const [books, setBooks] = useState<Book[]>([]);

  // Fetch the latest books from the API when the component mounts
  useEffect(() => {
    fetchLatestBooks();
  }, []);

  const fetchLatestBooks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/books?latest", {
        method: 'GET', // Specify the request method
        headers: {
          'Authorization': `Bearer ${session}`, // Include the Bearer token
        },
      });
      const data = await response.json();
      setBooks(data.data); // Use `data.data` to get the array of books
    } catch (error) {
      console.error('Error fetching latest books:', error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search..."
          style={[
            styles.searchBar,
            { borderColor: theme.primary, color: theme.primary },
          ]}
        ></TextInput>
        <View style={styles.searchIcon}>
          <FontAwesome6
            name="magnifying-glass"
            size={20}
            color={"white"}
            style={[styles.loop, { position: "absolute", right: 20, top: 15 }]}
          />
        </View>
      </View>

      <View style={styles.dueDate}>
        {/* <Text style={styles.dueDateText}>Upcoming due date:</Text> */}
        <Text style={styles.dueDateText}>You have no upcoming due dates</Text>
      </View>

      <Text style={styles.title}>New arrivals!</Text>
      <ScrollView horizontal={true} style={styles.bookContainer}>
      {books.map((book, index) => (
        <Book title={book.title} author={book.author} key={index}/>
      ))}
      </ScrollView>

      <Text style={styles.title}>Current Loans</Text>
      <ScrollView horizontal={true} style={styles.bookContainer}>
        <Book title="The Great Gatsby" author="F. Scott Fitzgerald" />
        <Book title="The Great Gatsby" author="F. Scott Fitzgerald" />
        <Book title="The Great Gatsby" author="F. Scott Fitzgerald" />
        <Book title="The Great Gatsby" author="F. Scott Fitzgerald" />
        <Book title="The Great Gatsby" author="F. Scott Fitzgerald" />
        <Book title="The Great Gatsby" author="F. Scott Fitzgerald" />
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  searchContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  searchBar: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    width: "90%",
    height: 50,
    borderRadius: 10,
    margin: 15,
    padding: 10,
    fontWeight: "bold",
  },
  searchIcon: {
    width: "10%",
    height: 80,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    marginRight: -5,
  },
  loop: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A33B20",
    width: "100%",
    height: 50,
    borderRadius: 10,
    cursor: "pointer",
  },
  bookContainer: {
    marginLeft: 15,
    marginBottom: 15,
  },
  book: {
    width: 200,
    height: 300,
    backgroundColor: "gray",
    marginRight: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A33B20",
    marginLeft: 15,
    marginVertical: 15,
  },
  dueDate: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
    backgroundColor: "#A33B20",
    borderRadius: 10,
    padding: 20,
    height: 150,
  },
  dueDateText: {
    color: "white",
    fontSize: 24,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
});
