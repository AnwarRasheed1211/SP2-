'use client';

import Image from 'next/image';
import { useState } from 'react';
import { storage } from '../api/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Style from '@/styles/addmenu.module.css';
import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import Link from "next/link";
const { getDatabase } = require('firebase-admin/database');

export default function Addmenu() {
    const [fileupload, setFileupload] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileupload(file);

        // Generate a preview of the image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result); // Set the image preview URL
        };
        if (file) {
            reader.readAsDataURL(file); // Read the file as a data URL
        } else {
            setImagePreview(null);
        }
    };

    const handleUpload = async () => {
        if (!fileupload) return;

        setUploading(true);
        setError(null);
        const storageRef = ref(storage, `admin/activitypic/${fileupload.name}`);

        try {
            await uploadBytes(storageRef, fileupload);
            const url = await getDownloadURL(storageRef);
            setUploadedUrl(url);
            console.log("File Uploaded Successfully");
        } catch (error) {
            console.error('Error uploading the file', error);
            setError('Failed to upload the file. Please try again.');
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
                            <input type="file" onChange={handleFileChange} />
                            
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

                            <button onClick={handleUpload} disabled={uploading}>
                                {uploading ? "Uploading..." : "Upload Image"}
                            </button>

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
                        </div>
                        <form className={Style['container-text']}>
                            <label className={Style['text']}>Title</label>
                            <input className={Style['input']} />
                            <label className={Style['text']}>Category</label>
                            <input className={Style['input']} />
                            <label className={Style['text']}>Price</label>
                            <input className={Style['input']} />
                            <label className={Style['text']}>Description</label>
                            <input className={Style['input']} />
                            <button className={Style['create-button']} type="submit">Create</button>
                            <Link href={'/admin/adminMenu'}>
                                <button className={Style['create-button']} type="button">Back</button>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
            <AdminNavbarBottom />
        </>
    );
}
