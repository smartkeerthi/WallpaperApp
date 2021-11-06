import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { createClient } from "pexels";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlingGestureHandler,
  Directions,
  State,
} from "react-native-gesture-handler";
import BackImg from "../Components/BackImg";
import DownloadImg from "../Components/DownloadImg";

const { width, height } = Dimensions.get("window");
const IMG_WIDTH = width * 0.85;
const IMG_HEIGHT = IMG_WIDTH * 1.7;
const SPACING = 20;

// const BackImg = ({ item, scrollXAnimated, index }) => {
//   const inputRange = [index - 1, index, index + 1];
//   const opacity = scrollXAnimated.interpolate({
//     inputRange,
//     outputRange: [0, 1, 0],
//   });

//   if (!item.src) {
//     return null;
//   }
//   return (
//     <Animated.View
//       key={item.id}
//       style={[
//         StyleSheet.absoluteFillObject,
//         { backgroundColor: item.avg_color, opacity },
//       ]}
//     ></Animated.View>
//   );
// };

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const scrollXIndex = useRef(new Animated.Value(0)).current;
  const scrollXAnimated = useRef(new Animated.Value(0)).current;

  const client = createClient(
    "563492ad6f91700001000001ebfdf8ae94bc4db987151b1efdc48f15"
  );

  const VISIBLE_CARD = 3;

  const setActiveIndex = useCallback((activeIndex) => {
    scrollXIndex.setValue(activeIndex);
    setIndex(activeIndex);
  });

  useEffect(() => {
    client.photos
      .search({ query: "wallpaper", per_page: 80 })
      .then((photos) => {
        setData(photos.photos);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  }, []);

  useEffect(() => {
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <FlingGestureHandler
      key="left"
      direction={Directions.LEFT}
      onHandlerStateChange={(ev) => {
        if (ev.nativeEvent.state === State.END) {
          if (index === data.length - 1) {
            return;
          }
          setActiveIndex(index + 1);
        }
      }}
    >
      <FlingGestureHandler
        key="right"
        direction={Directions.RIGHT}
        onHandlerStateChange={(ev) => {
          if (ev.nativeEvent.state === State.END) {
            if (index === 0) {
              return;
            }
            setActiveIndex(index - 1);
          }
        }}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
          <StatusBar style="light" />
          {loading ? (
            <View style={styles.BgContainer}>
              <ActivityIndicator size="large" color="#4d006b" />
            </View>
          ) : (
            <>
              {data.map((item, index) => {
                return (
                  <BackImg
                    key={item.id}
                    item={item}
                    scrollXAnimated={scrollXAnimated}
                    index={index}
                  />
                );
              })}
              <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                horizontal
                inverted
                scrollEnabled={false}
                removeClippedSubviews={false}
                CellRendererComponent={({
                  item,
                  index,
                  children,
                  style,
                  ...props
                }) => {
                  const newStyle = [style, { zIndex: data.length - index }];
                  return (
                    <View {...props} style={newStyle} index={index}>
                      {children}
                    </View>
                  );
                }}
                contentContainerStyle={{
                  flex: 1,
                  justifyContent: "center",
                  padding: SPACING,
                }}
                renderItem={({ item, index }) => {
                  const inputRange = [index - 1, index, index + 1];
                  const translateX = scrollXAnimated.interpolate({
                    inputRange,
                    outputRange: [50, 0, -100],
                  });
                  const scale = scrollXAnimated.interpolate({
                    inputRange,
                    outputRange: [0.8, 1, 1.3],
                  });
                  const opacity = scrollXAnimated.interpolate({
                    inputRange,
                    outputRange: [1 - 1 / VISIBLE_CARD, 1, 0],
                  });
                  return (
                    <Animated.View
                      style={{
                        position: "absolute",
                        left: -IMG_WIDTH / 2,
                        top: (height - IMG_HEIGHT) / 2 - 50,
                        transform: [{ translateX }, { scale }],
                        opacity,
                      }}
                    >
                      <Image
                        source={{ uri: item.src.portrait }}
                        style={{
                          width: IMG_WIDTH,
                          height: IMG_HEIGHT,
                          borderRadius: 20,
                        }}
                      />
                    </Animated.View>
                  );
                }}
              />

              {data.map((item, index) => {
                return (
                  <DownloadImg
                    key={item.id}
                    item={item}
                    index={index}
                    scrollXAnimated={scrollXAnimated}
                  />
                );
              })}
            </>
          )}
        </SafeAreaView>
      </FlingGestureHandler>
    </FlingGestureHandler>
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
