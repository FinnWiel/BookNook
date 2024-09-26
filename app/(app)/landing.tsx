import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Image, Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";


export default function Landing() {

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
      <View style={styles.rotatedBlock} />
      <View style={styles.logoContainer}>
        <FontAwesome6
          style={styles.icon}
          name="book-open-reader"
          size={40}
          color="white"
        />
        <Text style={styles.logoText}>BookNook</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome,</Text>
        <Text style={styles.info}>
          Welcome to the Library! Please log in to access your account, explore
          books, and manage your reading list.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link style={[styles.loginButton, {backgroundColor: theme.primary}]} href="./sign-in">
          Login
        </Link>
        <Link style={styles.registerButton} href="./sign-up">
          Register
        </Link>
      </View>
      <Text style={styles.bottomText}>Enjoy your reading!</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 50,
  },
  icon: {
    marginRight: 5,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "normal",
    letterSpacing: -3,
    color: "white",
  },
  textContainer:{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "absolute",
    top: 120,
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    textAlign: "center",
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  info: {
    paddingVertical: 8,
    marginHorizontal: 60,
    textAlign: "center",
    fontSize: 18,
    color: "white",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 320,
    width: "100%",
  },
  loginButton: {
    padding: 15,
    width: 300,
    textAlign: "center",
    color: "white",
    margin: 10,
    // backgroundColor: theme.primary,
    borderRadius: 100,
    fontWeight: "bold",
    fontSize: 18,
  },
  registerButton: {
    padding: 15,
    width: 300,
    textAlign: "center",
    color: "#A33B20",
    margin: 10,
    borderWidth: 3,
    borderColor: "#A33B20",
    borderRadius: 100,
    fontWeight: "bold",
    fontSize: 18,
  },
  rotatedBlock: {
    width: "150%",
    height: "70%",
    backgroundColor: "#A33B20",
    transform: [{ rotate: "-10deg" }], 
    position: "absolute", 
    top: -150, 
    left: -150, 
    overflow: "hidden",
    shadowColor: '#000', 
    shadowOffset: {
      width: 0, 
      height: 20, 
    }, 
    shadowOpacity: .3, 
    shadowRadius: 30, 
    elevation: 6,
  },
  bottomText:{
    position: "absolute",
    bottom: 20,
    color: "gray",
    fontSize: 16,
  }
});
