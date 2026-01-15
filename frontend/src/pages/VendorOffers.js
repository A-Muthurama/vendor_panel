import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";
import "../styles/VendorOffers.css";
import TopHeader from "../components/TopHeader";

const VendorOffers = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [offers, setOffers] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/protected/offers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOffers(res.data);
            } catch (err) {
                console.error("Error fetching offers:", err);
            } finally {
                setFetching(false);
            }
        };
        fetchOffers();
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this offer?")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/protected/offers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOffers(offers.filter(o => o.id !== id));
        } catch (err) {
            alert("Failed to delete offer");
        }
    };

    return (
        <div className="dashboard-container">
            <TopHeader />
            <div className="dashboard-content">
                <div className="offers-wrapper">
                    <div className="offers-header">
                        <div>
                            <h1>Manage Offers</h1>
                            <p>Track and manage your product showcases</p>
                        </div>
                        <button className="create-btn" onClick={() => navigate("/upload")}>
                            + Create New
                        </button>
                    </div>

                    {fetching ? (
                        <div className="loading-state-mini">
                            <div className="loader-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <p>Syncing your offers...</p>
                        </div>
                    ) : offers.length > 0 ? (
                        <div className="offers-grid">
                            {offers.map((offer) => (
                                <div className="offer-card" key={offer.id}>
                                    <div className="offer-image">
                                        <img src={offer.poster_url || "https://via.placeholder.com/300x200"} alt={offer.title} />
                                        <div className={`status-badge ${offer.status.toLowerCase()}`}>
                                            {offer.status}
                                        </div>
                                    </div>
                                    <div className="offer-details">
                                        <h3>{offer.title}</h3>
                                        <p className="offer-cat">{offer.category}</p>
                                        <div className="offer-dates">
                                            <span>📅 {new Date(offer.start_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="offer-actions">
                                            <button className="delete-btn" onClick={() => handleDelete(offer.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-offers-state">
                            <div className="empty-icon">🛍️</div>
                            <h2>No Active Offers</h2>
                            <p>Start showcasing your collections to reach more customers.</p>
                            <div className="empty-actions">
                                <button className="primary-empty-btn" onClick={() => navigate("/upload")}>Create First Offer</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorOffers;
