import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/huWoA4SEd/";

export default function TeachableMachine({ products, addToCart, activeTab, setActiveTab }) {
  const webcamRef = useRef(null);
  const labelContainerRef = useRef(null);
  const modelRef = useRef(null);
  const webcam = useRef(null);
  const loopRef = useRef(null);
  const [objectInFrame, setObjectInFrame] = useState(false);

  const [label, setLabel] = useState("");
  const [addedThisSession, setAddedThisSession] = useState(false);
  const lastAddTime = useRef(0);

  useEffect(() => {
    const loadModel = async () => {
      modelRef.current = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
      console.log("✅ Model loaded");

      if (labelContainerRef.current) {
        labelContainerRef.current.innerHTML = "";
        for (let i = 0; i < modelRef.current.getTotalClasses(); i++) {
          const div = document.createElement("div");
          labelContainerRef.current.appendChild(div);
        }
      }

      startCamera(); // always start camera
    };
    loadModel();

    return () => cancelAnimationFrame(loopRef.current);
  }, []);

  const startCamera = async () => {
    if (webcam.current) return;

    try {
      webcam.current = new tmImage.Webcam(200, 200, true);
      await webcam.current.setup();
      if (webcamRef.current) {
        webcamRef.current.innerHTML = "";
        webcamRef.current.appendChild(webcam.current.canvas);
      }
      await webcam.current.play();
      loopRef.current = requestAnimationFrame(loop);
    } catch (err) {
      console.error("⚠️ Error starting webcam:", err);
    }
  };

  const loop = async () => {
    if (!webcam.current || !modelRef.current) return;

    webcam.current.update();

    // Only predict when camera tab is active
    if (activeTab === "camera") await predict();

    loopRef.current = requestAnimationFrame(loop);
  };

const predict = async () => {
  if (!modelRef.current || !webcam.current) return;

  const prediction = await modelRef.current.predict(webcam.current.canvas);
  const bestGuess = prediction.reduce((a, b) => (b.probability > a.probability ? b : a));

  setLabel(`${bestGuess.className} (${bestGuess.probability.toFixed(2)})`);

  // Update label container
  if (labelContainerRef.current) {
    prediction.forEach((p, i) => {
      if (labelContainerRef.current.childNodes[i])
        labelContainerRef.current.childNodes[i].innerHTML =
          `${p.className}: ${p.probability.toFixed(2)}`;
    });
  }

  const HIGH_THRESHOLD = 0.85; // trigger add
  const LOW_THRESHOLD = 0.3;   // reset when object leaves

  if (bestGuess.className === "Water" || bestGuess.className === "Duck") {
    if (bestGuess.probability > HIGH_THRESHOLD && !objectInFrame && !addedThisSession) {
      const product = products.find((p) => p.name === bestGuess.className);
      if (product) {
        addToCart(product);
        setActiveTab("products");
        setAddedThisSession(true);
        setObjectInFrame(true);
        speak(bestGuess.className);
      }
    } else if (bestGuess.probability < LOW_THRESHOLD) {
      // Object left the frame
      setObjectInFrame(false);
    }
  } else {
    // Not a relevant object
    setObjectInFrame(false);
  }
};
  const speak = (text) => {
    const synth = window.speechSynthesis;
    synth.speak(new SpeechSynthesisUtterance(text));
  };

  // Reset addedThisSession only when switching back to camera tab
  useEffect(() => {
    if (activeTab === "camera") setAddedThisSession(false);
  }, [activeTab]);

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold mb-2">Teachable Machine Image Model</h2>
      <div ref={webcamRef} className="mb-2"></div>
      <div ref={labelContainerRef} className="text-sm text-gray-700"></div>
      <p className="mt-2 font-semibold">Best Guess: {label}</p>
    </div>
  );
}
