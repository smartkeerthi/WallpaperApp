import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

const WallpaperScreen = ({ navigation, route }) => {
  const { item } = route.params;
  return (
    <>
      <StatusBar hidden={true} />
      <MaterialIcons
        name="arrow-back"
        size={24}
        color="#fff"
        style={styles.backBtn}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Image
        source={{ uri: item.src.original }}
        style={[StyleSheet.absoluteFillObject, { transform: [{ scale: 1.2 }] }]}
      />
    </>
  );
};

export default WallpaperScreen;

const styles = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: 25,
    left: 20,
    zIndex: 2,
  },
});
