import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../context/ctx";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { FontAwesome6 } from "@expo/vector-icons";
import Book from "@/components/Book";
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

interface Loan {
  book: Book;
  dueDate: string;
  loanedAt: string;
  returnedAt: string | null;
}


export default function Index() {
  const { signOut, adminToken, userToken, session, userId } = useSession();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loadingNew, setLoadingNew] = useState<boolean>(true); // Loading
  const [loadingLoan, setLoadingLoan] = useState<boolean>(true); // Loading

  // Fetch the latest books from the API when the component mounts
  useEffect(() => {
    fetchLatestBooks();
    fetchCurrentLoans();
  }, []);

  const fetchLatestBooks = async () => {
    setLoadingNew(true);
    try {
        const response = await axios.get(API_BASE_URL + "books?latest", {
            headers: {
                Authorization: `Bearer ${session}`, // Include the Bearer token
            },
        });
        
        setNewBooks(response.data.data); // Use `response.data.data` to get the array of books
    } catch (error) {
        console.error("Error fetching latest books:", error);
    } finally {
        setLoadingNew(false); // Ensure loading state is reset in finally block
    }
};

const fetchCurrentLoans = async () => {
    setLoadingLoan(true);
    try {
        const response = await axios.get(API_BASE_URL + `users/${userId}?includeCurrentLoans`, {
            headers: {
                Authorization: `Bearer ${session}`, // Include the Bearer token
            },
        });

        setLoans(response.data.data.loans); // Use `data.data` to get the loans
    } catch (error) {
        console.error("Error fetching current loans:", error);
    } finally {
        setLoadingLoan(false); // Ensure loading state is reset in finally block
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
        {loans.length > 0 ? (
          <>
            <Text style={styles.dueDates}>
              Upcoming due date{loans.length > 1 ? "s" : ""}:
            </Text>
            {loans.map((loan, index) => (
              <Text key={index} style={styles.dueDateText}>
                {loan.dueDate}
              </Text>
            ))}
          </>
        ) : (
          <Text style={styles.dueDateText}>No upcoming due dates</Text>
        )}
      </View>

      <Text style={styles.title}>New arrivals!</Text>
      {loadingNew ? ( // Show loading indicator while fetching data
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <ScrollView horizontal={true} style={styles.bookContainer}>
          {newBooks.length > 0 ? (
            newBooks.map((book, index) => (
              <Book
                title={book.title}
                author={book.author}
                key={index}
                bookId={book.id}
              />
            ))
          ) : (
            <Text style={styles.noBooks}>No new arrivals.</Text>
          )}
        </ScrollView>
      )}

      <Text style={styles.title}>Current Loans</Text>
      {loadingLoan ? ( // Show loading indicator while fetching data
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <ScrollView horizontal={true} style={styles.bookContainer}>
          {loans.length > 0 ? (
            loans.map((book, index) => (
              <Book
                title={book.book.title}
                author={book.book.author}
                key={index}
                bookId={book.book.id}
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
