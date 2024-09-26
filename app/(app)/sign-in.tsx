import { Link, router } from "expo-router";
import { Text, View, StyleSheet, Button, TextInput } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../context/ctx";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useSession();
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background  }}>
      <FontAwesome6
        name="arrow-left"
        size={25}
        color="#A33B20"
        style={styles.backButton}
        onPress={() => router.replace("/")}
      ></FontAwesome6>
      <View style={styles.logoContainer}>
        <FontAwesome6
          style={styles.icon}
          name="book-open-reader"
          size={40}
          color="#A33B20"
        />
        <Text style={styles.logoText}>BookNook</Text>
      </View>

      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.inputBox}
            selectionColor={"#A33B20"}
            onChangeText={text => setInputUsername(text)}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.inputBox}
            selectionColor={"#A33B20"}
            onChangeText={text => setInputPassword(text)}
          ></TextInput>
        </View>

        <Text style={styles.loginButton} onPress={() => signIn(inputUsername, inputPassword)}>
          Login
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    left: 30,
    top: 60,
  },
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
    color: "#A33B20",
  },
  title: {
    marginTop: 70,
    paddingVertical: 8,
    textAlign: "center",
    fontSize: 42,
    fontWeight: "light",
    color: "#A33B20",
    marginBottom: 10,
  },
  inputContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "column",
  },
  inputBox: {
    borderWidth: 2,
    borderColor: "#A33B20",
    borderRadius: 10,
    paddingVertical: 10,
    width: 300,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: "#A33B20",
    fontSize: 16,
  },
  inputLabel: {
    marginBottom: 5,
    color: "#A33B20",
    fontSize: 16,
  },
  loginButton: {
    padding: 15,
    width: 100,
    textAlign: "center",
    color: "white",
    backgroundColor: "#A33B20",
    borderRadius: 100,
  },
});
