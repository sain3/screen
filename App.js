import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Location from "expo-location";
import Main from "./MainScreen";
import Insert from "./TimeScreen";
import Alarm from "./AlarmScreen";
import Tests from "./testScreen";
import Lists from "./ListScreen";
import Routes from "./routeScreen";
import { Alert } from "react-native";
import * as SQLite from "expo-sqlite";

const Stack = createStackNavigator();
const db = SQLite.openDatabase("db.db");
export default function App() {
  const [data, setdata] = useState([]);
  // db.transaction((tx) => {
  //   tx.executeSql(`DELETE from user`);
  // });
  db.transaction(
    (tx) => {
      tx.executeSql(
        `create table if not exists user(id number primary key not null, lat number, long number, region text);`,
        []
      );
    },
    (error) => {
      console.log(error);
    }
  );

  useEffect(() => {
    const getLocation = async () => {
      try {
        await Location.requestForegroundPermissionsAsync();
        const {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync();
        console.log(latitude, longitude);
        const location = await Location.reverseGeocodeAsync(
          { latitude, longitude },
          { useGoogleMaps: false }
        );
        console.log("location", location[0].region);
        db.transaction((tx) => {
          tx.executeSql(
            `insert into user (id, lat, long, region) values('1','${latitude}','${longitude}','${location[0].region}')`
          );
        });
        db.transaction((tx) => {
          tx.executeSql(`select * from user`, [], (tx, result) => {
            console.log(result.rows._array[0]);
          });
        });
      } catch (error) {
        Alert.alert("위치정보 확인을 허용해주세요!");
      }
    };
    getLocation();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="HOME"
          component={Main}
        />
        <Stack.Screen
          options={{ headerShown: false }} //
          name="Input"
          component={Insert}
        />
        <Stack.Screen
          options={{ headerShown: false }} //
          name="Alarm"
          component={Alarm}
        />
        <Stack.Screen
          options={{ headerShown: false }} //
          name="Test"
          component={Tests}
        />
        <Stack.Screen
          options={{ headerShown: false }} //
          name="List"
          component={Lists}
        />
        <Stack.Screen
          options={{ headerShown: false }} //
          name="Route"
          component={Routes}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
