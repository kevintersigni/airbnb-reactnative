import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/core";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SwiperFlatList } from "react-native-swiper-flatlist";
import { Ionicons } from "@expo/vector-icons";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

export default function RoomScreen() {
  const { params } = useRoute();

  const [isLoading, setIsLoading] = useState(true);
  const [room, setRoom] = useState(null);
  const [userCoords, setUserCoords] = useState({});
  const [error, setError] = useState();
  const [descriptionVisible, setDescriptionVisible] = useState(3);

  useEffect(() => {
    const getPermission = async () => {
      try {
        const response = await Location.requestForegroundPermissionsAsync();
        if (response.status === "granted") {
          const location = await Location.getCurrentPositionAsync();
          setUserCoords({
            latitude: location.coords.latitutde,
            longitude: location.coords.longitude,
          });
        } else {
          setError(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getPermission();

    const fetchData = async () => {
      try {
        const fetchRoom = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${params.roomId}`
        );
        setRoom(fetchRoom.data);

        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const displayStars = (ratingvalue) => {
    const tab = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= ratingvalue) {
        tab.push(<Ionicons key={i} name="star" size={24} color="gold" />);
      } else {
        tab.push(<Ionicons key={i} name="star" size={24} color="lightgrey" />);
      }
    }
    return tab;
  };

  return (
    <>
      {error && <Text>⚠️ Géolocalisation refusée.</Text>}
      {isLoading ? (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#FF385C" />
        </View>
      ) : (
        <ScrollView
          style={styles.roomCard}
          contentContainerStyle={{ justifyContent: "space-between" }}
        >
          <View>
            <View style={styles.carouselContainer}>
              <SwiperFlatList
                index={0}
                showPagination
                data={room.photos.map((url, index) => {
                  const keys = Object.keys(url);

                  return url[keys[0]];
                })}
                renderItem={({ item }) => (
                  <View style={[styles.carouselChild]}>
                    <Image
                      source={{
                        uri: item,
                      }}
                      style={styles.imageRoom}
                    />
                  </View>
                )}
              />
              <View style={styles.priceContainer}>
                <Text style={styles.priceValue}>{room.price} €</Text>
              </View>
            </View>

            <View style={styles.totalInfoContainer}>
              <View style={styles.infoContainer}>
                <View style={styles.infoSubContainer}>
                  <Text style={styles.roomTitle} numberOfLines={1}>
                    {room.title}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingStars}>
                      {displayStars(room.ratingValue)}
                    </Text>
                    <Text>{room.reviews} reviews</Text>
                  </View>
                </View>
                <View>
                  <Image
                    source={{
                      uri: room.user.account.photo.url,
                    }}
                    style={styles.imageHost}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setDescriptionVisible(null);
                }}
                style={{
                  paddingVertical: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text numberOfLines={descriptionVisible}>
                  {room.description}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ height: 300, width: "100%" }}
            initialRegion={{
              latitude: 48.856614,
              longitude: 2.3522219,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            showsUserLocation
          >
            <MapView.Marker
              coordinate={{
                latitude: room.location[1],
                longitude: room.location[0],
              }}
            ></MapView.Marker>
          </MapView>
        </ScrollView>
      )}
    </>
  );
}
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    position: "relative",
  },
  carouselChild: {
    width,
    justifyContent: "center",
  },
  totalInfoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  ratingStars: {
    marginRight: 5,
  },
  roomCard: {
    flex: 1,
  },
  roomTitle: {
    fontSize: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  infoSubContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageRoom: {
    height: 250,
    justifyContent: "flex-end",
  },
  imageHost: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  priceContainer: {
    backgroundColor: "black",
    opacity: 0.8,
    width: 80,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: "absolute",
    bottom: 10,
  },
  priceValue: {
    color: "white",
    fontSize: 18,
  },
});
