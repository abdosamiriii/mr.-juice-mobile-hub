import { useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

// VAPID public key would normally be generated and stored as env var
// For now, we register the SW and handle subscription when VAPID is configured
const SW_PATH = "/sw.js";

export function usePushNotifications() {
  const { user } = useAuth();

  const registerServiceWorker = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("Push notifications not supported");
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(SW_PATH);
      console.log("Service Worker registered");
      return registration;
    } catch (error) {
      console.error("SW registration failed:", error);
      return null;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return false;
    
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }, []);

  // Show local notification as fallback (no VAPID needed)
  const showLocalNotification = useCallback(async (title: string, body: string) => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      body,
      icon: "/mr-juice-logo-new.jpg",
    });
  }, [requestPermission]);

  // Register SW and request permission on login
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      await registerServiceWorker();
      // Don't auto-request permission - let user opt in
    };

    init();
  }, [user, registerServiceWorker]);

  return { requestPermission, showLocalNotification };
}
