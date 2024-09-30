import Image from 'next/image';
import { storage } from '../api/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import styles from '@/styles/postactivity.module.css';
import Link from "next/link";
import { db } from '../api/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs

export default function PostActivity() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileupload, setFileupload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileupload(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!fileupload) {
      setErrorMessage('Please select an image to upload.');
      setLoading(false);
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `activity/${fileupload.name}`);
      await uploadBytes(storageRef, fileupload);
      const imageUrl = await getDownloadURL(storageRef);
      setImageUrl(url);

      // Generate a unique document ID
      const activityId = uuidv4();

      // Add activity post to Firestore
      await setDoc(doc(db, 'camels', 'camelsrestaurant', 'activities', activityId), {
        title,
        startDate,
        endDate,
        description,
        imageUrl: url,
    });

    // Reset form
    setTitle('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setImage(null);
    setImageUrl('');

    alert("Post created successfully!");
} catch (error) {
    console.error("Error adding document: ", error);
    alert("Error creating post: " + error.message);
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
              {/* "Choose File" at the bottom */}
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

              {error && <p className={Style['error']}>{error}</p>}

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

              {/* Choose file input at the bottom of the container */}
              <input type="file" onChange={handleFileChange} />
            </div>
            <form className={styles['container-text']} onSubmit={handleSubmit}>
              <label className={styles['text']}>Title</label>
              <input
                className={styles['input']}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label className={styles['text']}>Start Date</label>
              <input
                type="date"
                className={styles['input']}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <label className={styles['text']}>End Date</label>
              <input
                type="date"
                className={styles['input']}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <label className={styles['text']}> Description</label>
              <input
                className={styles['input']}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button className={styles['create-button']} type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </button>
              <Link href={'/admin/adminActivity'}>
                <button className={styles['create-button']} type="button">Back</button>
              </Link>
            </form>
            {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
            {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
          </div>
        </div>
      </div>
      <AdminNavbarBottom />
    </>
  );
}
