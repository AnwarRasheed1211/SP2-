import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from '@/styles/admin.module.css';
import Link from "next/link";

export default function adminHome() {
        // List of events with title, description, and date
        const events = [
            {
                title: "Special discount for Eid Al Adha",
                description: "Enjoy a special discount this Eid al-Adha with up to 50% off on all our products, making your celebrations even more joyous.",
                date: "June 20, 2024 - June 30, 2024",
                image: "/event.png", 
            },
            {
                title: "New Year Celebration",
                description: "Ring in the New Year with our exciting menu and live performances to keep the celebrations going all night!",
                date: "December 31, 2024",
                image: "/event.png", 
            },
            {
                title: "Valentine's Day Special",
                description: "Join us for a romantic evening with a special Valentine's Day menu and an exclusive couples' offer.",
                date: "February 14, 2024",
                image: "/event.png", 
            }
            // Add more events as needed
        ];
    
        const [currentEventIndex, setCurrentEventIndex] = useState(0);
    
        // Navigate to the previous event
        const handlePrevEvent = () => {
            setCurrentEventIndex((prevIndex) => (prevIndex === 0 ? events.length - 1 : prevIndex - 1));
        };
    
        // Navigate to the next event
        const handleNextEvent = () => {
            setCurrentEventIndex((prevIndex) => (prevIndex === events.length - 1 ? 0 : prevIndex + 1));
        };
    
        const currentEvent = events[currentEventIndex];

    return (
        <> 
            <AdminNavbar />
            <div className={styles.mainSection}>
                <div className={styles.imageContainer}>
                    <Image src="/homebackgr0und.jpg" alt="Logo" layout="fill" objectFit="cover" className={styles.image} />
                    <div className={styles.header}>CAMELS</div>
                    <div className={styles.header1}>Cafe & Restaurant</div>
                    <Link href={'/admin/adminMenu'}>
                        <button className={styles.menuButton}>Menu</button>
                    </Link>
                    <Link href={'/booking/bookingTable'}>
                        <button className={styles.bookTableButton}>Book a Table</button>
                    </Link>
                </div>

                <div className={styles.head}>ANNOUNCEMENT </div>
                <div className={styles.mainEventContainer}>
                    <button className={styles.arrowButtonLeft} onClick={handlePrevEvent}>
                        &#8592; {/* Left arrow */}
                    </button>
                    <Image src={currentEvent.image}  alt="Event Image" width={2000} height={2000} className={styles.eventImage} />
                    <div className={styles.eventDetails}>
                        <div className={styles.eventTitle}>{currentEvent.title}</div>
                        <div className={styles.line2} />
                        <div className={styles.eventDescription}>
                        {currentEvent.description}
                        </div>
                        <div className={styles.eventDate}>{currentEvent.date}</div>
                    </div>
                    <button className={styles.arrowButtonRight} onClick={handleNextEvent}>
                        &#8594; {/* Right arrow */}
                    </button>
                </div>

                <div className={styles.line} />
                <div className={styles.head2}>HIGHLIGHTS PHOTOS</div>
                <div className={styles.highlightImageContainer}>
                    <Image src="/highlight.png" width={1000} height={1000} className={styles.highlightImage} />
                </div>

                <div className={styles.line} />
                <div className={styles.head2}>VIDEOS</div>
                <div className={styles.videoContainer}>
                    <div className={styles.videoPlaceholder}>
                        <Image src="/placeholder1.png" width={500} height={300} className={styles.videoPlaceholderImage} />
                    </div>
                    <div className={styles.videoPlaceholder}>
                        <Image src="/placeholder2.png" width={500} height={300} className={styles.videoPlaceholderImage} />
                    </div>
                </div>

                <div className={styles.line3} />

            </div>
            
            <AdminNavbarBottom />
        </>
    );
}
