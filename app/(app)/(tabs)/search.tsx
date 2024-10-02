import { Text, View, StyleSheet } from "react-native";
import { useColorScheme, ScrollView, TextInput } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../context/ctx";
import { FontAwesome6 } from "@expo/vector-icons";
import Book from "@/components/Book";

export default function Search() {
  const { signOut } = useSession();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <View style={styles.searchContainer}>
        <TextInput
          placeholderTextColor={theme.text}
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
            style={[{ position: "absolute", right: 20, top: 15 }]}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.results} pagingEnabled={true} persistentScrollbar={true}>
      </ScrollView>
    </View>
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
    width: "15%",
    height: 50,
    paddingTop: 10,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: "#A33B20",
    textAlign: "center",
    cursor: "pointer",
  },
  bookContainer: {
    marginLeft: 15,
    marginBottom: 15,
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
  results: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
});
