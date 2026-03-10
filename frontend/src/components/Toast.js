import React, { useEffect, useState } from "react";
import "./Toast.css";

function Toast({ type, message, onClose }) {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: "bi-check-circle-fill",
        error: "bi-x-circle-fill",
        info: "bi-info-circle-fill",
        warning: "bi-exclamation-triangle-fill"
    };

    return (
        <div className={`custom-toast ${type} ${exiting ? "exit" : ""}`}>
            <div className="toast-icon">
                <i className={`bi ${icons[type] || icons.info}`}></i>
            </div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={() => { setExiting(true); setTimeout(onClose, 300); }}>
                <i className="bi bi-x"></i>
            </button>
        </div>
    );
}

export default Toast;
