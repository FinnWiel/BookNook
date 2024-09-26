import { Link, router } from "expo-router";
import { Text, View, StyleSheet, Button, TextInput, KeyboardAvoidingView, KeyboardAvoidingViewComponent, ScrollView } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../context/ctx";
import { FontAwesome6 } from "@expo/vector-icons";

export default function SignUp() {

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
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
    
          <Text style={styles.title}>Register</Text>
    
          <ScrollView style={styles.inputContainer}>
            <View>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.inputBox}
                selectionColor={"#A33B20"}
              ></TextInput>
            </View>
            <View>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                secureTextEntry={true}
                style={styles.inputBox}
                selectionColor={"#A33B20"}
              ></TextInput>
            </View>
            <View>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                secureTextEntry={true}
                style={styles.inputBox}
                selectionColor={"#A33B20"}
              ></TextInput>
            </View>
            <View>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                secureTextEntry={true}
                style={styles.inputBox}
                selectionColor={"#A33B20"}
              ></TextInput>
            </View>
            <View>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                secureTextEntry={true}
                style={styles.inputBox}
                selectionColor={"#A33B20"}
              ></TextInput>
            </View>
    
            <Text style={styles.registerButton}>
                Register
            </Text>
          </ScrollView>
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
        marginTop: 170,
        paddingVertical: 8,
        textAlign: "center",
        fontSize: 32,
        fontWeight: "light",
        color: "#A33B20",
        marginBottom: 10,
        position: "static",
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column",
      },
      inputBox: {
        borderWidth: 2,
        borderColor: "#A33B20",
        borderRadius: 10,
        paddingVertical: 3,
        width: 300,
        paddingHorizontal: 20,
        marginBottom: 10,
        color: "#A33B20",
        fontSize: 16,
      },
      inputLabel: {
        marginBottom: 5,
        color: "#A33B20",
        fontSize: 16,
      },
      registerButton: {
        padding: 15,
        width: 100,
        textAlign: "center",
        color: "white",
        backgroundColor: "#A33B20",
        borderRadius: 100,
        marginTop: 10,
      },
    });