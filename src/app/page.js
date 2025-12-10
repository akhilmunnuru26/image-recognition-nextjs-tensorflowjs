"use client"

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export default function Home() {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  
  const [model, setModel] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [detections, setDetections] = useState([]);
  const [cameraMode, setCameraMode] = useState("user"); // user/environment

  // ================= LOAD CAMERA ================= //
  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraMode },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      await new Promise(res => videoRef.current.onloadedmetadata = res);
      return true;
    } catch {
      alert("Camera not found / No permission granted");
      return false;
    }
  };

  // ================= LOAD MODEL ================= //
  const loadModel = async () => {
    const loadedModel = await cocoSsd.load();
    setModel(loadedModel);
  };

  // ================= DETECTION CODE ================= //
  const detectObjects = async () => {
  if (!model || !videoRef.current) return;

  const predictions = await model.detect(videoRef.current);
  setDetections(predictions);
  renderPredictions(predictions);
  // SAVE FRAME ID so we can cancel it later
  animationRef.current = requestAnimationFrame(detectObjects);
};

  // ================= RENDER BOUNDING BOXES ================= //
  const renderPredictions = (predictions) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    ctx.font = "16px Orbitron, sans-serif";
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      const [x,y,w,h] = prediction.bbox;

      ctx.strokeStyle = "#00E7FF";
      ctx.lineWidth = 3;
      ctx.strokeRect(x,y,w,h);

      const label = `${prediction.class} (${(prediction.score*100).toFixed(1)}%)`;

      ctx.fillStyle = "rgba(0,255,255,0.7)";
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(x,y,textWidth+6,20);

      ctx.fillStyle = "#001414";
      ctx.fillText(label,x+3,y+2);
    });
  };

  // ================= START SCAN ================= //
  const startDetection = async () => {
    const camReady = await enableCamera();
    if (!camReady) return;

    setIsRunning(true);
    detectObjects();
  };

  const stopDetection = () => {
  setIsRunning(false);
  setDetections([]);
  

  // 1. Stop animation loop
  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
  }

  // 2. Stop camera stream
  if (videoRef.current) {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    // 3. Remove feed from video
    videoRef.current.srcObject = null;
  }

  // 4. Clear canvas
  if (canvasRef.current) {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  console.log("📌 Detection Stopped Successfully");
};


  const switchCamera = () => {
    setCameraMode(prev => prev === "user" ? "environment" : "user");
    stopDetection();
    startDetection();
  };

  // ================= LOAD MODEL ON MOUNT ================= //
  useEffect(()=> { loadModel(); }, []);

  // ================= CLEANUP ON UNMOUNT ================= //
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-slate-900 to-indigo-900 text-white px-3">

      
      <h1 className="text-4xl font-bold tracking-widest mb-5 drop-shadow-md">
         AI Object Detection Dashboard
      </h1>

     
      {!model && (
        <div className="text-lg animate-pulse mb-4 text-cyan-300">
          Loading TensorFlow Model...
        </div>
      )}

     
      <div className="relative rounded-xl overflow-hidden shadow-[0_0_35px_rgba(0,255,255,0.45)] border border-cyan-400/40">
        
        <video 
          className="rounded-xl"
          width={520}
          height={380}
          autoPlay
          ref={videoRef}
        />

        <canvas
          className="absolute inset-0"
          width={520}
          height={380}
          ref={canvasRef}
        />

     
        {isRunning && (
          <div className="absolute inset-0 pointer-events-none
            bg-[linear-gradient(rgba(0,255,255,0.08)_2px,transparent_2px)]
            bg-[length:100%_30px] animate-scan">
          </div>
        )}
      </div>

     
      <div className="flex gap-4 mt-6">
        <button 
          onClick={startDetection} 
          disabled={!model}
          className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 font-semibold rounded-lg shadow"
        >
          START
        </button>

        <button 
          onClick={stopDetection}
          className="px-5 py-2 bg-red-500 hover:bg-red-400 font-semibold rounded-lg shadow"
        >
          STOP
        </button>

        <button 
          onClick={switchCamera}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-500 font-semibold rounded-lg shadow"
        >
          SWITCH CAM
        </button>

        <Link href="/recog">
          <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg shadow">
            IMAGE CLASSIFIER
          </button>
        </Link>
      </div>

     
      {detections.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center mt-6 max-w-[600px]">
          {detections.map((obj,i)=>(
            <span key={i} className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-sm tracking-wide">
              {obj.class} • {Math.round(obj.score*100)}%
            </span>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm opacity-60">Powered by TensorFlowJS + COCO-SSD</p>
      <p className="mt-6 text-xs opacity-50">Akhil Munnuru</p>
    </div>
  );
}
