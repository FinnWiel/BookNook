import { Text, View } from 'react-native';

import { useSession } from '../../../context/ctx';

export default function Loans() {
  const { signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          console.log('Signing out...');
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}
