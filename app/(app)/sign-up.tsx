import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { useSession } from '../../context/ctx';

export default function SignUp() {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          router.replace('/');
        }}>
        Sign Up
      </Text>
    </View>
  );
}
