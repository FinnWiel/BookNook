import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  RefreshControl,
} from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../context/ctx";
import { FontAwesome6 } from "@expo/vector-icons";
import Book from "@/components/Book";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";

interface Genre {
  id: number;
  name: string;
}

interface BookType {
  id: number;
  title: string;
  author: string;
  publicationDate: string;
  totalAmount: number;
  currentAmount: number;
  genres: Genre[];
}

const Search: React.FC = () => {
  const { session } = useSession();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [loading, setLoading] = useState<boolean>(true); 
  const [books, setBooks] = useState<BookType[]>([]); 
  const [search, setSearch] = useState<string>(""); 
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    setSearch(""); 
  }, []); 

  useEffect(() => {
    fetchBooks(); 
  }, [search]); 

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}books?title[like]=${search}`, {
        headers: {
          Authorization: `Bearer ${session}`, 
        },
      });
      const fetchedBooks = response.data?.data || [];
      setBooks(fetchedBooks); 
    } catch (error) {
      console.error("Error fetching latest books:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearchSubmit = () => {
    fetchBooks();
    setSearch(""); 
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks(); 
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholderTextColor={theme.text}
          placeholder="Search..."
          style={[styles.searchBar, { borderColor: theme.primary, color: theme.primary }]}
          value={search} 
          onChangeText={(text) => setSearch(text)} 
          onSubmitEditing={handleSearchSubmit}
        />
        <View style={styles.searchIcon}>
          <FontAwesome6 name="magnifying-glass" size={20} color={"white"} />
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          <View style={styles.bookContainer}>
            {books && books.length > 0 ? (
              books.map((book) => (
                <View style={styles.bookItem} key={book.id}>
                  <Book title={book.title || ""} author={book.author || ""} bookId={book.id || 0} />
                </View>
              ))
            ) : (
              <Text style={styles.noBooks}>No books found.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
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
    flexDirection: 'row',
    flexWrap: 'wrap', 
    margin: 5,
    gap: 10,
  },
  bookItem: {
    width: '48%',
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

export default Search;
