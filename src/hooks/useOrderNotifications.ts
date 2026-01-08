import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Notification sound using Web Audio API
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a pleasant notification chime
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    // Play a pleasant ascending chime (C5 - E5 - G5)
    playTone(523.25, now, 0.2);       // C5
    playTone(659.25, now + 0.15, 0.2); // E5
    playTone(783.99, now + 0.3, 0.3);  // G5

    // Clean up audio context after sound finishes
    setTimeout(() => {
      audioContext.close();
    }, 1000);
  } catch (error) {
    console.log("Could not play notification sound:", error);
  }
};

export const useOrderNotifications = (enabled: boolean = true) => {
  const lastOrderIdRef = useRef<string | null>(null);
  const isFirstLoadRef = useRef(true);

  const handleNewOrder = useCallback((payload: any) => {
    // Skip notification on first load
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      lastOrderIdRef.current = payload.new?.id;
      return;
    }

    // Only notify for new pending orders
    if (payload.eventType === 'INSERT' && payload.new?.status === 'pending') {
      if (lastOrderIdRef.current !== payload.new.id) {
        lastOrderIdRef.current = payload.new.id;
        
        // Play sound
        playNotificationSound();
        
        // Show toast notification
        toast.success("🔔 New Order Received!", {
          description: `Order #${payload.new.id.slice(0, 8)} - ${payload.new.customer_name || 'Guest'}`,
          duration: 5000,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    isFirstLoadRef.current = true;

    const channel = supabase
      .channel('new-orders-notification')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        handleNewOrder
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, handleNewOrder]);

  return { playNotificationSound };
};
