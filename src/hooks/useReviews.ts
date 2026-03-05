import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export const useReviews = (productId: string | undefined) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    if (!productId) return;
    setLoading(true);
    const { data } = await supabase
      .from("reviews" as any)
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    setReviews((data as any as Review[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const userReview = user ? reviews.find(r => r.user_id === user.id) : null;

  const submitReview = async (rating: number, comment?: string) => {
    if (!user || !productId) return false;
    setSubmitting(true);
    try {
      if (userReview) {
        await supabase
          .from("reviews" as any)
          .update({ rating, comment: comment || null } as any)
          .eq("id", userReview.id);
      } else {
        await supabase
          .from("reviews" as any)
          .insert({ product_id: productId, user_id: user.id, rating, comment: comment || null } as any);
      }
      await fetchReviews();
      return true;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async () => {
    if (!userReview) return;
    await supabase.from("reviews" as any).delete().eq("id", userReview.id);
    await fetchReviews();
  };

  return { reviews, loading, averageRating, userReview, submitReview, deleteReview, submitting, reviewCount: reviews.length };
};
