import AdminNavbar from "@/components/adminNavbar";
import Image from "next/image";
import styles from '@/styles/activity.module.css';
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from '../api/firebaseConfig';
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions

export default function Activity() {
    const [posts, setPosts] = useState([]);  // Initialize with an empty array
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    // Fetch posts from Firestore when component mounts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "activity"));  // Fetch data from Firestore collection 'activity'
                const fetchedPosts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,  // Store document ID for potential future use
                    ...doc.data()  // Spread the document data
                }));
                setPosts(fetchedPosts);  // Update the state with fetched posts
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        };

        fetchPosts();  // Call the fetchPosts function
    }, []);  // Empty dependency array ensures this runs once when the component mounts

    const handleDeleteClick = (post) => {
        setPostToDelete(post);
        setShowModal(true);
    };

    const confirmDelete = () => {
        setPosts(posts.filter(post => post !== postToDelete));  // Remove the post locally for now
        setShowModal(false);
        setPostToDelete(null);
        // TODO: Delete the post from Firestore here
    };

    const cancelDelete = () => {
        setShowModal(false);
        setPostToDelete(null);
    };

    return (
        <>
            <AdminNavbar />
            <div className={styles.background}>
                <div className={styles.mainSection}>
                    <div className={styles.imageContainer}>
                        <Image src="/activitybackground.jpg" alt="Logo" layout="fill" objectFit="cover" className={styles.image} />
                        <div className={styles.header}>ACTIVITY</div>
                        <Link href={'/admin/postActivity'}>
                            <button className={styles.postButton}>Post</button>
                        </Link>
                    </div>
                    <div className={styles.postContainer}>
                        {posts.map((post, index) => (
                            <div key={post.id || index} className={styles.postBox}>  {/* Use Firestore doc ID as key if available */}
                                <div className={styles.detailContainer}>
                                    <div className={styles.postTitle}>
                                        {post.title}
                                    </div>
                                    <div className={styles.line} />
                                    <div className={styles.postDescription}>
                                        {post.description}
                                    </div>
                                    <div className={styles.dateRange}>
                                        {post.date}  {/* Adjust field name based on Firestore data */}
                                    </div>
                                    <div className={styles.line2} />
                                    {post.imageUrl && (  // Ensure imageUrl is present before rendering Image component
                                        <Image
                                            src={post.imageUrl}
                                            width={300}
                                            height={200}
                                            className={styles.iconImage}
                                            alt="Post Image"
                                            objectFit="cover"
                                        />
                                    )}
                                </div>
                                <button className={styles.deleteButton} onClick={() => handleDeleteClick(post)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <p>Are you sure you want to delete this post?</p>
                        <button className={styles.confirmButton} onClick={confirmDelete}>Yes</button>
                        <button className={styles.cancelButton} onClick={cancelDelete}>No</button>
                    </div>
                </div>
            )}
            <AdminNavbarBottom />
        </>
    );
}
