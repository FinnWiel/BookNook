import { Text, View, StyleSheet, ActivityIndicator, ScrollView, TextInput, RefreshControl } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../context/ctx";
import { FontAwesome6 } from "@expo/vector-icons";
import Book from "@/components/Book";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/Api";
import axios from "axios";
import { router } from "expo-router";

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

export default function Index() {
  const { session, userId, getUserId } = useSession();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loadingNew, setLoadingNew] = useState<boolean>(true);
  const [loadingLoan, setLoadingLoan] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const handleSearchSubmit = () => {
    if (search) {
      router.push(`/search?query=${search}`);
      setSearch("");
    }
  };

  useEffect(() => {
    if (!userId) {
      getUserId();
    }
  }, [userId, getUserId]);


  useEffect(() => {
    if (userId) {
      fetchLatestBooks();
      fetchCurrentLoans();
    }
  }, [userId]);

  const fetchLatestBooks = async () => {
    setLoadingNew(true);
    try {
      const response = await axios.get(API_BASE_URL + "books?latest", {
        headers: {
          Authorization: `Bearer ${session}`, // Include the Bearer token
        },
      });

      setNewBooks(response.data.data); 
    } catch (error) {
      console.error("Error fetching latest books:", error);
    } finally {
      setLoadingNew(false);
    }
  };

  const fetchCurrentLoans = async () => {
    setLoadingLoan(true);
    try {
      const response = await axios.get(API_BASE_URL + `users/${userId?.toString()}?includeCurrentLoans`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });

      setLoans(response.data.data.loans);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data);
        console.error('Error Code:', error.response?.status);
        console.error('Error Config:', error.config);
      }
    } finally {
      setLoadingLoan(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing to true
    await fetchLatestBooks();
    await fetchCurrentLoans();
    setRefreshing(false); // Reset refreshing state
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh} // Trigger refresh function
        />
      }
    >
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          placeholderTextColor={theme.text}
          placeholder="Search..."
          style={[
            styles.searchBar,
            { borderColor: theme.primary, color: theme.text },
          ]}
          onChangeText={(text) => setSearch(text)}
          onSubmitEditing={handleSearchSubmit}
        ></TextInput>
        <View style={styles.searchIcon}>
          <FontAwesome6
            name="magnifying-glass"
            size={20}
            color={"white"}
          />
        </View>
      </View>

      <View style={styles.dueDate}>
        {loans.length > 0 ? (
          <View>
            <Text style={styles.dueDates}>
              Upcoming due date{loans.length > 1 ? "s" : ""}:
            </Text>
            {loans.map((loan, index) => (
              <Text key={index} style={styles.dueDateText}>
                {loan.dueDate || "No due date"}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.dueDateText}>No upcoming due dates</Text>
        )}
      </View>

      <Text style={styles.title}>New arrivals!</Text>
      {loadingNew ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <ScrollView horizontal={true} style={styles.bookContainer}>
          {newBooks.length > 0 ? (
            newBooks.map((book, index) => (
              <Book
                title={book.title || ""}
                author={book.author || ""}
                key={index}
                bookId={book.id || 0}
                imagePath={book.image || ""}
              />
            ))
          ) : (
            <Text style={styles.noBooks}>No new arrivals.</Text>
          )}
        </ScrollView>
      )}

      <Text style={styles.title}>Current Loans</Text>
      {loadingLoan ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <ScrollView horizontal={true} style={styles.bookContainer}>
          {loans.length > 0 ? (
            loans.map((loan, index) => (
              <Book
                title={loan.book.title || "Title"}
                author={loan.book.author || "Author"}
                key={index}
                bookId={loan.book.id || 0}
                imagePath={loan.book.image || ""}
              />
            ))
          ) : (
            <Text style={styles.noBooks}>No current loans.</Text>
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 20,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  searchContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginTop: 35,
  },
  searchBar: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    width: "75%",
    height: 50,
    borderRadius: 10,
    margin: 15,
    marginRight: 12,
    padding: 10,
    fontWeight: "bold",
  },
  searchIcon: {
    width: "10%",
    height: 50,
    marginTop: 15,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "#A33B20",
    textAlign: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  bookContainer: {
    marginLeft: 10,
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
  noBooks: {
    color: "white",
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "100",
  },
  dueDates: {
    color: "white",
    fontSize: 24,
    marginHorizontal: 10,
    fontWeight: "100",
  },
});
