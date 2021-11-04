import React from "react";
import { Button } from "react-native-elements";
import { StyleSheet } from "react-native";

export default function Buttoon(props) {
  const { namee, colorr, tarea } = props;
  return (
    <Button
      title={namee}
      containerStyle={Styles.btnContainer}
      style={Styles.textStyle}
      buttonStyle={{ backgroundColor: colorr }}
      onPress={tarea}
    />
  );
}

const Styles = StyleSheet.create({
  btnContainer: {
  
    width: "90%",
  },
  textStyle:{
    fontStyle:"italic",
  }
});
