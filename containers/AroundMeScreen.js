import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import MapView, {
  PROVIDER_GOOGLE,
  Callout,
  CalloutSubview,
} from "react-native-maps";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";

import LogoTitle from "../components/LogoTitle";

export default function AroundMeScreen({ goRoom }) {
  const navigation = useNavigation();

  const height = Dimensions.get("window").height;
  const tabBarHeight = useBottomTabBarHeight();

  const heightVertical = 30;

  const heightMap = height - heightVertical - tabBarHeight;

  const [rooms, setRooms] = useState();
  const [userCoords, setUserCoords] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPermission = async () => {
      try {
        const response = await Location.requestForegroundPermissionsAsync();
        if (response.status === "granted") {
          const location = await Location.getCurrentPositionAsync();
          setUserCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          const response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`
          );

          setRooms(response.data);
          setIsLoading(false);
        } else {
          const response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around`
          );

          setRooms(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getPermission();
  }, []);

  return (
    <View>
      <View style={styles.statusBar} />

      <View>
        <LogoTitle
          logoStyle={{
            width: heightVertical,
            height: heightVertical,
            marginBottom: 5,
          }}
        />

        {isLoading ? (
          <Text>Loading</Text>
        ) : (
          <View>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ height: heightMap }}
              initialRegion={{
                latitude: userCoords.latitude || 48.856614,
                longitude: userCoords.longitude || 2.3522219,
                longitudeDelta: 0.2,
                latitudeDelta: 0.2,
              }}
              showsUserLocation
            >
              {rooms.map((room, index) => {
                return (
                  <MapView.Marker
                    key={room._id}
                    title={room.title}
                    coordinate={{
                      latitude: room.location[1],
                      longitude: room.location[0],
                    }}
                  >
                    <Callout
                      style={{ height: 100 }}
                      onPress={() => {
                        navigation.navigate("Room", { roomId: room._id });
                      }}
                    >
                      <Text>{room.title}</Text>

                      <CalloutSubview
                        style={{
                          width: "auto",
                          backgroundColor: "rgba(255,255,255,0.7)",
                          paddingHorizontal: 6,
                          paddingVertical: 6,
                          borderRadius: 12,
                          alignItems: "center",
                          marginHorizontal: 10,
                          marginVertical: 10,
                        }}
                      >
                        <Text>Voir l'annonce</Text>
                      </CalloutSubview>
                    </Callout>
                  </MapView.Marker>
                );
              })}
            </MapView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#FF385C",
    height: Constants.statusBarHeight,
  },
});
