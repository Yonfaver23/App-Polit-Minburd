import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { basePath, version } from "./config";
import jwtDecode from "jwt-decode";

export const getAccessTokenApi = () => {
  const [estad, setEstad] = useState(null);
  const getAccess = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      setEstad(accessToken);
      if (!accessToken || accessToken === "null") {
        setEstad(null);
      } else {
        if (willExpireToken(accessToken) === "null") {
          getRefreshTokenApi();
          setEstad(null);
        } else {
          setEstad(accessToken);
        }
      }
    } catch (error) {
      console.log("Error getAccesToken");
    }
  };

  useEffect(() => {
    getAccess();
  }, []);

  return { estad };
};

export const DatosUsuarioToken = () => {
  const [estadd, setEstadd] = useState(null);
  const getAccesst = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("refreshToken");
      console.log(accessToken);
      const metaToken = jwtDecode(accessToken);
      
      setEstadd(metaToken);
      
    } catch (error) {
      console.log("Error DatosUsuarioToken");
    }
  };

  useEffect(() => {
    getAccesst();
  }, []);

  return { estadd };
};

export const getRefreshTokenApi = async () => {
  const [estad, setEstad] = useState(null);
  const getRefreshAccess = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken || refreshToken === "null") {
        setEstad(null);
      } else {
        if (willExpireToken(refreshToken) === "null") {
          setEstad(null);
        } else {
          setEstad(refreshToken);
        }
      }
    } catch (error) {
      console.log("Error getRefreshTokenApi");
    }
  };
  useEffect(() => {
    getRefreshAccess();
  }, []);

  return { estad };
};

export function refreshAccessTokenApi(refreshToken) {
  const url = `${basePath}/${version}/refresh-access-token`;

  const bodyObj = {
    refreshToken: refreshToken,
  };
  const params = {
    method: "POST",
    body: JSON.stringify(bodyObj),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, params)
    .then((response) => {
      if (response.status !== 200) {
        return null;
      }
      return response.json();
    })
    .then((result) => {
      if (!result) {
        logout();
      } else {
        (async () => {
          const { accessToken, refreshToken } = result;
          try {
            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", refreshToken);
          } catch {
            console.log("Error refreshAccessTokenApi");
          }
        })();
      }
    });
}

function willExpireToken(token) {
  const seconds = 60;
  const metaToken = jwtDecode(token);
  const { exp } = metaToken;
  const now = (Date.now() + seconds) / 1000;
  return now > exp;
}