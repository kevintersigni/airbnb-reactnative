import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/core";

export default function LogoTitle({ logoStyle }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Image style={logoStyle} source={require("../assets/logo-white.png")} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF385C",
    paddingVertical: 5,
  },
});
