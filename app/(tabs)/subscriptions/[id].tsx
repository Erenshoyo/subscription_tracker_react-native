import { useLocalSearchParams } from "expo-router";

import { Text, View } from "react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Subscription Details: {id}</Text>
    </View>
  );
};

export default SubscriptionDetails;
