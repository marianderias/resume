import { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactGA from "react-ga";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

import Home from "./components/home/Home";
import React from "react";
import Cursor from "./components/shared/Cursor";
import "./index.css";

export const CURSOR_WIDTH = 12;
export const MEASUREMENT_ID = "G-DYNN0X06V9";
ReactGA.initialize(MEASUREMENT_ID);

export const CLIENT_ID =
  "305690759857-qpts7jr6k0ksknb5vto7ag1dhioln15p.apps.googleusercontent.com";
export const PROPERTY_ID = "437017217";

function App() {
  const { height, width } = useWindowDimensions();
  const [cursorPos, setCursorPos] = useState({ x: width / 2, y: height / 3 });

  const mousemove = (e) => {
    var xPos = e.clientX;
    var yPos = e.clientY;
    if (xPos + CURSOR_WIDTH > width) {
      xPos = width - CURSOR_WIDTH;
    } else if (xPos - CURSOR_WIDTH < 0) {
      xPos = CURSOR_WIDTH;
    }

    if (yPos + CURSOR_WIDTH > height) {
      yPos = height - CURSOR_WIDTH;
    } else if (yPos - CURSOR_WIDTH < 0) {
      yPos = CURSOR_WIDTH;
    }

    setCursorPos({ x: xPos, y: yPos });
  };

  const fetchData = async (accessToken) => {
    try {
      const metrics = [{ name: "activeUsers" }];
      const dimensions = [{ name: "country" }];

      const requestBody = {
        metrics,
        dimensions,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const apiResponse = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
        requestBody,
        { headers }
      );

      const responseData = apiResponse.data;
      console.log("responseData", responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const googleLogin = useGoogleLogin({
    clientId: CLIENT_ID,
    responseType: "token",
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse?.access_token;
      if (accessToken) {
        fetchData(accessToken);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Check runs all the time to reset cursor position
  useEffect(() => {
    window.addEventListener("mousemove", mousemove);
    ReactGA.pageview(window.location.pathname + window.location.search);

    if (googleLogin.tokenResponse?.access_token) {
      console.log("fetching data");
      fetchData(googleLogin.tokenResponse.access_token);
    }

    return () => {
      window.removeEventListener("mousemove", mousemove);
    };
  });

  return (
    <Router className="App">
      <Routes>
        
        <Route path="/resume" element={<Home />} />
      </Routes>
      <Cursor x={cursorPos.x} y={cursorPos.y} />
    </Router>
  );
}

export default App;
// <Route path="/about" element={<About />} />