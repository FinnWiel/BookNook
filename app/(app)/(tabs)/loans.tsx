import { Text, View } from 'react-native';
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSession } from '../../../context/ctx';

export default function Loans() {
  const { signOut } = useSession();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <Text>
        Loans
      </Text>
    </View>
  );
}
