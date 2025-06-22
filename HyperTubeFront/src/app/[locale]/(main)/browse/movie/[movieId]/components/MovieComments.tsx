import { MdComment, MdSend, MdPerson } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import UserCard from "@/components/UserCard";

const CommentsSection = ({
  movieId,
  user,
}: {
  movieId: string;
  user: {
    token: string | null;
    id?: string;
    username?: string;
    profile_picture?: string;
  };
}) => {
  type Comment = {
    id: string;
    comment: string;
    created_at: string;
    user?: { id?: string; username?: string; profile_picture?: string };
  };
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/${movieId}/comments/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []);
        }
      } catch (error) {
        toast.error("Error fetching comments");
        console.log("Error fetching comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    if (movieId) {
      fetchComments();
    }
  }, [movieId]);

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError("Please enter a comment");
      return;
    }

    if (!user?.id) {
      setError("Please log in to add a comment");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post(
        `/movies/${movieId}/comments/add/`,
        {
          comment: newComment.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        const newCommentData = response.data.comment;
        setComments((prevComments) => [
          ...prevComments,
          {
            ...newCommentData,
            user: {
              id: user.id,
              username: user.username,
              profile_picture: user.profile_picture,
            },
          },
        ]);
        setNewComment("");
      } else {
        setError("Failed to add comment. Please try again.");
      }
    } catch (error: any) {
      toast.error("Error adding comment");
      setError(error.message || "Failed to add comment. Please try again.");
    }
    setIsSubmitting(false);
    setNewComment("");
    setError("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const t = useTranslations("movie");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.4 }}
      className="mt-10"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-orange-400 flex items-center gap-2">
        <FaRegCommentDots /> {t("comments")} ({comments.length})
      </h2>

      <div className="mb-8 p-4 bg-gray-800/30 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
          <MdComment /> {t("addComment")}
        </h3>

        {!user?.id ? (
          <div className="text-center py-6">
            <p className="text-gray-400 mb-4">{t("addCommentPleaseLogIn")}</p>
            <button className="px-6 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition">
              {t("logIn")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddComment} className="space-y-4">
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("addCommentPlaceholder")}
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  {newComment.length}/500 characters
                </span>
                {error && <span className="text-red-400 text-sm">{error}</span>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-6 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  {t("posting")}
                </>
              ) : (
                <>
                  <MdSend /> {t("postComment")}
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoadingComments ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            <p className="ml-3 text-gray-400">{t("loadingComments")}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MdComment className="text-4xl text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">
              {t("noComments")}
            </p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                {comment.user?.id && (
                  <UserCard
                    user={{
                      id: comment.user.id,
                      username: comment.user.username || "Anonymous",
                      profile_picture: comment.user.profile_picture
                    }}
                    size="sm"
                    className="flex-shrink-0"
                  />
                )}

                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed">
                    {comment.comment}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
};

export default CommentsSection;
