'use client';

import Image from 'next/image';
import { useState } from 'react';
import {db , storage } from '@/pages/api/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Style from '@/styles/addmenu.module.css';
import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import Link from "next/link";
import { collection, addDoc } from "firebase/firestore";

export default function Addmenu() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [fileupload, setFileupload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');  // Success message
  const [errorMessage, setErrorMessage] = useState('');      // Error message

  let categories = ["All", "Main", "Fried Food", "Salad", "Dessert", "Drinks"];

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
    setUploading(true);
    setSuccessMessage('');
    setErrorMessage('');
  
    if (!fileupload) {
      setErrorMessage('Please select an image to upload.');
      setUploading(false);
      return;
    }
  
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `menu/${fileupload.name}`);
      await uploadBytes(storageRef, fileupload);
      const imageUrl = await getDownloadURL(storageRef);
  
      setUploadedUrl(imageUrl);  // Corrected this line
  
      // Generate a unique document ID
      const menuId = uuidv4();
  
      // Add menu item to Firestore
      await setDoc(doc(db, 'camels', 'camelsrestaurant', 'menu', menuId), {
        title,
        category,
        price: parseFloat(price),
        description,
        imageUrl: imageUrl,  // Corrected to use imageUrl
      });
  
      // Show success message
      alert("Menu item created successfully!");
  
      // Reset form
      setTitle('');
      setCategory('All');
      setPrice('');
      setDescription('');
      setFileupload(null);
      setUploadedUrl('');  // Reset the uploaded URL
  
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding document: " + error.message);
    } finally {
      setUploading(false);
    }
  };
  


  return (
    <>
      <AdminNavbar />
      <div className={Style['home-page']}>
        <div className={Style['cover']}>
          <div className={Style['container']}>NEW MENU</div>
          <div className={Style['container2']}>
            <div className={Style['container-pic']}>
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

            <form className={Style['container-text']} onSubmit={handleSubmit}>
              <label className={Style['text']}>Title</label>
              <input className={Style['input']} value={title} onChange={(e) => setTitle(e.target.value)} />

              <label className={Style['text']}>Category</label>
              <select className={Style['input']} value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>

              <label className={Style['text']}>Price</label>
              <input className={Style['input']} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

              <label className={Style['text']}>Description</label>
              <textarea className={Style['input']} rows="3" cols="30" value={description} onChange={(e) => setDescription(e.target.value)} />

              <div className={Style['button-container']}>
                <button type="submit" className={Style['create-button']}>Create</button>
                <Link href={'/admin/adminMenu'}>
                  <button type="button" className={Style['create-button']}>Back</button>
                </Link>
              </div>
            </form>
            {successMessage && <p className={Style['success-message']}>{successMessage}</p>}
            {errorMessage && <p className={Style['error-message']}>{errorMessage}</p>}
          </div>
        </div>
      </div>
      <AdminNavbarBottom />
    </>
  );
}
