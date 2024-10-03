import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useColorScheme } from "react-native";
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
  genres: Genre[];
}

interface Loan {
  book: Book;
  dueDate: string;
  loanedAt: string;
  returnedAt: string | null;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  loans: Loan[];
}

export default function Profile() {
  const { signOut, userId, session } = useSession();
  const colorScheme = useColorScheme();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [user, setUser] = useState<User | null>(null);
  const [allLoans, setAllLoans] = useState<Loan[]>([]); 

  useEffect(() => {
    fetchData();
    fetchAllLoans();
  }, []);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(
        API_BASE_URL + `users/${userId?.toString()}?includeCurrentLoans`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );


      setUser(response.data.data);
      setLoans(response.data.data.loans);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data);
        console.error("Error Code:", error.response?.status);
        console.error("Error Config:", error.config);
      }
    } finally {
      setLoadingData(false);
    }
  };

  const fetchAllLoans = async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(
        API_BASE_URL + `users/${userId?.toString()}?includeLoans`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );

      setAllLoans(response.data.data.loans);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data);
        console.error("Error Code:", error.response?.status);
        console.error("Error Config:", error.config);
      }
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingTop: 55,
        paddingHorizontal: 15,
        backgroundColor: theme.background,
      }}
    >
      <Text style={styles.title}>Profile</Text>

      {loadingData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <View style={styles.profileinfo}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.info}>{user?.name}</Text>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.info}>{user?.username}</Text>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.info}>{user?.email}</Text>
        </View>
      )}

      <View style={styles.booksRead}>
        <Text style={styles.readText}>Total books borrowed</Text>
        <Text style={styles.readAmount}>{allLoans?.length || "N/A" }</Text>
      </View>

      <Text style={styles.title}>Current Loans</Text>
      {loadingData ? (
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
              />
            ))
          ) : (
            <Text style={styles.noBooks}>No current loans.</Text>
          )}
        </ScrollView>
      )}
      <Text
        style={styles.logout}
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          console.log("Signing out...");
          signOut();
        }}
      >
        Sign Out
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#A33B20",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  profileinfo: {
    backgroundColor: "#A33B20",
    color: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    paddingTop: 25,
  },
  infoLabel: {
    color: "white",
  },
  info: {
    color: "white",
    marginBottom: 15,
    fontSize: 20,
  },
  booksRead: {
    height: 100,
    borderColor: "#A33B20",
    borderWidth: 4,
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  readText: {
    color: "#A33B20",
    fontWeight: "bold",
    fontSize: 28,
    width: "49%",
    textAlign: "center",
  },
  readAmount: {
    color: "#A33B20",
    fontWeight: "bold",
    fontSize: 56,
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
  bookContainer: {
    marginLeft: 10,
    marginBottom: 5,
  },
  book: {
    width: 200,
    height: 300,
    backgroundColor: "gray",
    marginRight: 15,
    borderRadius: 10,
  },
  noBooks: {
    color: "white",
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "100",
  },
  logout: {
    marginBottom: 100,
    marginTop: 20,
    marginLeft: 15,
    color: "#B30000",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
