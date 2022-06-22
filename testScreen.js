import React, { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
} from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.db");

// var xhr = new XMLHttpRequest();
// var url =
//   "https://api.odsay.com/v1/api/searchPubTransPathT?lang=0&SX=127.11&SY=36.9927&EX=127.2635&EY=37.0094&SearchType=0&SearchType=0&apiKey=Qg9KzIkJFCV8wMtZUhSJtcOkDn15Crje91AZj/RazU8";
// xhr.open("GET", url, true);
// xhr.send();
// xhr.onreadystatechange = function () {
//   if (xhr.readyState === 4 && xhr.status === 200) {
//     let arr = JSON.parse(xhr.responseText)["result"]["path"];
//     for (let i = 0; i < arr.length; i++) {
//       db.transaction((tx) => {
//         let id = JSON.stringify(arr[i]["info"].mapObj);
//         tx.executeSql(
//           `insert into home (id, fare, totalTime) values (${id}, ${arr[i]["info"].payment}, ${arr[i]["info"].totalTime});`
//         );
//       });
//       let arr2 = arr[i]["subPath"];
//       for (let j = 0; j < arr2.length; j++) {
//         if (arr2[j].hasOwnProperty("lane") === true) {
//           let arr3 = arr2[j]["lane"];
//           const busno = [];
//           for (let k = 0; k < arr3.length; k++) {
//             busno[k] = JSON.stringify(arr3[k]["busNo"]).replace(/\"/gi, " ");
//           }
//           db.transaction((tx) => {
//             tx.executeSql(
//               `update home set number = ' ${busno}' WHERE id = '${arr[i]["info"].mapObj}'`
//             );
//           });
//         }
//       }
//     }
//   }
// };

function Tests() {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `create table if not exists home(id text primary key not null, fare int, totalTime int, number text);`,
        []
      );
    },
    (error) => {
      console.log(error);
    }
  );
  let [data, setdata] = useState([]);
  // db.transaction((tx) => {
  //   tx.executeSql(`insert into bye (id, day, time) values('50','목',"13:30")`),
  //     (error) => {
  //       console.log(error);
  //     };
  // });
  // db.transaction((tx) => {
  //   tx.executeSql(`ALTER TABLE home ADD COLUMN day text`);
  // });
  useEffect(() => {
    db.transaction((tx) => {
      // 데이터 수정 및 추가 tx.executeSql(`update bye set time ='11:30' WHERE id = '50'`),
      // 레코드 삭제 tx.executeSql(`DELETE from home WHERE id = '1229'`);
      tx.executeSql(`select * from home`, [], (tx, result) => {
        let name = [];
        for (let i = 0; i < result.rows.length; ++i) {
          name.push(result.rows._array[i]);
          console.log(result.rows.item(i));
        }
        setdata(name);
      });
    });
  }, []);

  const ItemRender = ({ item }) => (
    <View style={{ alignItems: "center", marginTop: 40 }}>
      <Text>{item.id}</Text>
      <Text>{item.fare}</Text>
      <Text>{item.totalTime}</Text>
      <Text>{item.number}</Text>
    </View>
  );

  return (
    <SafeAreaView>
      <View style={styles.h}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ItemRender item={item} />}
        />
      </View>
    </SafeAreaView>
  );
}

export default Tests;

const styles = StyleSheet.create({
  h: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  text: {
    fontSize: 35,
  },
});
