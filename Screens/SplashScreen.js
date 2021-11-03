import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";

const SplashScreen = () => {
  const ZoomInAnimation = {
    0: {
      opacity: 0,
      scale: 2,
    },
    0.7: {
      opacity: 0.3,
      scale: 1,
    },
    1: {
      opacity: 1,
      scale: 0.9,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Animatable.Image
        animation={ZoomInAnimation}
        duration={1000}
        source={require("../assets/logo.png")}
        style={styles.logoImg}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4d006b",
  },
  logoImg: {
    width: 180,
    height: 180,
  },
});
