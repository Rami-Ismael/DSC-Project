import React, { useRef,useEffect  } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import {drawMesh} from './utilities.js';
function App() {
const webcamRef = useRef(null);
const canvasRef = useRef(null);
const runFacemesh = async () => {
  const network = await facemesh.load({
    inputResolution: { width: 720, height: 500 },
    scale: 0.8,
  });
  setInterval(() => {
    detectFace(network);
  }, 1000);
};
const detectFace = async (network) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Getting Video Properties with dimensions
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;      // Setting dimensions of video
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;      // Setting dimensions of canvas
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;      // Detecting the face estimate
      const faceEstimate = await network.estimateFaces(video);
      console.log(faceEstimate);
       // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(()=>{drawMesh(faceEstimate, ctx)});
    }
  };
 useEffect(()=>{runFacemesh()}, []);

return (
  <div className="App">
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 500,
        }}
      />        <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 500,
        }}
      />
  </div>
);
}

export default App;
