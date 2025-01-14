import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CommentDialog } from '../';
import axios from 'axios';
import './style.css';

const Posts = ({ posts, setPosts }) => {
    const businessName = useSelector((state) => state.business.companyName);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const latestPostsFirst = [...posts].reverse();
    const [upvotedPosts, setUpvotedPosts] = useState([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchUpvotedPosts = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/users/${userId}`);
                const { upvoted_posts } = response.data;
                setUpvotedPosts(JSON.parse(upvoted_posts));
                localStorage.setItem('upvotedPosts', upvoted_posts);
            } catch (error) {
                console.error('Error fetching upvoted posts:', error);
            }
        };

        fetchUpvotedPosts();
    }, [userId]);

    const handleCommentButtonClick = (postId) => {
        setSelectedPostId(postId);
        setDialogVisible(true);
    };

    const handleUpvote = async (postId) => {
        try {
            const isAlreadyUpvoted = upvotedPosts.includes(postId);
            if (isAlreadyUpvoted) {
                await axios.patch(`http://127.0.0.1:5000/posts/update/${postId}/cancel_upvote`);
                await axios.post(`http://127.0.0.1:5000/users/posts/cancel_upvote`, {
                    user_id: userId,
                    post_id: postId,
                });
                setPosts((prevPosts) => {
                    const updatedPosts = prevPosts.map((post) => {
                        if (post.post_id === postId) {
                            return {
                                ...post,
                                post_upvotes: post.post_upvotes - 1,
                            };
                        }
                        return post;
                    });
                    return updatedPosts;
                });
                setUpvotedPosts((prevUpvotedPosts) =>
                    prevUpvotedPosts.filter((id) => id !== postId)
                );
                localStorage.setItem(
                    'upvotedPosts',
                    JSON.stringify(upvotedPosts.filter((id) => id !== postId))
                );
            } else {
                await axios.patch(`http://127.0.0.1:5000/posts/update/${postId}/upvote`);
                await axios.post(`http://127.0.0.1:5000/users/posts/upvote`, {
                    user_id: userId,
                    post_id: postId,
                });
                setPosts((prevPosts) => {
                    const updatedPosts = prevPosts.map((post) => {
                        if (post.post_id === postId) {
                            return {
                                ...post,
                                post_upvotes: post.post_upvotes + 1,
                            };
                        }
                        return post;
                    });
                    return updatedPosts;
                });
                setUpvotedPosts((prevUpvotedPosts) => [...prevUpvotedPosts, postId]);
                localStorage.setItem(
                    'upvotedPosts',
                    JSON.stringify([...upvotedPosts, postId])
                );
            }
        } catch (error) {
            console.error('Error upvoting post:', error);
        }
    };

    return (
        <div className="posts-container">
            {latestPostsFirst.map((post, index) => (
                <div key={index} className="post">
                    <h3 className="post-title">{post.post_title}</h3>
                    <p className="post-content">{post.post_content}</p>
                    <p className={`post-author ${post.username === businessName ? 'red-text' : ''}`}>
                        {post.username}
                    </p>
                    <p className="post-votes">
                        <button
                            className={`upvote-button ${upvotedPosts.includes(post.post_id) ? 'active' : ''}`}
                            onClick={() => handleUpvote(post.post_id)}
                        >
                            Upvote
                        </button>{' '}
                        {post.post_upvotes}
                    </p>
                    <button className="comments-btn" onClick={() => handleCommentButtonClick(post.post_id)}>
                        Comments
                    </button>
                </div>
            ))}
            {dialogVisible && (
                <CommentDialog postId={selectedPostId} onClose={() => setDialogVisible(false)} />
            )}
        </div>
    );
};

export default Posts;
