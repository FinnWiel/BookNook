import { Text, View, StyleSheet } from "react-native";
import { useColorScheme, ScrollView, TextInput } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../context/ctx";
import { FontAwesome6 } from "@expo/vector-icons";

export default function Reads() {
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
      <Text style={styles.title}>
        Your reading list.
      </Text>
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
    marginVertical: 31,
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
    gap: 15,

  },
});
