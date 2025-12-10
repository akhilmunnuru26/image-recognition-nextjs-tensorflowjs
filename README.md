## AI Object & Image Recognition Web App

This project is built using **Next Js, TensorFlowJS, COCO-SSD** for real-time object detection from webcam video, and **MobileNet** for image classification. The application can identify multiple objects in live video feed and classify uploaded images with prediction confidence.
The UI is built for a dashboard-style experience with live bounding boxes, prediction metadata, and interactive controls to start, stop, or switch camera devices.

## Features

- Real-time object detection using COCO-SSD model
- Client-side image classification using MobileNet
- Live webcam streaming in the browser
- Bounding box rendering with confidence scores
- Support for multiple cameras
- Start, stop, and model control without page reload
- Deployable through Docker + GitHub Actions + AWS EC2

## Tech Stack

- **Frontend:** React, Tailwind CSS  
- **AI Models:** TensorFlowJS, COCO-SSD, MobileNet
- **Deployment:**  Vercel

## Core Logic — Object Detection (Video)

- Initialize webcam using navigator.mediaDevices.getUserMedia().
- Load COCO-SSD TensorFlowJS model using cocoSsd.load().
- Continuously pass live video frames to model.detect(videoElement).
- Draw bounding boxes on canvas using predictions.
- Render label text with confidence output.
- Stop processing by cancelling requestAnimationFrame and clearing canvas.


## Core Logic — Image Classification

- User uploads an image.
- MobileNet model loads asynchronously.
- Model performs inference on uploaded image element.
- Predictions returned with className and probability.
- UI lists identified objects with confidence percentage.

## Running Locally
- npm install
- npm run dev
- Open browser and navigate to http://localhost:3000




