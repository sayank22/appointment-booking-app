import * as Haptics from "expo-haptics";

// Centralized haptic trigger
export const triggerHaptic = async (type = "medium") => {
  try {
    switch (type) {
      case "success":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        break;

      case "warning":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );
        break;

      case "error":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error
        );
        break;

      case "light":
        await Haptics.impactAsync(
          Haptics.ImpactFeedbackStyle.Light
        );
        break;

      case "medium":
        await Haptics.impactAsync(
          Haptics.ImpactFeedbackStyle.Medium
        );
        break;

      case "heavy":
        await Haptics.impactAsync(
          Haptics.ImpactFeedbackStyle.Heavy
        );
        break;

      default:
        await Haptics.impactAsync(
          Haptics.ImpactFeedbackStyle.Medium
        );
    }
  } catch {
  }
};