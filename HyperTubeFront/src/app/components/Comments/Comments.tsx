'use client';
import { UserProfile } from "@/app/store/userSlice";
import { Comment, movieService } from "@/lib/movie";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CommentsSectionProps {
    movieId: string | string[] | undefined;
    user: UserProfile | null;
}

export default function CommentsSection({ movieId, user }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null); // Tracks which comment is being edited

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            setError(null);
            const { data, error, isLoading } = await movieService.getMovieComments(movieId);
            setIsLoading(isLoading);
            if (data) {
                setComments(data);
            } else {
                setError(error || "Failed to fetch comments.");
            }
        };

        fetchComments();
    }, [movieId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (editingCommentId) {
            const { data, error, isLoading } = await movieService.updateMovieComment(editingCommentId, newComment);
            setIsLoading(isLoading);
            if (data) {
                setComments(comments.map(comment => comment.id === editingCommentId ? data : comment));
                setEditingCommentId(null);
                setNewComment("");
            } else {
                setError(error || "Failed to update comment.");
            }
        } else {
            const { data, error, isLoading } = await movieService.addMovieComment(movieId, newComment);
            setIsLoading(isLoading);
            if (data) {
                setComments([...comments, data]);
                setNewComment("");
            } else {
                setError(error || "Failed to post comment.");
            }
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        setIsLoading(true);
        setError(null);
        const { error, isLoading } = await movieService.deleteMovieComment(commentId);
        setIsLoading(isLoading);
        if (!error) {
            setComments(comments.filter(comment => comment.id !== commentId));
        } else {
            setError(error || "Failed to delete comment.");
        }
    };

    const handleEditClick = (commentId: string, commentText: string) => {
        setEditingCommentId(commentId);
        setNewComment(commentText);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setNewComment("");
    };
    console.log(user, comments);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-lg border-2 border-orange-400 p-4 my-8"
        >
            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-os text-lg font-bold text-orange-800"
            >
                Comments
            </motion.h3>

            {/* {isLoading && <div className="text-orange-800">Loading comments...</div>}
            {error && <div className="text-red-600">{error}</div>} */}

            {comments.map((comment, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex mt-4"
                >
                    <div className="ml-3">
                        <div className="font-medium text-orange-800">{comment.username}</div>
                        <div className="text-gray-600">Posted on {new Date(comment.date).toLocaleString()}</div>
                        {editingCommentId === comment.id ? (
                            <div className="mt-2">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="text-black border-2 border-orange-400 p-2 w-full rounded focus:outline-none focus:border-orange-600"
                                    required
                                />
                                <div className="mt-2">
                                    <button
                                        onClick={() => handleSubmit({ preventDefault: () => { } } as React.FormEvent)}
                                        className="bg-blue-500 text-white font-medium py-1 px-2 rounded hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="bg-gray-500 text-white font-medium py-1 px-2 rounded hover:bg-gray-600 ml-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 text-white">
                                {comment.comment}
                                {user && user.username === comment.username && (
                                    <div className="mt-2">
                                        <button
                                            onClick={() => handleEditClick(comment.id, comment.comment)}
                                            className="bg-blue-500 text-white font-medium py-1 px-2 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="bg-red-500 text-white font-medium py-1 px-2 rounded hover:bg-red-600 ml-2"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}

            {!editingCommentId && (
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-4">
                        <label className="block text-orange-800 font-medium">Add Comment</label>
                        <textarea
                            id="comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            name="comment"
                            className="text-black border-2 border-orange-400 p-2 w-full rounded focus:outline-none focus:border-orange-600"
                            required
                        />
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-orange-500 text-white font-medium py-2 px-4 rounded hover:bg-orange-600"
                        disabled={isLoading}
                    >
                        {isLoading ? "Posting..." : "Post Comment"}
                    </motion.button>
                </motion.form>
            )}
        </motion.div>
    );
}