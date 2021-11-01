import React from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LogoTitle from "../components/LogoTitle";

export default function SettingsScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <LogoTitle logoStyle={{ width: 40, height: 40 }} />
          <Text>Hello Settings</Text>
          <Button
            title="Log Out"
            onPress={() => {
              setToken(null);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "red",
  },
});
