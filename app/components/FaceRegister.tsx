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

  useEffect(() => {
    async function loadModels() {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    }

    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    }

    loadModels().then(startCamera);

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  async function registerFace() {
    if (!videoRef.current) return;

    setLoading(true);

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected. Try again.");
      setLoading(false);
      return;
    }

    const descriptor = Array.from(detection.descriptor);

    const { error } = await supabase
      .from("employees")
      .update({ face_descriptor: descriptor })
      .eq("id", employee.id);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("✅ Face registered successfully");
      await onSuccess(descriptor);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">
          Register Face – {employee.name}
        </h2>

        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full rounded border"
        />

        <div className="flex gap-3">
          <button
            onClick={registerFace}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
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
