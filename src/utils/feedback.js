// src/utils/feedback.js
import { Platform, ToastAndroid } from "react-native";
import { triggerHaptic } from "./haptics";

// Internal toast handler
const showToast = (message) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    alert(message);
  }
};

// Success
export const showSuccess = (message = "Success") => {
  triggerHaptic("success");
  showToast(message);
};

// Error
export const showError = (message = "Something went wrong") => {
  triggerHaptic("error");
  showToast(message);
};

// Warning
export const showWarning = (message = "Warning") => {
  triggerHaptic("warning");
  showToast(message);
};

// Light feedback (no toast)
export const showImpact = () => {
  triggerHaptic("light");
};