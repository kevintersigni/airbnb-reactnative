import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import LogoTitle from "../components/LogoTitle";

export default function SignUpScreen({ setToken }) {
  const height = Dimensions.get("window").height;

  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [activity, setActivity] = useState(false);
  const [missing, setMissing] = useState("");
  const [unmatch, setUnmatch] = useState("");

  const handleSubmit = async () => {
    setActivity(true);

    if (!email || !username || !description || !password) {
      setMissing("Please fill all fields");
      setActivity(false);
    } else if (password !== confirmPassword) {
      setMissing("");

      setActivity(false);
    } else {
      setMissing("");
      setUnmatch("");
      try {
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/sign_up",
          {
            email,
            username,
            description,
            password,
          }
        );
        if (response.data.token) {
          setToken(response.data.token);
        }
        const user = response.data;
        console.log(user);
        setUser(user);
        setActivity(false);
        Alert.alert(null, "Vous êtes bien inscrit");
      } catch (error) {
        Alert.alert(null, error.response.data.error);
        setActivity(false);
        console.log(error.response);
      }
    }
  };

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
          <Text style={styles.title}>Sign up</Text>
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
              value={email}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              placeholder="username"
              placeholderTextColor="white"
              onChangeText={(text) => {
                setUsername(text);
              }}
              value={username}
            />
          </View>
          <View style={styles.inputMulti}>
            <TextInput
              style={styles.textInputMulti}
              placeholder="describe yourself in a few words..."
              placeholderTextColor="#FF385C"
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => setDescription(text)}
              value={description}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              placeholder="password"
              placeholderTextColor="white"
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
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              placeholder="confirm password"
              placeholderTextColor="white"
              secureTextEntry={secureConfirm}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (text === password) {
                  setUnmatch("");
                } else {
                  setUnmatch("Passwords must be the same");
                }
              }}
              value={confirmPassword}
            />
            {secureConfirm ? (
              <FontAwesome
                name="eye-slash"
                size={24}
                color="white"
                onPress={() => setSecureConfirm(!secureConfirm)}
              />
            ) : (
              <FontAwesome
                name="eye"
                size={24}
                color="white"
                onPress={() => setSecureConfirm(!secureConfirm)}
              />
            )}
          </View>

          <View
            style={{
              // flex: 1,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.button}
              title="Sign up"
              disabled={activity}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignIn");
              }}
            >
              <Text style={styles.linkText}>
                Already have an account ? Sign in
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.missingFields}>{unmatch}</Text>

          <Text style={styles.missingFields}>{missing}</Text>
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
  textInputMulti: {
    color: "grey",
    fontSize: 14,
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
  inputMulti: {
    borderColor: "white",
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: 300,
    height: 80,
    marginVertical: 10,
    backgroundColor: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "red",
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
