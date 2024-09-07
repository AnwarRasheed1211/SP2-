import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import React, { useState } from 'react';
import styles from '@/styles/booking.module.css';
import Link from "next/link";
import Image from "next/image";

export default function SeatSelection() {
    const initialSeatData = [
        { seatName: 'Tent 1', people: 5, reserved: false },
        { seatName: 'Tent 2', people: 5, reserved: true },
        { seatName: 'Tent 3', people: 5, reserved: false },
        { seatName: 'Tent 4', people: 5, reserved: false },
        { seatName: 'Tent 5', people: 5, reserved: false },
        { seatName: 'Tent 6', people: 5, reserved: false },
        { seatName: 'Tent 7', people: 5, reserved: true },
        { seatName: 'Tent 8', people: 5, reserved: false },
        { seatName: 'Tent 9', people: 5, reserved: false },
        { seatName: 'Tent 10', people: 5, reserved: false },
        { seatName: 'Tent 11', people: 5, reserved: false },
        { seatName: 'Tent 12', people: 5, reserved: true },
        { seatName: 'Tent 13', people: 5, reserved: false },
        { seatName: 'Tent 14', people: 5, reserved: false },
        { seatName: 'Tent 15', people: 5, reserved: false }
    ];

    const [seatData, setSeatData] = useState(initialSeatData);
    const [numPeople, setNumPeople] = useState(0);
    const [maxPeople, setMaxPeople] = useState(0); // State for maximum number of people
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [message, setMessage] = useState('');

    const getMaxSeatsAllowed = (people) => {
        return Math.ceil(people / 5);
    };

    const handleSeatClick = (seat) => {
        //disabled={seat.reserved}
        if (seat.reserved) {
            alert('This seat is reserved and cannot be selected.');
            return;
        }

        const maxSeatsAllowed = getMaxSeatsAllowed(maxPeople);

        if (selectedSeats.includes(seat)) {
            //Deselect the seat
            setSelectedSeats(selectedSeats.filter(s => s !== seat));
            setNumPeople(numPeople - seat.people);
        } else {
            if (selectedSeats.length < maxSeatsAllowed) {
                // Select the seat
                setSelectedSeats([...selectedSeats, seat]);
                setNumPeople(numPeople + seat.people);
            } else {
                alert(`You can only select up to ${maxSeatsAllowed} seat(s) for ${maxPeople} people.`);
            }
        }
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleMaxPeopleChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0) {
            setMaxPeople(value);
        } else {
            setMaxPeople(0);
        }
    };

    const bookingFeePerSeat = 5;
    const totalBookingFee = selectedSeats.length * bookingFeePerSeat;

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.container1}>
                        <div className={styles.head}>Seat Selection</div>
                        <div className={styles.seatSelectionContainer}>
                            <div className={styles.seatLayoutContainer}>
                                <div className={styles.imageContainer}>
                                    <Image
                                        src="/seat.jpg"
                                        alt="Seat Layout"
                                        layout="responsive"
                                        width={100}
                                        height={100}
                                        quality={100}
                                    />
                                </div>
                                <div className={styles.seatLayout}>
                                    <div className={styles.peopleInputContainer}>
                                        <label htmlFor="numPeople">Number of People:</label>
                                        <input
                                            id="numPeople"
                                            type="number"
                                            min="1"
                                            max="75"
                                            value={maxPeople}
                                            onChange={handleMaxPeopleChange}
                                            className={styles.peopleInput}
                                        />
                                    </div>

                                    <div className={styles.seatStatusContainer}>
                                        <div className={styles.statusItem}>
                                            <div className={styles.statusColorReserved}></div>
                                            <span>Reserved</span>
                                        </div>
                                        <div className={styles.statusItem}>
                                            <div className={styles.statusColorAvailable}></div>
                                            <span>Available</span>
                                        </div>
                                        <div className={styles.statusItem}>
                                            <div className={styles.statusColorSelected}></div>
                                            <span>Selected</span>
                                        </div>
                                    </div>
                                    <div className={styles.row}>
                                        {seatData.slice(0, 5).map(seat => (
                                            <button
                                            key={seat.seatName}
                                            className={`${styles.seat} ${seat.reserved ? styles.reserved : ''} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                            onClick={() => handleSeatClick(seat)}
                                            disabled={seat.reserved}
                                        >
                                            {seat.seatName}
                                            <br />
                                            <span className={styles.peopleCount}>({seat.people} people)</span>
                                        </button>
                                        
                                        ))}
                                    </div>
                                    <div className={styles.row}>
                                        {seatData.slice(5, 8).map(seat => (
                                            <button
                                                key={seat.seatName}
                                                className={`${styles.seat} ${seat.reserved ? styles.reserved : ''} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={seat.reserved}
                                            >
                                                {seat.seatName}
                                                <br />
                                                <span className={styles.peopleCount}>({seat.people} people)</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.row}>
                                        {seatData.slice(8, 11).map(seat => (
                                            <button
                                                key={seat.seatName}
                                                className={`${styles.seat} ${seat.reserved ? styles.reserved : ''} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={seat.reserved}
                                            >
                                                {seat.seatName}
                                                <br />
                                                <span className={styles.peopleCount}>({seat.people} people)</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.row}>
                                        {seatData.slice(11).map(seat => (
                                            <button
                                                key={seat.seatName}
                                                className={`${styles.seat} ${seat.reserved ? styles.reserved : ''} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={seat.reserved}
                                            >
                                                {seat.seatName}
                                                <br />
                                                <span className={styles.peopleCount}>({seat.people} people)</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.selectedSeatsContainer}>
                                <div className={styles.selectedSeatsHeader}>Each Selected Seat costs 5 dollars for booking deposits</div>
                            
                                <div className={styles.bookingInfo}>
                                        <div>Seats Booked: {selectedSeats.length}, Total Booking Fees: ${totalBookingFee}</div>
                                </div>
                                <div className={styles.selectedSeatsList}>
                                    {selectedSeats.length > 0 ? (
                                        selectedSeats.map(seat => (
                                            <span key={seat.seatName} className={styles.selectedSeat}>{seat.seatName} ({seat.people} people)</span>
                                        ))
                                    ) : (
                                        <span className={styles.noSeats}>No seats selected</span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.messageBox}>
                                <label htmlFor="message">Additional Information:</label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={handleMessageChange}
                                    placeholder="Enter any additional information here..."
                                    className={styles.messageInput}
                                />
                            </div>
                            <div className={styles.buttonContainerSeat}>
                                <Link href={'/booking/bookingTable'}>
                                <button className={styles.navButtonSeat}>BACK</button>
                                </Link>
                                <Link href={'/booking/bookingfeeNmenu'}>
                                <button className={styles.navButtonSeat}>NEXT</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CustomerNavbarBottom />
        </>
    );
}
