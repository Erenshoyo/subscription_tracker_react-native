import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Signin = () => {
  return (
    <View>
      <Text>Signin</Text>
      <Link href="/(auth)/sign-up">Create Account</Link>
    </View>
  );
};

export default Signin;