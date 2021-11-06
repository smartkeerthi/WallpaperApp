import React from "react";
import { Animated, StyleSheet, View } from "react-native";

const BackImg = ({ item, scrollXAnimated, index }) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = scrollXAnimated.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  });

  if (!item.src) {
    return null;
  }
  return (
    <Animated.View
      key={item.id}
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: item.avg_color, opacity },
      ]}
    ></Animated.View>
  );
};

export default BackImg;
