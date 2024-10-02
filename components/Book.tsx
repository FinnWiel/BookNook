import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Define the props interface
interface BookProps {
  title: string;
  author: string;
  bookId: number;
  coverImage?: any;
}

const defaultImage = require("@/assets/images/base_img.jpg");

const Book: React.FC<BookProps> = ({ title, author, coverImage, bookId }) => {
  const router = useRouter(); 

  const goToBook = () => {
    router.push(`/book/${bookId}`); 
  };

  return (
    <TouchableOpacity style={styles.container} onPress={goToBook}>
      <Image source={coverImage || defaultImage} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    margin: 5,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 195,
  },
  textContainer: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  author: {
    fontSize: 14,
    color: "#666",
  },
});

export default Book;
