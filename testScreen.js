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

function Tests() {
  let [data, setdata] = useState([]);
  useEffect(() => {
    // let ab = [];
    // db.transaction((tx) => {
    //   tx.executeSql(`select * from user`, [], (tx, result) => {
    //     ab.push(result.rows._array[0]);
    //     if (ab[0].region === "경기도") {
    //       b();
    //     } else {
    //       a();
    //     }
    //   });
    // });
    a();
    async function a() {
      let firstdata = await First();
      let headdata = await Head(firstdata);
      let taildata = await Tail(headdata);
      let database = await DB(taildata);
    }
    async function b() {
      let incitydata = await InData();
      let database = await IncityDB(incitydata);
    }
    async function InData() {
      db.transaction((tx) => {
        tx.executeSql(`DELETE from home`);
      });
      let ac = [];
      return new Promise(function (resolve) {
        fetch(
          `https://api.odsay.com/v1/api/searchPubTransPathT?lang=0&SX=${ab[0].long}&SY=${ab[0].lat}&EX=127.2635&EY=37.0094&SearchType=0&apiKey=Qg9KzIkJFCV8wMtZUhSJtcOkDn15Crje91AZj/RazU8`
        )
          .then((res) => res.json())
          .then((data) => {
            let arr = data["result"]["path"];
            for (let i = 0; i < arr.length; i++) {
              db.transaction((tx) => {
                tx.executeSql(
                  `insert into home (id, fare, pathType,totalTime) values('${arr[i]["info"].mapObj}','${arr[i]["info"].payment}','${arr[i]["pathType"]}','${arr[i]["info"].totalTime}')`
                );
              });
              let arr2 = arr[i]["subPath"];
              for (let j = 0; j < arr2.length; j++) {
                if (arr2[j].hasOwnProperty("lane") === true) {
                  let arr3 = arr2[j]["lane"];
                  const busno = [];
                  for (let k = 0; k < arr3.length; k++) {
                    busno[k] = JSON.stringify(arr3[k]["busNo"]).replace(
                      /\"/gi,
                      " "
                    );
                  }
                  db.transaction((tx) => {
                    tx.executeSql(
                      `update home set number = ' ${busno}', walkTime ='${arr2[0].sectionTime}' WHERE id = '${arr[i]["info"].mapObj}'`
                    );
                  });
                }
              }
            }
            resolve(ac);
          });
      });
    }
    async function IncityDB() {
      db.transaction((tx) => {
        // 데이터 수정 및 추가 tx.executeSql(`update bye set time ='11:30' WHERE id = '50'`),
        // 레코드 삭제 tx.executeSql(`DELETE from home WHERE id = '1229'`);
        tx.executeSql(`select * from home`, [], (tx, result) => {
          let name = [];
          if (result.rows.length === 0) {
            console.log("bb");
          }
          for (let i = 0; i < result.rows.length; ++i) {
            name.push(result.rows._array[i]);
            console.log(result.rows.item(i));
          }
          setdata(name);
        });
      });
    }
    async function First() {
      db.transaction((tx) => {
        tx.executeSql(`DELETE from home`);
      });
      let ab = [];
      return new Promise(function (resolve) {
        fetch(
          "https://api.odsay.com/v1/api/searchPubTransPathT?lang=0&SX=126.758&SY=35.1991&EX=127.2635&EY=37.0094&SearchType=1&apiKey=Qg9KzIkJFCV8wMtZUhSJtcOkDn15Crje91AZj/RazU8"
        )
          .then((res) => res.json())
          .then((data) => {
            let startx = [];
            let starty = [];
            let endx = [];
            let endy = [];
            let t = 0;
            let sx;
            let sy;
            let ex;
            let ey;
            let time;
            let pay;
            let pathType;
            let arr = data["result"]["path"];
            let endName;
            for (let i = 0; i < arr.length; i++) {
              endName = arr[i]["info"].lastEndStation;
              let arr2 = arr[i]["subPath"];
              if (
                endName === "평택지제" ||
                endName === "안성종합버스터미널" ||
                endName === "평택시외버스터미널" ||
                endName === "평택"
              ) {
                for (let j = 0; j < arr2.length; j++) {
                  if (
                    arr2[j]["endName"] === "평택지제" ||
                    arr2[j]["endName"] === "안성종합버스터미널" ||
                    arr2[j]["endName"] === "평택시외버스터미널" ||
                    arr2[j]["endName"] === "평택"
                  ) {
                    sx = arr2[0]["startX"];
                    sy = arr2[0]["startY"];
                    ex = arr2[j]["endX"];
                    ey = arr2[j]["endY"];
                  }
                }
                if (
                  (startx.includes(sx) === true && starty.includes(sy)) ||
                  (endx.includes(ex) === true && endy.includes(ey) === true)
                ) {
                } else {
                  startx[t] = sx;
                  starty[t] = sy;
                  endx[t] = ex;
                  endy[t] = ey;
                  time = arr[i]["info"].totalTime;
                  pay = arr[i]["info"].totalPayment;
                  pathType = arr[i].pathType;
                  ab.push({
                    sx: startx[t],
                    sy: starty[t],
                    ex: endx[t],
                    ey: endy[t],
                    time: time,
                    pay: pay,
                    pathType: pathType,
                  });
                  t++;
                }
              }
            }

            resolve(ab);
          });
      });
    }
    async function Head(firstdata) {
      let response = [];
      return new Promise(function (resolve) {
        for (let i = 0; i < firstdata.length; i++) {
          fetch(
            `https://api.odsay.com/v1/api/searchPubTransPathT?lang=0&SX=126.758&SY=35.1991&EX=${firstdata[i].sx}&EY=${firstdata[i].sy}&SearchType=0&apiKey=Qg9KzIkJFCV8wMtZUhSJtcOkDn15Crje91AZj/RazU8`
          )
            .then((res) => res.json())
            .then((data) => {
              let pathtype = [];
              let type;
              let k = 0;
              let arr = data["result"]["path"];
              pathtype[k] = type;
              let walktime = arr[0]["subPath"][0].sectionTime;
              let id = arr[0]["info"].mapObj;
              let pay = firstdata[i].pay + arr[0]["info"].payment;
              let time = firstdata[i].time + arr[0]["info"].totalTime;
              response.push({
                pay: pay,
                walktime: walktime,
                id: id,
                pathType: firstdata[i].pathType,
                time: time,
                ex: firstdata[i].ex,
                ey: firstdata[i].ey,
              });

              if (i === firstdata.length - 1) {
                setTimeout(() => {
                  resolve(response);
                }, 2000);
              }
            });
        }
      });
    }
    async function Tail(headdata) {
      let p = [];
      return new Promise(function (resolve) {
        for (let i = 0; i < headdata.length; i++) {
          fetch(
            `https://api.odsay.com/v1/api/searchPubTransPathT?lang=0&SX=${headdata[i].ex}&SY=${headdata[i].ey}&EX=127.2635&EY=37.0094&SearchType=0&apiKey=Qg9KzIkJFCV8wMtZUhSJtcOkDn15Crje91AZj/RazU8`
          )
            .then((res) => res.json())
            .then((data) => {
              let arr = data["result"]["path"];
              let walktime = headdata[i].walktime;
              let id = headdata[i].id;
              let pay = headdata[i].pay + arr[0]["info"].payment;
              let time = headdata[i].time + arr[0]["info"].totalTime;
              db.transaction((tx) => {
                tx.executeSql(
                  `Insert into home (id, fare, pathType, totalTime) values('${id}','${pay}','${headdata[i].pathType}','${time}')`
                );
              });
              p.push({
                pay: pay,
                walktime: walktime,
                id: id,
                pathType: headdata[i].pathType,
                time: time,
              });

              if (i === headdata.length - 1) {
                resolve(p);
              }
            });
        }
      });
    }

    async function DB(alldata) {
      db.transaction((tx) => {
        // 데이터 수정 및 추가 tx.executeSql(`update bye set time ='11:30' WHERE id = '50'`),
        // 레코드 삭제 tx.executeSql(`DELETE from home WHERE id = '1229'`);
        tx.executeSql(`select * from home`, [], (tx, result) => {
          let name = [];
          if (result.rows.length === 0) {
            console.log("bb");
          }
          for (let i = 0; i < result.rows.length; ++i) {
            name.push(result.rows._array[i]);
            console.log(result.rows.item(i));
          }
          setdata(name);
        });
      });

      console.log("정상 실행");
    }
  }, []);
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

  // db.transaction((tx) => {
  //   tx.executeSql(`insert into bye (id, day, time) values('50','목',"13:30")`),
  //     (error) => {
  //       console.log(error);
  //     };
  // });
  // db.transaction((tx) => {
  //   tx.executeSql(`ALTER TABLE home ADD COLUMN day text`);
  // });

  const ItemRender = ({ item }) => (
    <View style={{ alignItems: "center", marginTop: 40 }}>
      <Text>{item.id}</Text>
      <Text>{item.pathType}</Text>
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
          // keyExtractor={(item) => item.id}
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
