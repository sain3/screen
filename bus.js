import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

function GetInroute() {
  const [Data, setData] = useState([
    {
      id: "1",
      pathType: "2",
      totalTime: "3",
      payment: "",
      walk: "5",
      startName: "",
      endName: "",
    },
  ]);

  useEffect(() => {
    var xhr = new XMLHttpRequest();
    var url =
      "https://api.odsay.com/v1/api/searchPubTransPathT?lang=0&SX=127.0929&SY=36.9927&EX=127.2635&EY=37.0018&SearchType=0&SearchType=0&apiKey=Qg9KzIkJFCV8wMtZUhSJtcOkDn15Crje91AZj/RazU8";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let arr = JSON.parse(xhr.responseText)["result"]["path"];
        for (let i = 0; i < arr.length; i++) {
          // pathType = 1-지하철, 2-버스, 3- 버스+지하철
          let pathType = arr[i].pathType;
          // 각 대중교통 총 시간
          let totaltime = arr[i]["info"].totalTime;
          // 각 대중교통 총 비용
          let payment = arr[i]["info"].payment;
          let arr2 = arr[i]["subPath"];
          // 이동수단 = 버스
          if (pathType === 2) {
            for (let j = 0; j < arr2.length; j++) {
              // 걷는 시간
              let startName = "";
              let endName = "";
              let walk;
              if (arr2[0].trafficType === 3) {
                walk = arr2[0].sectionTime;
              }
              // 출발 정류장, 하차 정류장
              if (
                arr2[j].hasOwnProperty("startName") &&
                arr2[j].hasOwnProperty("endName")
              ) {
                (startName = arr2[j].startName), (endName = arr2[j].endName);
              }
              // 버스 번호
              if (arr2[j].hasOwnProperty("lane") === true) {
                let arr3 = arr2[j]["lane"];
                let busno = [];
                let t = 1;
                for (let k = 0; k < arr3.length; k++) {
                  busno[k] = JSON.stringify(arr3[k]["busNo"]);
                  console.log(`${totaltime}분 ${payment}원 ${busno[k]}`);
                  setData({
                    ...Data,
                    id: busno,
                    totalTime: totaltime,
                    payment: payment,
                    startName: startName,
                    endName: endName,
                    walk: walk,
                    pathType: pathType,
                  });
                }
              }
            }
          }
          // 이동수단 = 버스+지하철
          if (pathType === 3) {
            console.log("버스+지하철");
            for (let j = 0; j < arr2.length; j++) {
              // 걷는 시간
              if (arr2[j].trafficType === 3) {
                let walk = arr2[j].sectionTime;
                if (j === 0) {
                  console.log(`시작 ${walk}분`);
                } else if (j === arr2.length - 1) {
                  console.log(`마지막 ${walk}분`);
                } else {
                  console.log(`중간 ${walk}분`);
                }
              }
              if (
                arr2[j].hasOwnProperty("startName") &&
                arr2[j].hasOwnProperty("endName")
              ) {
                console.log(arr2[j].startName, arr2[j].endName);
              }
              // 버스 번호
              if (arr2[j].hasOwnProperty("lane") === true) {
                if (arr2[j].trafficType === 2) {
                  let arr3 = arr2[j]["lane"];
                  let busno = [];
                  for (let k = 0; k < arr3.length; k++) {
                    busno[k] = JSON.stringify(arr3[k]["busNo"]);
                    console.log(`${totaltime}분 ${payment}원 ${busno[k]}`);
                  }
                } else {
                  let arr3 = arr2[j]["lane"];
                  let subWayName = [];
                  for (let k = 0; k < arr3.length; k++) {
                    subWayName[k] = JSON.stringify(arr3[k]["name"]);
                    console.log(`${totaltime}분 ${payment}원 ${subWayName[k]}`);
                  }
                }
              }
            }
          }
        }
      }
    };
  }, []);

  const ItemRender = ({ item }) => (
    <View style={styles.list}>
      <Text>{item.id}</Text>
      <Text>{item.startName}</Text>
      <Text>{item.endName}</Text>
      <Text>{item.pathType}</Text>
      <Text>{item.totalTime}</Text>
      <Text>{item.walk}</Text>
      <Text>{item.payment}</Text>
    </View>
  );
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={Data}
            renderItem={({ item }) => <ItemRender item={item} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default GetInroute;
const styles = StyleSheet.create({
  container: {
    height: "50%",
    backgroundColor: "gray",
  },
  h: {
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "black",
  },
  text: {
    fontSize: 35,
  },
  list: {
    height: "50%",
    backgroundColor: "black",
  },
});
