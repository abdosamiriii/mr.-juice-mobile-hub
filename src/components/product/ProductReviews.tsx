import { useState } from "react";
import { Star, Send, Trash2 } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { reviews, averageRating, userReview, submitReview, deleteReview, submitting, reviewCount } = useReviews(productId);
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(userReview?.comment || "");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    const success = await submitReview(rating, comment);
    if (success) {
      toast.success(userReview ? "Review updated!" : "Review submitted!");
      setShowForm(false);
    }
  };

  const handleDelete = async () => {
    await deleteReview();
    setRating(0);
    setComment("");
    toast.success("Review deleted");
  };

  const handleOpenForm = () => {
    if (!user) {
      toast.error("Please login to leave a review");
      return;
    }
    setRating(userReview?.rating || 0);
    setComment(userReview?.comment || "");
    setShowForm(true);
  };

  return (
    <div className="mb-4">
      <h3 className="font-semibold text-foreground mb-3 text-sm">Reviews</h3>

      {/* Average Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className={`w-4 h-4 ${i <= Math.round(averageRating) ? "text-primary fill-primary" : "text-muted"}`} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          ({averageRating > 0 ? averageRating.toFixed(1) : "No reviews"}) · {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Review Form */}
      {showForm ? (
        <div className="bg-muted rounded-2xl p-3 mb-3 space-y-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i)}
              >
                <Star className={`w-6 h-6 transition-colors ${i <= (hoverRating || rating) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write a comment (optional)..."
            className="w-full bg-background rounded-xl p-2 text-sm text-foreground placeholder:text-muted-foreground resize-none h-16 border border-border"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={submitting} className="rounded-full gap-1">
              <Send className="w-3 h-3" /> {userReview ? "Update" : "Submit"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)} className="rounded-full">
              Cancel
            </Button>
            {userReview && (
              <Button size="sm" variant="destructive" onClick={handleDelete} className="rounded-full gap-1 ms-auto">
                <Trash2 className="w-3 h-3" /> Delete
              </Button>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={handleOpenForm}
          className="text-xs text-primary font-medium mb-3 block"
        >
          {userReview ? "✏️ Edit your review" : "⭐ Write a review"}
        </button>
      )}

      {/* Recent Reviews */}
      {reviews.length > 0 && (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {reviews.slice(0, 5).map(review => (
            <div key={review.id} className="bg-muted/50 rounded-xl p-2.5">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${i <= review.rating ? "text-primary fill-primary" : "text-muted"}`} />
                ))}
                {review.user_id === user?.id && (
                  <span className="text-[10px] bg-primary/10 text-primary rounded-full px-1.5 ms-1">You</span>
                )}
              </div>
              {review.comment && (
                <p className="text-xs text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
