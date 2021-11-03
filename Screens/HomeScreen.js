import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createClient } from "pexels";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";

const { width, height } = Dimensions.get("window");
const IMG_WIDTH = width * 0.75;
const IMG_HEIGHT = IMG_WIDTH * 1.5;
const SPACING = 20;

const BackImg = ({ item, scrollX, index }) => {
  const inputRange = [
    (index - 2) * IMG_WIDTH,
    (index - 1) * IMG_WIDTH,
    index * IMG_WIDTH,
  ];
  const opacity = scrollX.interpolate({
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

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const client = createClient(
    "563492ad6f91700001000001ebfdf8ae94bc4db987151b1efdc48f15"
  );

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    client.photos
      .curated({ per_page: 50 })
      .then((photos) => {
        setData([
          { id: "left_spacer" },
          ...photos.photos,
          { id: "right_spacer" },
        ]);
        // setData(photos.photos);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      {loading ? (
        <View style={styles.BgContainer}>
          <ActivityIndicator size="large" color="#4d006b" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* {data.map((item, index) => {
            const inputRange = [
              (index - 2) * IMG_WIDTH,
              (index - 1) * IMG_WIDTH,
              index * IMG_WIDTH,
            ];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
            });
            return (
              <>
                <Animated.View
                  key={index}
                  style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: item.avg_color, opacity },
                  ]}
                />
              </>
            );
          })} */}
          {data.map((item, index) => {
            return <BackImg item={item} scrollX={scrollX} index={index} />;
          })}

          <Animated.FlatList
            data={data}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            decelerationRate={"fast"}
            initialNumToRender={10}
            snapToInterval={IMG_WIDTH}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            renderItem={({ item, index }) => {
              if (!item.src) {
                return (
                  <View
                    style={{
                      width: (width - IMG_WIDTH) / 2,
                    }}
                  />
                );
              }
              const inputRange = [
                (index - 2) * IMG_WIDTH,
                (index - 1) * IMG_WIDTH,
                index * IMG_WIDTH,
              ];
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [1.5, 1.3, 1.5],
              });
              const translateY = scrollX.interpolate({
                inputRange,
                outputRange: [60, 10, 60],
              });
              return (
                <View style={{ width: IMG_WIDTH, alignSelf: "center" }}>
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        navigation.navigate("Wallpaper", { item });
                      }}
                      style={[
                        styles.imgContainer,
                        { transform: [{ translateY }] },
                      ]}
                    >
                      <Animated.Image
                        source={{ uri: item.src.portrait }}
                        style={[styles.img, { transform: [{ scale }] }]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  BgContainer: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  imgContainer: {
    marginHorizontal: SPACING,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    overflow: "hidden",
  },
  img: {
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    margin: 0,
  },
});
