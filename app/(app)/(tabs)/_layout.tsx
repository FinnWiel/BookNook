import { ActivityIndicator, Text, StyleSheet, View } from "react-native";
import { Redirect, Stack, Tabs, useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../context/ctx";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";

export default function AppLayout() {
  const { validateToken, session, isLoading, } = useSession();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="../landing" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#A33B20",
        tabBarInactiveTintColor: "#1E2D2F",
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 0,
          height: 60,
        },
        tabBarItemStyle: {
          marginVertical: 5,
        },
        tabBarLabelStyle: {
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reads"
        options={{
          title: "Reads",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
