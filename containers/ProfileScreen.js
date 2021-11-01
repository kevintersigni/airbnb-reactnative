import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import LogoTitle from "../components/LogoTitle";

export default function ProfileScreen({ userId, userToken, setToken, setId }) {
  const heightVertical = 30;

  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedPicture, setSelectedPicture] = useState(null);

  const createTwoButtonAlert = () =>
    Alert.alert(
      "Well done 🎉",
      "Your profile has been updated !",
      [{ text: "OK" }],
      { cancelable: false }
    );

  const cameraRollPerm = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
          setSelectedPicture(result.uri);
        } else {
          alert("Pas d'image sélectionnée");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const cameraPerm = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled) {
          setSelectedPicture(result.uri);
        } else {
          alert("Pas de photo prise");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setUser(response.data);
        setProfilePicture(response.data.photo[0].url);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    setUploading(true);
    if (selectedPicture) {
      const tab = selectedPicture.split(".");

      const formDataPicture = new FormData();
      formDataPicture.append("photo", {
        uri: selectedPicture,
        name: `profilePicture-${userId}`,
        type: `image/${tab[tab.length - 1]}`,
      });

      try {
        const response = await axios.put(
          `https://express-airbnb-api.herokuapp.com/user/upload_picture`,
          formDataPicture,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setSelectedPicture(null);
        setProfilePicture(response.data.photo[0].url);
      } catch (error) {
        console.log(error.message);
      }
    }

    if (isModified) {
      const formData = new FormData();
      formData.append(
        "description",
        description ? description : user.description
      );
      formData.append("email", email ? email : user.email);
      formData.append("username", username ? username : user.username);

      try {
        const response = await axios.put(
          `https://express-airbnb-api.herokuapp.com/user/update`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setDescription("");
        setUsername("");
        setEmail("");
        setIsModified(false);
      } catch (error) {
        console.log(error.response);
      }
    } else if (!selectedPicture) {
      alert("Aucune modification apportée.");
    }
    setUploading(false);
    createTwoButtonAlert();
  };

  return (
    <>
      <View style={styles.statusBar} />
      <LogoTitle
        logoStyle={{
          width: heightVertical,
          height: heightVertical,
          marginBottom: 5,
        }}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
        }}
      >
        {isLoading ? (
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#FF385C" />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "space-evenly",
              paddingVertical: 20,
            }}
          >
            <View style={styles.profilePictureContainer}>
              {selectedPicture ? (
                <TouchableOpacity onPress={cameraRollPerm}>
                  <Image
                    source={{ uri: selectedPicture }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              ) : profilePicture ? (
                <TouchableOpacity onPress={cameraRollPerm}>
                  <Image
                    source={{ uri: profilePicture }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={cameraRollPerm}>
                  <Ionicons name={"person"} size={48} color="grey" />
                </TouchableOpacity>
              )}

              <View style={styles.getPicturesContainer}>
                <TouchableOpacity onPress={cameraRollPerm}>
                  <Ionicons name="ios-images-sharp" size={24} color="grey" />
                </TouchableOpacity>
                <TouchableOpacity onPress={cameraPerm}>
                  <Ionicons name="camera-sharp" size={24} color="grey" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.profileUpdateContainer}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setUsername(text), setIsModified(true);
                }}
                defaultValue={user.username}
              ></TextInput>
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setEmail(text), setIsModified(true);
                }}
                defaultValue={user.email}
              ></TextInput>

              <TextInput
                style={styles.inputBox}
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => {
                  setDescription(text), setIsModified(true);
                }}
                defaultValue={user.description}
              />
            </View>

            <View style={styles.touchablesContainer}>
              {email || description || username || selectedPicture ? (
                <TouchableOpacity
                  onPress={handleUpdateProfile}
                  style={styles.buttonUpdate}
                >
                  {uploading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonUpdateText}>Update</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity disabled style={styles.buttonDisabled}>
                  <Text style={styles.buttonDisabledText}>Update</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                title="Log Out"
                style={styles.buttonLogOut}
                onPress={() => {
                  setToken(null);
                  setId(null);
                }}
              >
                <Text style={styles.buttonLogOutText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#FF385C",
  },
  statusBar: {
    backgroundColor: "#FF385C",
    height: Constants.statusBarHeight,
  },
  profileScreenContainer: {},
  profilePictureContainer: {
    alignItems: "center",
  },
  getPicturesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    width: 100,
  },
  profileUpdateContainer: {
    alignItems: "center",
  },
  input: {
    borderBottomColor: "#FF385C",
    color: "black",
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    width: 260,
    marginBottom: 10,
  },
  inputBox: {
    borderColor: "#FF385C",
    color: "black",
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    height: 80,
    width: 260,
    marginVertical: 10,
  },
  touchablesContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  buttonUpdate: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "#FF385C",
    borderRadius: 50,
    height: 50,
    width: 160,
    marginVertical: 20,
    backgroundColor: "#FF385C",
  },
  buttonDisabled: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "lightgrey",
    borderRadius: 50,
    height: 50,
    width: 160,
    marginVertical: 20,
    backgroundColor: "lightgrey",
  },
  buttonLogOut: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "#FF385C",
    borderRadius: 50,
    height: 50,
    width: 160,
    backgroundColor: "white",
  },
  buttonUpdateText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonDisabledText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonLogOutText: {
    color: "#FF385C",
    fontWeight: "600",
    fontSize: 14,
  },
});
