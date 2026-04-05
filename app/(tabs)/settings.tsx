import { Text, Pressable } from "react-native";
import { useAuth } from "@clerk/expo";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const posthog = usePostHog();

  const handleSignOut = async () => {
    try {
      posthog.capture("user_signed_out");
      posthog.reset();
      await signOut();
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-sans-bold text-primary mb-5">Settings</Text>

      <Pressable 
        onPress={handleSignOut}
        className="mt-2 items-center rounded-full bg-primary py-4"
      >
        <Text className="font-sans-bold text-background">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;

