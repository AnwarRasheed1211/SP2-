import Image from 'next/image';
import { storage } from '../api/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import styles from '@/styles/postactivity.module.css';
import Link from "next/link";
import { db } from '../api/firebaseConfig'
import { collection, addDoc } from "firebase/firestore";
import React, { useState } from 'react'

export default function PostActivity() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);  // State to manage loading state
  const [successMessage, setSuccessMessage] = useState('');  // State to show success message
  const [errorMessage, setErrorMessage] = useState('');  // State to show error message
  const [fileupload, setFileupload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileupload(file);  // Update the fileupload state
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);  // Set image preview
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);  // Reset image preview if no file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page refresh
    setLoading(true);  // Show loading state
    setSuccessMessage('');  // Clear previous success message
    setErrorMessage('');  // Clear previous error message

    if (!fileupload) {  // Ensure a file is selected
      setErrorMessage('Please select an image to upload.');
      setLoading(false);
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `admin/activitypic/${fileupload.name}`);  // Create reference
      await uploadBytes(storageRef, fileupload);  // Upload file
      const imageUrl = await getDownloadURL(storageRef);  // Get URL of uploaded image

      // After image is uploaded, add the post details to Firestore
      const docRef = await addDoc(collection(db, "activity"), {  // Firestore collection name
        title: title,
        date: date,
        description: description,
        imageUrl: imageUrl,  // Add image URL to Firestore document
      });

      console.log("Document written with ID: ", docRef.id);
      setSuccessMessage('Post created successfully!');  // Set success message

      // Clear input fields after successful submission
      setTitle('');
      setDate('');
      setDescription('');
      setFileupload(null);  // Clear file input
      setImagePreview(null);  // Clear image preview
    } catch (e) {
      console.error("Error adding document:", e.message);  // Log error message
      setErrorMessage(`Failed to create post: ${e.message}`);  // Display detailed error message
    } finally {
      setLoading(false);  // Hide loading state
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className={styles['home-page']}>
        <div className={styles['cover']}>
          <div className={styles['container']}>CREATE POST</div>
          <div className={styles['container2']}>
            <div className={styles['container-pic']}>
              <input type="file" onChange={handleFileChange} /> {/* Handle file input change */}

              {imagePreview && (
                <div>
                  <Image
                    src={imagePreview}
                    alt="Image preview"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}

              {error && <p className={styles['error']}>{error}</p>}

              {uploadedUrl && (
                <div>
                  <p>Uploaded image:</p>
                  <Image
                    src={uploadedUrl}
                    alt="Uploaded image"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}
            </div>
            <form className={styles['container-text']} onSubmit={handleSubmit}>
              <label className={styles['text']}> Title</label>
              <input
                className={styles['input']}
                value={title}
                onChange={(e) => setTitle(e.target.value)}  // Update state on change
              />
              <label className={styles['text']}> Date and Time</label>
              <input
                className={styles['input']}
                value={date}
                onChange={(e) => setDate(e.target.value)}  // Update state on change
              />
              <label className={styles['text']}> Description</label>
              <input
                className={styles['input']}
                value={description}
                onChange={(e) => setDescription(e.target.value)}  // Update state on change
              />
              <button className={styles['create-button']} type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </button>
              <Link href={'/admin/adminActivity'}>
                <button className={styles['create-button']} type="button">Back</button>  {/* Changed to type="button" to prevent form submission */}
              </Link>
            </form>
            {/* Display success or error message */}
            {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
            {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
          </div>
        </div>
      </div>
      <AdminNavbarBottom />
    </>
  );
}
