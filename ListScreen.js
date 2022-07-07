import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

function Lists({ navigation, route }) {
  const [data, setdata] = useState([]);
  const [sortdata, setsortdata] = useState([]);
  useEffect(() => {
    b();
    async function b() {
      let incitydata = await InData();
      let database = await IncityDB(incitydata);
    }
    async function InData() {
      return new Promise(function (resolve) {
        db.transaction((tx) => {
          let name = [];
          tx.executeSql(`select * from home`, [], (tx, result) => {
            for (let i = 0; i < result.rows.length; ++i) {
              name.push(result.rows._array[i]);
              setdata(name);
              console.log(data);
            }
          });
        });
      });
    }
  }, []);
  const [a, seta] = useState("");
  useEffect(() => {
    setsortdata(sortdata);
  }, []);
  const [visible, setVisible] = useState(false);
  const hideMenu = () => {
    setVisible(false);
  };
  const showMenu = () => setVisible(true);
  // const sort_Array_Alphabetically = () => {
  //   setsortdata(
  //     data.sort(function (a, b) {
  //       return parseFloat(a.totalTime) - parseFloat(b.totalTime);
  //     })
  //   );
  // };
  const setTime = (a) => {
    let time = new Date();
    let current = time.getHours() * 60 + time.getMinutes();
    let hour = parseInt((current - a) / 60);
    let minute = (current - a) % 60;
    return `${hour}시 ${minute}분`;
  };
  const ItemRender = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Route", {
          id: item.id,
          ns: route.params.id,
        })
      }
    >
      <SafeAreaView>
        <View style={styles.list}>
          <Text style={styles.itemtime}>
            도착시간 : {setTime(item.totalTime)}
          </Text>
          <View style={styles.path}>
            {item.pathType === 2 ? (
              <Icon size={50} name="bus-outline"></Icon>
            ) : (
              <Icon size={50} name="train-outline"></Icon>
            )}
            {item.pathType === 2 ? (
              <Text>{item.number}</Text>
            ) : (
              <Text>{item.subwayName}</Text>
            )}
          </View>
          <Text style={styles.fare}>요금 : {item.fare.toLocaleString()}원</Text>
        </View>
      </SafeAreaView>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headertext}>
            <Icon name="chevron-back-outline" size={55}></Icon>
          </Text>
        </TouchableOpacity>
        <Text style={styles.headertext}>이동 목록</Text>
        <Menu
          visible={visible}
          anchor={
            <Text onPress={showMenu} style={styles.headertext}>
              <Icon name="menu-outline" size={55}></Icon>
            </Text>
          }
          onRequestClose={hideMenu}
        >
          <MenuItem
            onPress={() => {
              seta("빠른시간 순");
              setVisible(false);
            }}
          >
            빠른시간 순 {"    "}
            {a === "빠른시간 순" ? (
              <Icon name="checkmark-outline" size={20} />
            ) : (
              ""
            )}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onPress={() => {
              seta("최저요금 순");
              setVisible(false);
            }}
          >
            최저요금 순{"    "}
            {a === "최저요금 순" ? (
              <Icon
                style={{ direction: "rtl" }}
                name="checkmark-outline"
                size={20}
              />
            ) : (
              ""
            )}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onPress={() => {
              seta("최저환승 순");
              setVisible(false);
            }}
          >
            최저환승 순{"    "}
            {a === "최저환승 순" ? (
              <Icon
                style={{ direction: "rtl" }}
                name="checkmark-outline"
                size={20}
              />
            ) : (
              ""
            )}
          </MenuItem>
        </Menu>
      </View>
      <View style={styles.contents}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          extraData={data}
          data={data}
          renderItem={(itemData) => <ItemRender item={itemData.item} />}
        />
      </View>
    </SafeAreaView>
  );
}

export default Lists;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1f5fe",
  },
  header: {
    flex: 0.15,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  headertext: {
    color: "black",
    fontWeight: "bold",
    fontSize: 40,
  },
  contents: {
    flex: 1.1,
    backgroundColor: "white",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },

  list: {
    justifyContent: "space-around",
    height: 100,
    borderColor: "#d3d3d3",
    borderStyle: "solid",
    borderBottomWidth: 2,
  },
  itemtime: {
    textAlign: "left",
    fontSize: 33,
  },
  path: {
    position: "absolute",
    right: 0,
    width: 100,
    alignItems: "center",
  },
  fare: {
    fontSize: 20,
  },
});
