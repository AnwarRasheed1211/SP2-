import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import styles from '@/styles/booking.module.css';
import React, { useState, useEffect } from 'react';
import { db, storage } from "@/pages/lib/firebase"; // Ensure this path is correct
import { collection, getDocs, query, where, getDoc, doc  } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from 'next/router';
import { onAuthStateChanged } from "firebase/auth";

export default function customerBookList() {

    const [bookingFee, setBookingFee] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [order, setOrder] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); 
    
    useEffect(() => {
        const auth = getAuth();
    
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email); // Set user email if authenticated
            } else {
                setUserEmail(null); // Reset user email if not authenticated
            }
        });
    
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!userEmail) return; // Only fetch if userEmail is set
            try {
                const bookingsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
                const q = query(bookingsRef, where("email", "==", userEmail));
                const querySnapshot = await getDocs(q);
        
                const bookings = [];
                querySnapshot.forEach((doc) => {
                    bookings.push({ id: doc.id, ...doc.data() });
                });
        
                if (bookings.length > 0) {
                    // Set the first booking as the user data (or adjust as needed)
                    const latestBooking = bookings[0]; // Or any logic to select the right booking
                    setUser({
                        firstName: latestBooking.firstName || 'N/A',
                        lastName: latestBooking.lastName || 'N/A',
                        phone: latestBooking.phone || 'N/A',
                        email: userEmail, // Use the authenticated email
                        date: latestBooking.date || 'N/A',
                        timeSlot: latestBooking.timeSlot || 'N/A',
                        selectedSeats: latestBooking.selectedSeats || [],
                        message: latestBooking.message || 'N/A',
                        menuOrders: latestBooking.menuOrders || [],
                        bookingStatus: latestBooking.bookingStatus || 'N/A',
                        totalbookingFee: latestBooking.totalBookingFee || 0,
                    });
                } else {
                    // Handle case with no bookings
                    setUser({
                        firstName: 'N/A',
                        lastName: 'N/A',
                        phone: 'N/A',
                        email: userEmail,
                        date: 'N/A',
                        timeSlot: 'N/A',
                        selectedSeats: [],
                        menuOrders: [],
                        message: 'N/A',
                        bookingStatus: 'N/A',
                        totalbookingFee: 0,
                    });
                }
    
                setOrder(bookings); // Set the bookings data
                setLoading(false); // Set loading to false after fetching
            } catch (error) {
                console.error('Error fetching bookings: ', error);
                setLoading(false);
            }
        };
        
        fetchBookings();
    }, [userEmail]);
    
    

    const calculateTotal = () => {
        // Check if order is an array and has elements
        return Array.isArray(user.menuOrders) && user.menuOrders.length > 0
            ? user.menuOrders.reduce((total, item) => {
                // Check if item.price and item.quantity are defined and valid
                const price = parseFloat(item.price?.toString().replace('฿', '') || 0);
                const quantity = item.quantity || 0; // Fallback to 0 if quantity is undefined
                return total + (price * quantity);
            }, 0).toFixed(2)
            : '0.00'; // Return '0.00' if order is empty
    };
    

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(URL.createObjectURL(file)); // Preview the uploaded image
        }
    };

    const handleCancel = () => {
        // Logic to cancel the booking goes here
        console.log("Booking has been canceled.");
        setCancelModalVisible(false); // Close the cancel modal
    };

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.bookingInfoContainer}>
                        <div className={styles.head}> BOOKING INFO </div>
                            <div className={styles.calendarContainer}>
                                <div className={styles.squareBox5}>
                                    <div className={styles.bookingDetails}>
                                            <div className={styles.section}>
                                                <h3>Contact Information</h3>
                                                <div className={styles.contactRow}>
                                                    <p>First Name: {user.firstName }</p>
                                                    <p>Last Name: {user.lastName }</p>
                                                </div>
                                                <p>Phone Number: {user.phone }</p>
                                                <p>Email: {user.email }</p>
                                            </div>
                                            <div className={styles.section}>
                                                <h3>Booking Date and Time</h3>
                                                <div className={styles.contactRow}>
                                                    <p>Date: {user.date}</p>
                                                    <p>Time: {user.timeSlot}</p>
                                                </div>
                                            </div>
                                            <div className={styles.section}>
                                                <h3>Table Reservation</h3>
                                                <p>Number of Seats: {user.selectedSeats?.length || 0}</p> {/* Safely access length */}
                                                <p>Seats Booked: {user.selectedSeats && user.selectedSeats.join(', ')}</p>
                                                <p>Message: {user.message}</p>
                                                <p>Status: {user.bookingStatus}
                                                {user.status === 'Payment Incomplete' && (
                                                    <button className={styles.viewButton} onClick={() => setModalVisible(true)}>View</button>
                                                )}
                                                </p>
                                                <p>Status Message: {user.status}</p>
                                            </div>
                                    </div>
                                    <div className={styles.billSummary}>
                                            <h2>Order Summary</h2>
                                            <ul>
                                                {user.menuOrders && user.menuOrders.length > 0 ? (
                                                    user.menuOrders.map((order, index) => (
                                                        <li key={index}>{order.quantity} x {order.title} = {order.price}</li>
                                                    ))
                                                ) : (
                                                    <li>No menu orders placed.</li>
                                                )}
                                            </ul>
                                            <div className={styles.fee}>
                                                <span>Booking Fee: ฿{user.totalbookingFee}</span>
                                            </div>
                                            <h3>Total(Pay at Restaurant): ฿{calculateTotal()}</h3>
                                            <button className={styles.cancelButton} onClick={() => setCancelModalVisible(true)}>CANCEL</button>
                                    </div>
                                </div>
                                <div className={styles.policySquare}>
                                <div className={styles.policyHeader}>Booking Policy</div>
                                    <ul className={styles.policyList}>
                                        <li>
                                            <strong>Cancellation Policy:</strong> Customers are allowed to cancel their booking; however, the booking fees will not be refunded.
                                        </li>
                                        <li>
                                            <strong>Late Arrival:</strong> Reserved seats will be cancelled if customers arrive 30 minutes after the appointed time.
                                        </li>
                                        <li>
                                            <strong>Reservation Limitations:</strong> Customers can make a new reservation only if their previous booking status is 𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙚𝙙, 𝙢𝙞𝙨𝙨𝙚𝙙, or 𝙘𝙖𝙣𝙘𝙚𝙡𝙡𝙚𝙙. However, statuses of 𝙥𝙚𝙣𝙙𝙞𝙣𝙜 or 𝙥𝙖𝙮𝙢𝙚𝙣𝙩 𝙞𝙣𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙚 will prevent new reservations.
                                        </li>
                                        <li>
                                            <strong>24-Hour Payment Reminder:</strong> Customers will have 𝟐𝟒 hours to pay the remaining booking fee if the initial booking payment is insufficient.
                                        </li>
                                    </ul>
                                </div>
                        </div>
                    </div>
                </div>
            </div>

            {modalVisible && (
                <div className={styles.cmodal}>
                    <div className={styles.cmodalContent}>
                        <div className={styles.qrCodeWrapper}>
                            <label>PromptPay QR Code</label>
                            <Image
                                src="/qrc0de.png"
                                alt="PromptPay QR Code"
                                width={300}
                                height={300}
                            />
                            <p>Please scan the QR code to make the payment.</p>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="imageUpload">Upload Receipt (Remaining Amount: ฿{user.remainingbills})</label>
                            <input
                                type="file"
                                id="imageUpload"
                                name="imageUpload"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {imageFile && (
                                <div className={styles.imagePreview}>
                                    <h4>Uploaded Image:</h4>
                                    <Image
                                        src={imageFile}
                                        alt="Uploaded Receipt"
                                        width={300}
                                        height={300}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            )}
                        </div>
                        <button className={styles.ccloseButton} onClick={() => setModalVisible(false)}>Close</button>
                    </div>
                </div>
            )}

            {cancelModalVisible && (
                <div className={styles.cancelmodal}>
                    <div className={styles.cancelmodalContent}>
                        <h3>Are you sure you want to cancel your booking?</h3>
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelconfirmButton} onClick={handleCancel}>Yes, Cancel</button>
                            <button className={styles.noButton} onClick={() => setCancelModalVisible(false)}>No, Go Back</button>
                        </div>
                    </div>
                </div>
            )}

            <CustomerNavbarBottom />
        </>
    )


}