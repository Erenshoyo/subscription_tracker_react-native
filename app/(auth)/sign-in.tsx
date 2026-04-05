import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, View, Pressable, Alert, ScrollView } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const posthog = usePostHog();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    if (!signIn) return;
    
    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        Alert.alert("Sign In Error", error.longMessage || "Failed to sign in.");
        posthog.capture("user_sign_in_failed", {
          email: emailAddress,
          error_message: error.longMessage || "Failed to sign in.",
        });
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session }: any) => {
            posthog.identify(emailAddress, {
              $set: { email: emailAddress },
              $set_once: { first_sign_in_date: new Date().toISOString() },
            });
            posthog.capture("user_signed_in", { email: emailAddress });
            if (session?.currentTask) {
              router.replace(`/${session.currentTask.key}` as any);
              return;
            }
            router.replace("/");
          },
        });
      } else if (signIn.status === "needs_client_trust") {
        await signIn.mfa.sendEmailCode();
      }
    } catch (err: any) {
      const message = err.errors?.[0]?.message || "Something went wrong";
      Alert.alert("Error", message);
      posthog.capture("user_sign_in_failed", {
        email: emailAddress,
        error_message: message,
      });
    }
  };

  const handleVerify = async () => {
    if (!signIn) return;
    try {
      await signIn.mfa.verifyEmailCode({ code });

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session }: any) => {
            if (session?.currentTask) {
              router.replace(`/${session.currentTask.key}` as any);
              return;
            }
            router.replace("/");
          },
        });
      }
    } catch (err: any) {
      Alert.alert("Verification Error", err.errors?.[0]?.message || "Invalid code");
    }
  };

  if (signIn?.status === "needs_client_trust") {
    return (
      <SafeAreaView className="auth-safe-area">
        <ScrollView className="auth-scroll" contentContainerClassName="grow" automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled">
          <View className="auth-content justify-center">
            <View className="auth-brand-block">
              <Text className="auth-title">Verify your account</Text>
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
                  onPress={() => signIn.mfa.sendEmailCode()}
                >
                  <Text className="auth-secondary-button-text">Resend Code</Text>
                </Pressable>
                 <Pressable
                  className="auth-secondary-button mt-2"
                  onPress={() => signIn.reset()}
                >
                  <Text className="auth-secondary-button-text">Start over</Text>
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
      <ScrollView className="auth-scroll" contentContainerClassName="grow" automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled">
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
            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">Sign in to continue managing your subscriptions</Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={`auth-input ${errors?.fields?.identifier ? "auth-input-error" : ""}`}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                />
                {errors?.fields?.identifier && (
                  <Text className="auth-error">{errors.fields.identifier.message}</Text>
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
                <Text className="auth-button-text">Sign in</Text>
              </Pressable>

              <View className="auth-link-row">
                <Text className="auth-link-copy">New to Recurly?</Text>
                <Link href="/(auth)/sign-up" asChild>
                  <Pressable>
                    <Text className="auth-link">Create an account</Text>
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