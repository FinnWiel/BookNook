import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useColorScheme, ScrollView, TextInput, FlatList } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../context/ctx";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";
import Book from "@/components/Book";

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
  image: string | null;
  genres: Genre[];
}

interface Loan {
  book: Book;
  dueDate: string;
  loanedAt: string;
  returnedAt: string | null;
}


export default function Reads() {
  const { signOut, session, userId, getUserId } = useSession();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [loading, setLoading] = useState<boolean>(false);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    if (!userId) {
      getUserId();
    }
  }, [userId, getUserId]);

  useEffect(() => {
    if (userId) {
      fetchBooks();
    }

  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        API_BASE_URL + `users/${userId}?includeRead`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );

      setLoans(response.data.data.loans);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data);
        console.error('Error Code:', error.response?.status);
        console.error('Error Config:', error.config);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Loan }) => (
    <Book
      title={item.book.title || "Title"}
      author={item.book.author || "Author"}
      key={item.book.id}
      bookId={item.book.id || 0}
      imagePath={item.book.image || ""}
    />
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <Text style={styles.title}>Your reading list.</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <FlatList
          data={loans}
          renderItem={renderItem}
          keyExtractor={(item) => item.book.id.toString()} // Use book.id as the key
          contentContainerStyle={styles.bookContainer}
          numColumns={2} // Display items in two columns
          ListEmptyComponent={<Text style={styles.noBooks}>No current books read.</Text>} // Show message when no loans
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookContainer: {
    flexGrow: 1, 
    justifyContent: "space-between",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A33B20",
    marginVertical: 15,
    marginTop: 55,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    margin: 20,
  },
  noBooks: {
    color: "white",
    fontSize: 18,
    fontStyle: "italic",
    margin: 20,
    textAlign: "center",
  },
});
