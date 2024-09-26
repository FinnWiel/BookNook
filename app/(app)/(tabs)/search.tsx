import { Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../context/ctx";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { FontAwesome6 } from "@expo/vector-icons";

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
      <ScrollView>
        <View style={styles.book}></View>
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
