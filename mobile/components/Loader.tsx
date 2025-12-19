import { useColorScheme } from 'nativewind';
import { ActivityIndicator, View } from 'react-native';
import { Text } from './ui/text';

export default function Loader() {
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-1 flex-col items-center justify-center gap-y-2 animate-pulse">
      <ActivityIndicator size="large" color={colorScheme === 'dark' ? 'white' : 'black'} />
      <Text>Chargement...</Text>
    </View>
  );
}
