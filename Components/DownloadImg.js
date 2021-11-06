import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const { width, height } = Dimensions.get("window");

const DownloadImg = ({ item, scrollXAnimated, index }) => {
  const [loading, setLoading] = useState(false);
  const inputRange = [index - 1, index, index + 1];
  const inputRange1 = [index - 0.5, index, index + 0.5];
  const opacity = scrollXAnimated.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  });
  const translateY = scrollXAnimated.interpolate({
    inputRange: inputRange1,
    outputRange: [50, 0, 50],
  });

  const handleDownload = async (url, id) => {
    const perms = await MediaLibrary.requestPermissionsAsync();
    if (perms.status == "granted") {
      setLoading(true);
      FileSystem.downloadAsync(url, FileSystem.documentDirectory + id + ".jpg")
        .then(async ({ uri }) => {
          const asset = await MediaLibrary.createAssetAsync(uri);
          const album = await MediaLibrary.getAlbumAsync("Wallpaper App");
          if (album == null) {
            await MediaLibrary.createAlbumAsync("Wallpaper App", asset, false);
            setLoading(false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Sorry, we need media permissions to save images!");
    }
  };

  return (
    <View style={[styles.downloadContainer]} key={item.id}>
      <Animated.View
        style={[
          styles.downloadBtn,
          {
            backgroundColor: item.avg_color,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <MaterialIcons
          name="file-download"
          size={30}
          color="#fff"
          onPress={() => {
            handleDownload(item.src.portrait, item.id);
          }}
        />
        {loading && (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                zIndex: 10,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                position: "absolute",
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default DownloadImg;

const styles = StyleSheet.create({
  downloadContainer: {
    position: "absolute",
    top: height - 100,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  downloadBtn: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 10,
  },
});
