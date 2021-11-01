import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

import LogoTitle from "../components/LogoTitle";

export default function SignInScreen({ setToken, setId }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [activity, setActivity] = useState(false);
  const [missing, setMissing] = useState(false);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FF385C",
          justifyContent: "space-evenly",
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <LogoTitle
            logoStyle={{ width: 80, height: 80, resizeMode: "contain" }}
          />
          <Text style={styles.title}>Sign in</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              placeholder="email"
              placeholderTextColor="white"
              onChangeText={(text) => {
                setEmail(text);
              }}
              selectionColor="white"
              value={email}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              placeholder="password"
              placeholderTextColor="white"
              selectionColor="white"
              secureTextEntry={secure}
              onChangeText={(text) => {
                setPassword(text);
              }}
              value={password}
            />
            {secure ? (
              <FontAwesome
                name="eye-slash"
                size={24}
                color="white"
                onPress={() => setSecure(!secure)}
              />
            ) : (
              <FontAwesome
                name="eye"
                size={24}
                color="white"
                onPress={() => setSecure(!secure)}
              />
            )}
          </View>
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <TouchableOpacity
              style={styles.button}
              title="Sign in"
              disabled={activity}
              onPress={async () => {
                setActivity(true);
                if (!email || !password) {
                  setMissing(true);
                  setActivity(false);
                  return;
                } else {
                  try {
                    const response = await axios.post(
                      "https://express-airbnb-api.herokuapp.com/user/log_in",
                      { email: email, password: password }
                    );
                    if (response.data.token) {
                      setToken(response.data.token);
                    }
                    if (response.data.id) {
                      console.log(response.data.id);

                      setId(response.data.id);
                    }
                    setMissing(false);
                    setActivity(false);
                  } catch (error) {
                    setActivity(false);
                    alert("Il y a une erreur");
                  }
                }
              }}
            >
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMissing(false);

                navigation.navigate("SignUp");
              }}
            >
              <Text style={styles.linkText}>No account ? Register</Text>
            </TouchableOpacity>
          </View>
          {missing && (
            <Text style={styles.missingFields}>Pleasse fill all fields</Text>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    color: "white",
    fontSize: 16,
    width: 260,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  input: {
    borderBottomColor: "white",
    color: "white",
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    flexDirection: "row",
    width: 300,
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "#FF385C",
    borderRadius: 50,
    height: 60,
    width: 160,
    marginVertical: 20,
    backgroundColor: "white",
  },

  buttonText: {
    color: "#FF385C",
    fontWeight: "600",
    fontSize: 16,
  },
  missingFields: {
    color: "red",
  },
  linkText: {
    color: "white",
    fontSize: 12,
  },
  formContainer: {
    alignItems: "center",
  },
});
