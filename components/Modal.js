import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({ children, title }) => {
    const [isVisible, setIsVisible] = useState(false);  // State to control modal visibility

    // Automatically show modal when the component mounts
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Function to handle closing the modal
    const handleCloseClick = (e) => {
        e.preventDefault();
        setIsVisible(false);
    };

    // If the modal is not visible, return null
    if (!isVisible) return null;

    // Modal content to be displayed
    const modalContent = (
        <div className="modal-overlay">
            <div className="modal-wrapper">
                <div className="modal">
                    <div className="modal-header">
                        <a href="#" onClick={handleCloseClick}>
                            x
                        </a>
                    </div>
                    {title && <h1>{title}</h1>}
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root")  // Ensure this element exists in your document
    );
};

export default Modal;
