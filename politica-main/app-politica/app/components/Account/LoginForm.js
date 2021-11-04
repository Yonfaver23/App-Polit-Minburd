import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../../navigation/RootNavigation";
import { AuthContext } from "../../hooks/AuthContext";
import Buttoon from "../general/Buttoon";

///////////////////

import { signInApi } from "../../api/user";
import { validateEmail } from "../../utils/Validation";

///////////////////////////
import { isEmpty } from "lodash";
import Toast from "react-native-toast-message";
import { Input, Icon } from "react-native-elements";
import Color from "../../styles/Colors";

export default function LoginForm() {
  const [verPassword, setVerPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const { singIn } = useContext(AuthContext);

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = async (e) => {
    if (isEmpty(formData.email) || isEmpty(formData.password)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: " tiene que ingresar correo y contraseña",
      });
    } else if (!validateEmail(formData.email)) {
      Toast.show({
        type: "error",
        text1: "Algo salio mal!",
        text2: "El email no es correcto.",
      });
    } else {
      await signInApi(formData).then(async (response) => {
        try {
          if (response.code === 200) {
            try {
              //almacenar en los token
              const valueer = await AsyncStorage.setItem(
                "@accessToken",
                response.accessToken
              );
              await AsyncStorage.setItem(
                "@refreshToken",
                response.refreshToken
              );
              console.log(valueer);
              await AsyncStorage.setItem("@id", response.user);
              // await AsyncStorage.setItem("@rol", response.rol);
              if (valueer == null) {
                Toast.show({
                  type: "success",
                  text1: "Bien!",
                  text2: "Inicio de sesión Correcto",
                });
                singIn();
              }
            } catch (e) {
              Toast.show({
                type: "error",
                text1: "Algo salio mal!",
                text2: "Error al almacenar en el localStorage",
              });
            }
          } else {
            Toast.show({
              type: "error",
              text1: "Algo salio mal!",
              text2: `${response.message}`,
            });
          }
        } catch {
          Toast.show({
            type: "error",
            text1: "Algo salio mal!",
            text2: "Compruebe su conexión a internet",
          });
        }
      });
    }
  };
  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo Electronico"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, "email")}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        password={true}
        secureTextEntry={verPassword ? false : true}
        onChange={(e) => onChange(e, "password")}
        rightIcon={
          <Icon
            type="material-community"
            name={verPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setVerPassword(!verPassword)}
          />
        }
      />
      <Buttoon namee="Iniciar Session" colorr={Color.BLUE} tarea={onSubmit} />

      <View style={styles.btnRegister}>
        <Buttoon
          namee="Registrar Usuario"
          colorr={Color.GRAY2}
          tarea={SendRegisterr}
        />
      </View>
    </View>
  );
}

function defaultFormValue() {
  return {
    email: "",
    password: "",
  };
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  inputForm: {
    width: "96%",
    marginTop: 30,
  },
  btnContainer: {
    width: "90%",
  },
  btnLogin: {
    backgroundColor: Color.GREEN,
  },
  iconRight: {
    color: "#c1c1c1",
  },
  textoback: {
    color: Color.WHITE,
  },
  btnRegister: {
    marginTop: 20,
  },
});
//   <View>
//     <Text>Soy login....</Text>
//
//   </View>
// );

function SendRegisterr() {
  RootNavigation.navigate("RegisterUser");
}
