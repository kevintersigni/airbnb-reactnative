import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
import { FlatList, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import RoomCard from "../components/RoomCard";
import LogoTitle from "../components/LogoTitle";

export default function HomeScreen() {
  const heightVertical = 30;
  const tabBarHeight = useBottomTabBarHeight();

  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchRooms = await axios.get(
        "https://express-airbnb-api.herokuapp.com/rooms"
      );
      setRooms(fetchRooms.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <View style={{ justifyContent: "space-between" }}>
      <View style={styles.statusBar} />

      <LogoTitle
        logoStyle={{
          width: heightVertical,
          height: heightVertical,
          marginBottom: 5,
        }}
      />

      <View
        style={{
          marginBottom:
            Constants.statusBarHeight + heightVertical + tabBarHeight,
          borderTopWidth: 0.5,
          borderTopColor: "lightgrey",
        }}
      >
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={rooms}
            renderItem={({ item }) => {
              return <RoomCard item={item} />;
            }}
            keyExtractor={(item) => String(item._id)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  statusBar: {
    backgroundColor: "#FF385C",
    height: Constants.statusBarHeight,
  },
});
