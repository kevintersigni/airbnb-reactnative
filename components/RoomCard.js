import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function RoomCard({ item }) {
  const navigation = useNavigation();

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
    <TouchableOpacity
      style={styles.roomCard}
      title="Go to Room"
      onPress={() => {
        navigation.navigate("Room", {
          roomId: item._id,
        });
      }}
    >
      <View>
        <View>
          <ImageBackground
            source={{
              uri: item.photos[0].url,
            }}
            style={styles.imageRoom}
          >
            <View style={styles.priceContainer}>
              <Text style={styles.priceValue}>{item.price} €</Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoSubContainer}>
            <Text style={styles.roomTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStars}>
                {displayStars(item.ratingValue)}
              </Text>
              <Text>{item.reviews} reviews</Text>
            </View>
          </View>
          <View>
            <Image
              source={{
                uri: item.user.account.photo.url,
              }}
              style={styles.imageHost}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ratingStars: {
    marginRight: 5,
  },
  roomCard: {
    flex: 1,
    // borderBottomColor: "lightgrey",
    // borderBottomWidth: 0.5,
    marginBottom: 20,
  },
  roomTitle: {
    fontSize: 20,
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
    marginBottom: 10,
  },
  priceValue: {
    color: "white",
    fontSize: 18,
  },
});
