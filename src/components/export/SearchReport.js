import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import styled from "@react-pdf/styled-components";
import { defaultProps } from "react-lines-ellipsis";
import northarrow from "../../assets/imgs/north-arrow.png";
import Barchart from "../maps/SidePanel/Others/MyBarChart";
import html2canvas from "html2canvas";

const Body = styled.Page`
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  width: 100vw;
  padding: 0.5in;
`;

const Header = styled.View`
  width: 100%;
`;

const TextAreaGrey = styled.View`
  width: 100%;
  background-color: #f9fafc;
  margin: 8px 0 8px 0;
  padding: 8px;
  border-radius: 5px;
`;

const TextList = styled.View`
  width: 100%;
  background-color: #f9fafc;
  margin: 8px 0 8px 0;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Item = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0px 2px 0 2px;
  min-width:120px;
  
  margin: 2px 2px 2px 2px;
`;

const styles = StyleSheet.create({
  section: {
    flexGrow: 1,
  },
  subtitle: {
    fontSize: 12,
    margin: "5px 0 5px 0",
    textAlign: "center",
  },
  textArea: {
    backgroundColor: "#f6f6f5",
    width: "100%",
  },
  title: {
    fontSize: 12,
    margin: "5px 0 5px 0",
  },
  fMd: {
    fontSize: 11,
    margin: "5px 0 5px 0",
  },

  legend: {
    fontSize: 8,
    margin: "3px 0 3px 0",
  },

  map: {
    //display: "flex",
    flexDirection: "row",
    //justifyContent: "space-between"
  },

  northarrow: {
    position: "absolute",
    right: "20px",
    top: "25px",
    width: "15px",
    height: "30px",
    // marginTop: "20px",
  },
  blob: {
    width: "120%",
    height: "250px",
  },
  rightAligned: {
    justifyContent: "flex-end",
  },
  line: {
    width: "100%",
    line: "1px solid pink",
  },
  paddingTop: {
    paddingTop: 6,
  },
});


const SearchReport = ({ blob, body, pChartImgUrl, bChartImgUrl }) => {
  var todayDate = new Date().toISOString().slice(0, 10);

  return (
    <Document>
      <Body>
        <View style={styles.section}>
          <Header>
            <Text style={styles.subtitle}>KSA DATA PORTAL</Text>
          </Header>
          <TextAreaGrey>
            <Text style={styles.fMd}>Title : {body["attributes"].Title}</Text>
            <Text style={styles.fMd}>Date {todayDate}</Text>
          </TextAreaGrey>

          <TextAreaGrey>
            <Text style={styles.title}>MAP SECTION</Text>
            <View style={styles.map}>
              <Image style={styles.blob} src={blob} />
              <Image style={styles.northarrow} src={northarrow} />
            </View>
            <Text style={styles.fMd}>
              Description. {body["attributes"].Description}
            </Text>
            <Text style={styles.fMd}>Theme : {body["attributes"].Theme}</Text>
            <Text style={styles.fMd}>
              Type of Data. {body["attributes"].Type}
            </Text>
          </TextAreaGrey>

          <TextAreaGrey>
            <Text style={styles.title}>Charts</Text>
            <TextList>

            </TextList>
          </TextAreaGrey>

          <TextAreaGrey>
            <Text style={styles.title}>Legend</Text>
            <TextList>
              {body?.style?.classes ? (
                body?.style?.classes?.length > 0 &&
                body?.style?.classes?.map((item, index) => {
                  return (
                    <Item>
                      <View
                        style={{
                          width: "15px",
                          height: "15px",
                          backgroundColor: item.color,
                          margin: "2px",
                        }}
                      ></View>
                      <Text key={index} style={styles.legend}>
                        {item.name}
                      </Text>
                    </Item>
                  );
                })
              ) : (
                <Text>This data has no legend</Text>
              )}
            </TextList>
          </TextAreaGrey>
          <Text style={styles.title}></Text>
          <Text style={styles.title}>Charts and Graphs</Text>
          <View style={styles.map}>
            {pChartImgUrl && <Image style={styles.blob} src={pChartImgUrl} />}
            {bChartImgUrl && <Image style={styles.blob} src={bChartImgUrl} />}
          </View>
        </View>
      </Body>
    </Document>
  );
};

export default SearchReport;
