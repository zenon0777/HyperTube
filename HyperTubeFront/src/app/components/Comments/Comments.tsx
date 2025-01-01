'use client';
import { motion } from "framer-motion";

export default function CommentsSection() {
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

            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex mt-4"
            >
                <div className="w-14 h-14 rounded-full bg-orange-400/50 flex-shrink-0 flex items-center justify-center">
                    <img 
                        className="h-12 w-12 rounded-full object-cover" 
                        src="https://randomuser.me/api/portraits/men/43.jpg"
                        alt="" 
                    />
                </div>

                <div className="ml-3">
                    <div className="font-medium text-orange-800">John Doe</div>
                    <div className="text-gray-600">Posted on 2023-10-02 14:30</div>
                    <div className="mt-2 text-orange-800">
                        This is a sample comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                </div>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex mt-4 "
            >
                <div className="w-14 h-14 rounded-full bg-orange-400/50 flex-shrink-0 flex items-center justify-center">
                    <img 
                        className="h-12 w-12 rounded-full object-cover" 
                        src="https://randomuser.me/api/portraits/men/43.jpg"
                        alt="" 
                    />
                </div>

                <div className="ml-3">
                    <div className="font-medium text-orange-800">John Doe</div>
                    <div className="text-gray-600">Posted on 2023-10-02 14:30</div>
                    <div className="mt-2 text-orange-800">
                        This is a sample comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                </div>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex mt-4"
            >
                <div className="w-14 h-14 rounded-full bg-orange-400/50 flex-shrink-0 flex items-center justify-center">
                    <img 
                        className="h-12 w-12 rounded-full object-cover" 
                        src="https://randomuser.me/api/portraits/men/43.jpg"
                        alt="" 
                    />
                </div>

                <div className="ml-3">
                    <div className="font-medium text-orange-800">John Doe</div>
                    <div className="text-gray-600">Posted on 2023-10-02 14:30</div>
                    <div className="mt-2 text-orange-800">
                        This is a sample comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                </div>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex mt-4"
            >
                <div className="w-14 h-14 rounded-full bg-orange-400/50 flex-shrink-0 flex items-center justify-center">
                    <img 
                        className="h-12 w-12 rounded-full object-cover" 
                        src="https://randomuser.me/api/portraits/men/43.jpg"
                        alt="" 
                    />
                </div>

                <div className="ml-3">
                    <div className="font-medium text-orange-800">John Doe</div>
                    <div className="text-gray-600">Posted on 2023-10-02 14:30</div>
                    <div className="mt-2 text-orange-800">
                        This is a sample comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                </div>
            </motion.div>

            <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
            >
                <div className="mb-4">
                    <label className="block text-orange-800 font-medium">Comment</label>
                    <textarea 
                        id="comment" 
                        name="comment" 
                        className="border-2 border-orange-400 p-2 w-full rounded focus:outline-none focus:border-orange-600" 
                        required
                    />
                </div>

                <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-orange-500 text-white font-medium py-2 px-4 rounded hover:bg-orange-600"
                >
                    Post Comment
                </motion.button>
            </motion.form>
        </motion.div>
    );
}