
import React, { useState } from "react";
import { Star, ThumbsUp, MessageSquare, User } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface VehicleReviewsProps {
  vehicle: VehicleModel;
}

// Sample review data (in a real app, these would come from an API)
const sampleReviews = [
  {
    id: 1,
    name: "Ahmed Ali",
    rating: 5,
    date: "2025-03-15",
    title: "The best car I have ever owned",
    review: "I've been driving Toyota cars for over 15 years, and this one is by far the best. The fuel efficiency is amazing, and the comfort level is unparalleled. I highly recommend it to anyone looking for a reliable and comfortable car.",
    likes: 24,
    verified: true,
  },
  {
    id: 2,
    name: "Sara Johnson",
    rating: 4,
    date: "2025-02-28",
    title: "Great car with a few minor issues",
    review: "I've had my Toyota for about 3 months now and overall I'm very satisfied. The handling is smooth and the interior design is impressive. My only complaints are about the infotainment system which can be a bit slow sometimes. Otherwise, it's an excellent car.",
    likes: 18,
    verified: true,
  },
  {
    id: 3,
    name: "Mohammad Hassan",
    rating: 5,
    date: "2025-01-10",
    title: "Exceeded my expectations",
    review: "After researching several cars in this segment, I chose the Toyota and couldn't be happier. The safety features give me peace of mind, especially when driving with my family. The fuel economy is also a big plus - I'm getting better mileage than advertised!",
    likes: 42,
    verified: true,
  },
  {
    id: 4,
    name: "Jessica Taylor",
    rating: 3,
    date: "2024-12-05",
    title: "Good car but expected more features",
    review: "While the car performs well on the road and has good build quality, I was expecting more advanced features in this price range. The base model lacks some of the technology options that competitors offer standard. Still, it's a reliable vehicle that gets the job done.",
    likes: 9,
    verified: false,
  },
];

const VehicleReviews: React.FC<VehicleReviewsProps> = ({ vehicle }) => {
  const [reviewType, setReviewType] = useState<"all" | "verified">("all");
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();
  
  // Filter and sort reviews
  const filteredReviews = sampleReviews
    .filter(review => reviewType === "all" || review.verified)
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });
  
  // Calculate average rating
  const averageRating = sampleReviews.reduce((acc, review) => acc + review.rating, 0) / sampleReviews.length;
  
  // Rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
  sampleReviews.forEach(review => {
    ratingDistribution[5 - review.rating]++;
  });
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback! Your review will be published after moderation.",
    });
    
    setShowReviewForm(false);
    setUserRating(0);
  };
  
  const handleLike = (reviewId: number) => {
    // In a real app, this would update the like count in the database
    toast({
      title: "Thanks for your feedback",
      description: "You've marked this review as helpful.",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Customer Reviews</h2>
      
      {/* Review Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {averageRating.toFixed(1)}
          </h3>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Based on {sampleReviews.length} reviews
          </p>
        </div>
        
        <div className="col-span-1 md:col-span-2 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Rating Distribution
          </h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center">
                <div className="w-12 text-sm text-gray-600 dark:text-gray-400">
                  {stars} star{stars !== 1 ? "s" : ""}
                </div>
                <div className="flex-1 h-4 mx-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{
                      width: `${(ratingDistribution[5 - stars] / sampleReviews.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="w-8 text-sm text-right text-gray-600 dark:text-gray-400">
                  {ratingDistribution[5 - stars]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Review Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex space-x-2">
          <Button
            variant={reviewType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setReviewType("all")}
          >
            All Reviews
          </Button>
          <Button
            variant={reviewType === "verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setReviewType("verified")}
          >
            Verified Owners
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            className="text-sm border rounded p-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>
      
      {/* Review List */}
      <div className="space-y-6 mb-8">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b dark:border-gray-700 pb-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 mr-3">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      {review.name}
                      {review.verified && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs rounded-full">
                          Verified Owner
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {review.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {review.review}
              </p>
              
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(review.id)}
                  className="text-gray-500 dark:text-gray-400"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>Helpful ({review.likes})</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 dark:text-gray-400"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>Reply</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No reviews found.</p>
          </div>
        )}
      </div>
      
      {/* Write a Review */}
      {!showReviewForm ? (
        <div className="text-center mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Own a {vehicle.name}?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Share your experience with other customers
          </p>
          <Button onClick={() => setShowReviewForm(true)}>
            Write a Review
          </Button>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Write Your Review
          </h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Overall Rating
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer ${
                      star <= (hoverRating || userRating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <Input required placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email (will not be published)
                </label>
                <Input type="email" required placeholder="Enter your email" />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Review Title
              </label>
              <Input required placeholder="Summarize your experience" />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Review
              </label>
              <Textarea
                required
                placeholder="Tell others about your vehicle experience"
                rows={5}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={userRating === 0}>
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VehicleReviews;
