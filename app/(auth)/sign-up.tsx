import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, View, Pressable, Alert, ScrollView } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    if (!signUp) return;

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        Alert.alert("Sign Up Error", error.longMessage || "Failed to sign up.");
        return;
      }

      await signUp.verifications.sendEmailCode();
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Something went wrong");
    }
  };

  const handleVerify = async () => {
    if (!signUp) return;
    try {
      await signUp.verifications.verifyEmailCode({ code });

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session }: any) => {
            if (session?.currentTask) return;
            router.replace("/(tabs)");
          },
        });
      } else {
        Alert.alert("Verification Error", "Sign up is not complete.");
      }
    } catch (err: any) {
      Alert.alert("Verification Error", err.errors?.[0]?.message || "Invalid code");
    }
  };

  if (signUp?.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address")) {
    return (
      <SafeAreaView className="auth-safe-area">
        <ScrollView className="auth-scroll" contentContainerClassName="grow" automaticallyAdjustKeyboardInsets>
          <View className="auth-content justify-center">
            <View className="auth-brand-block">
              <Text className="auth-title">Verify your email</Text>
              <Text className="auth-subtitle">Enter the verification code sent to your email.</Text>
            </View>
            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Verification Code</Text>
                  <TextInput
                    className="auth-input"
                    value={code}
                    placeholder="Enter code"
                    onChangeText={setCode}
                    keyboardType="numeric"
                  />
                  {errors?.fields?.code && (
                     <Text className="auth-error">{errors.fields.code.message}</Text>
                  )}
                </View>
                <Pressable
                  className={`auth-button ${fetchStatus === "fetching" ? "auth-button-disabled" : ""}`}
                  onPress={handleVerify}
                  disabled={fetchStatus === "fetching"}
                >
                  <Text className="auth-button-text">Verify</Text>
                </Pressable>
                <Pressable
                  className="auth-secondary-button mt-4"
                  onPress={() => signUp.verifications.sendEmailCode()}
                >
                  <Text className="auth-secondary-button-text">Resend Code</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <ScrollView className="auth-scroll" contentContainerClassName="grow" automaticallyAdjustKeyboardInsets>
        <View className="auth-content justify-center">
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurly</Text>
                <Text className="auth-wordmark-sub">SMART BILLING</Text>
              </View>
            </View>
            <Text className="auth-title">Create an account</Text>
            <Text className="auth-subtitle">Sign up to start managing your subscriptions</Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={`auth-input ${errors?.fields?.emailAddress ? "auth-input-error" : ""}`}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                />
                {errors?.fields?.emailAddress && (
                  <Text className="auth-error">{errors.fields.emailAddress.message}</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className={`auth-input ${errors?.fields?.password ? "auth-input-error" : ""}`}
                  value={password}
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  onChangeText={setPassword}
                />
                {errors?.fields?.password && (
                  <Text className="auth-error">{errors.fields.password.message}</Text>
                )}
              </View>

              <Pressable
                className={`auth-button ${(!emailAddress || !password || fetchStatus === "fetching") ? "auth-button-disabled" : ""}`}
                onPress={handleSubmit}
                disabled={!emailAddress || !password || fetchStatus === "fetching"}
              >
                <Text className="auth-button-text">Sign up</Text>
              </Pressable>

              <View className="auth-link-row">
                <Text className="auth-link-copy">Already have an account?</Text>
                <Link href="/(auth)/sign-in" asChild>
                  <Pressable>
                    <Text className="auth-link">Sign in</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
