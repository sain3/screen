import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function item({ id, title }) {
  return (
    <View style={styles.contents}>
      <Text>{id}</Text>
      <Text>{title}</Text>
    </View>
  );
}

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "A Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "C Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "B Item",
  },
];

function Lists({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.listitems}>
      <TouchableOpacity onPress={() => navigation.navigate("Route")}>
        <Text style={styles.item}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Input")}>
          <Text style={styles.headertext}>
            <Icon name="arrow-back-circle-outline" size={40}></Icon>
          </Text>
        </TouchableOpacity>
        <Text style={styles.headertext}>이동 목록</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Input")}>
          <Text style={styles.headertext}>
            <Icon name="menu-outline" size={40}></Icon>
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contents}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={DATA}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

export default Lists;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.15,
    backgroundColor: "#2c2c2c",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  headertext: {
    color: "white",
    fontSize: 40,
  },
  contents: {
    flex: 1.1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  listitems: {
    borderColor: "black",
    borderStyle: "solid",
    borderBottomWidth: 2,
  },
});
