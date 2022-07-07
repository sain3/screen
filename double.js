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

function Double(sx, sy, ex, ey, time, pay, pathType) {
  var xhr2 = new XMLHttpRequest();
  var url2 = `https://api.odsay.com/v1/api/searchPubTransPathT?lang=0&SX=126.7415&SY=35.1963&EX=${sx}&EY=${sy}&SearchType=0&apiKey=Qg9KzIkJFCV8wMtZUhSJtcOkDn15Crje91AZj/RazU8`;
  xhr2.open("GET", url2, true);
  xhr2.send();
  xhr2.onreadystatechange = function () {
    if (xhr2.readyState === 4 && xhr2.status === 200) {
      let arr = JSON.parse(xhr.responseText)["result"]["path"];
      for (let i = 0; i < arr.length; i++) {
        db.transaction((tx) => {
          let id = JSON.stringify(arr[i]["info"].mapObj);
          console.log(id);
          pay = pay + arr[i]["info"].payment;
          time = time + arr[i]["info"].totalTime;
          tx.executeSql(
            `insert into home (id, pathType) values (${id}, ${pathType});`
          );
        });

        Twice(ex, ey, pay, time, id);
      }
    }
  };
  const Twice = (ex, ey, pay, time, id) => {
    var xhr3 = new XMLHttpRequest();
    var url3 = `https://api.odsay.com/v1/api/searchPubTransPathT?lang=0&SX=${ex}&SY=${ey}&EX=127.2635&EY=37.0094&SearchType=0&apiKey=Qg9KzIkJFCV8wMtZUhSJtcOkDn15Crje91AZj/RazU8`;
    xhr3.open("GET", url3, true);
    xhr3.send();
    xhr3.onreadystatechange = function () {
      if (xhr3.readyState === 4 && xhr3.status === 200) {
        let arr = JSON.parse(xhr.responseText)["result"]["path"];
        for (let i = 0; i < arr.length; i++) {
          pay = pay + arr[i]["info"].payment;
          time = time + arr[i]["info"].totalTime;
          db.transaction((tx) => {
            tx.executeSql(
              `update home set fare = '${pay}', totalTime = '${time}' WHERE id ='${id}'`
            );
          });

          let arr2 = arr[i]["subPath"];
          let walk;
          if (arr2[0].trafficType === 3) {
            walk = arr2[0].sectionTime;
            db.transaction((tx) => {
              tx.executeSql(
                `update home set walktime = '${walk}' WHERE id = '${id}'`
              );
            });
          }
        }
      }
    };
  };
}

export default Double();
