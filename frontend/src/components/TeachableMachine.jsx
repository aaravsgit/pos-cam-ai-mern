import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/huWoA4SEd/";

export default function TeachableMachine({ products, addToCart, activeTab, setActiveTab }) {
  const webcamRef = useRef(null);
  const labelContainerRef = useRef(null);
  const modelRef = useRef(null);
  const webcam = useRef(null);
  const loopRef = useRef(null);

  const [label, setLabel] = useState("");
  const detected = useRef(false); // synchronous flag

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

      startCamera();
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
    if (!webcam.current || !modelRef.current || detected.current) return;

    webcam.current.update();

    if (activeTab === "camera") await predict();

    if (!detected.current) {
      loopRef.current = requestAnimationFrame(loop);
    }
  };

  const predict = async () => {
    if (!modelRef.current || !webcam.current || detected.current) return;

    const prediction = await modelRef.current.predict(webcam.current.canvas);
    const bestGuess = prediction.reduce((a, b) => (b.probability > a.probability ? b : a));

    setLabel(`${bestGuess.className} (${bestGuess.probability.toFixed(2)})`);

    if (labelContainerRef.current) {
      prediction.forEach((p, i) => {
        if (labelContainerRef.current.childNodes[i])
          labelContainerRef.current.childNodes[i].innerHTML = `${p.className}: ${p.probability.toFixed(2)}`;
      });
    }

    if (bestGuess.probability > 0.85 && (bestGuess.className === "Water" || bestGuess.className === "Duck")) {
      const product = products.find((p) => p.name === bestGuess.className);
      if (product) {
        addToCart(product);
        setActiveTab("products");

        // stop future predictions
        detected.current = true;
        if (loopRef.current) {
          cancelAnimationFrame(loopRef.current);
          loopRef.current = null;
        }
      }
    }
  };


  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold mb-2">Teachable Machine Image Model</h2>
      <div ref={webcamRef} className="mb-2"></div>
      <div ref={labelContainerRef} className="text-sm text-gray-700"></div>
      <p className="mt-2 font-semibold">Best Guess: {label}</p>
    </div>
  );
}
