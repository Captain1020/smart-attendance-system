"use client";

import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Employee = {
  id: number;
  employee_id: string;
  name: string;
  department: string;
};

type FaceRegisterProps = {
  employee: Employee;
  onSuccess: (descriptor: number[]) => Promise<void>;
  onClose: () => void;
};

export default function FaceRegister({
  employee,
  onSuccess,
  onClose,
}: FaceRegisterProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  /* ---------------- LOAD MODELS + CAMERA ---------------- */
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function init() {
      try {
        const MODEL_URL = "/models";

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        setModelsLoaded(true);

        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setCameraReady(true);
          };
        }
      } catch (err) {
        console.error(err);
        alert("Camera or model loading failed");
      }
    }

    init();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  /* ---------------- REGISTER FACE ---------------- */
  async function registerFace() {
    if (!videoRef.current) return;

    if (!modelsLoaded || !cameraReady) {
      alert("Camera not ready yet. Please wait.");
      return;
    }

    if (!employee?.id) {
      alert("Employee not found. Reload and try again.");
      return;
    }

    setLoading(true);

    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("❌ No clear face detected. Try better lighting.");
      setLoading(false);
      return;
    }

    const descriptor = Array.from(detection.descriptor);

    const { error } = await supabase
      .from("employees")
      .update({ face_descriptor: descriptor })
      .eq("id", employee.id)
      .select();

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to save face data");
      return;
    }

    alert("✅ Face registered successfully");
    await onSuccess(descriptor);
    onClose();
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">
          Register Face – {employee.name}
        </h2>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-lg border"
        />

        <p className="text-sm text-gray-600">
          Ensure good lighting and face the camera clearly.
        </p>

        <div className="flex gap-3">
          <button
            onClick={registerFace}
            disabled={loading || !modelsLoaded || !cameraReady}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Registering..." : "Capture Face"}
          </button>

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
