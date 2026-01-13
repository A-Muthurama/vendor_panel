import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PosterUpload.css';
import './Pricing.css';
import { useAuth } from '../context/AuthContext';

export default function PosterUpload() {
    const locationState = useLocation();
    const navigate = useNavigate();
    const { status } = useAuth();

    // Redirect if pending
    React.useEffect(() => {
        if (status === "PENDING" || status === "PENDING_APPROVAL") {
            alert("Your account is under review. You have limited access.");
            navigate("/vendor/dashboard");
        }
    }, [status, navigate]);

    const plan = locationState.state?.plan || { posts: 0, price: 0 }; // Default if accessed directly

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [history, setHistory] = useState([]); // Array to store upload history
    const [manualLocation, setManualLocation] = useState('');

    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    // New State for Offer Details
    const [description, setDescription] = useState('');
    const [offerRate, setOfferRate] = useState('');
    const [offerPeriod, setOfferPeriod] = useState('');

    // Derived state
    const uploadsCount = history.length;
    const remainingUploads = plan.posts - uploadsCount;

    // Handle Drag & Drop for Poster
    const [isDragOver, setIsDragOver] = useState(false);
    const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = () => setIsDragOver(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) handleFile(file);
    };

    // Handle Drag & Drop for Video
    const [isVideoDragOver, setIsVideoDragOver] = useState(false);
    const handleVideoDragOver = (e) => { e.preventDefault(); setIsVideoDragOver(true); };
    const handleVideoDragLeave = () => setIsVideoDragOver(false);
    const handleVideoDrop = (e) => {
        e.preventDefault();
        setIsVideoDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) handleVideoFile(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) handleVideoFile(file);
    };

    const handleFile = (file) => {
        if (remainingUploads <= 0) {
            alert("You have reached your upload limit for this plan!");
            return;
        }
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleVideoFile = (file) => {
        if (remainingUploads <= 0) {
            alert("You have reached your upload limit for this plan!");
            return;
        }
        setVideo(file);
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
    };

    const handleSubmit = () => {
        if (!image) return alert("Please upload a poster first.");

        if (!description || !offerRate || !offerPeriod) {
            return alert("Please fill in all offer details.");
        }

        if (!manualLocation) {
            alert("Please paste a Google Maps location link.");
            return;
        }

        // Add to history
        const newUpload = {
            id: Date.now(),
            name: image.name,
            preview: preview,
            video: video ? video.name : null,
            videoPreview: videoPreview,
            description,
            offerRate,
            offerPeriod,
            date: new Date().toLocaleDateString(),
            location: " Link Provided",
            locationDetails: manualLocation,
            status: "Pending Approval"
        };

        setHistory([newUpload, ...history]);

        // Reset form
        setImage(null);
        setPreview(null);
        setVideo(null);
        setVideoPreview(null);
        setManualLocation('');
        setDescription('');
        setOfferRate('');
        setOfferPeriod('');

        alert("Content Submitted Successfully!");
    };

    return (
        <div className="upload-page-wrapper" style={{ minHeight: '100vh', padding: '40px 20px' }}>

            {/* Top Section: Plan Info */}
            <div className="plan-status-bar">
                <div className="status-text">
                    <h3>Subscription: {plan.posts} Posts Plan</h3>
                </div>
                <div className="limit-badge">
                    Remaining: <strong>{remainingUploads}</strong> / {plan.posts}
                </div>
            </div>

            <div className="upload-container">
                <h1>Create New Post</h1>
                <p>Fill in the details below to publish your offer.</p>

                <div className="upload-grid-layout">

                    {/* Card 1: Poster Upload */}
                    <div className="upload-card">
                        <div className="card-header">
                            <h3>1. Upload Poster</h3>
                        </div>
                        <div className="card-body">
                            {remainingUploads > 0 ? (
                                <label
                                    className={`upload-dropzone compact ${isDragOver ? 'active' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <input type="file" accept="image/*" onChange={handleFileChange} />
                                    {preview ? (
                                        <div className="preview-wrapper compact">
                                            <img src={preview} alt="Preview" className="upload-preview" />
                                            <div className="preview-overlay">
                                                <span>Replace</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="dropzone-content compact">
                                            <span className="upload-icon">☁️</span>
                                            <p>Click or Drop Image</p>
                                        </div>
                                    )}
                                </label>
                            ) : (
                                <div className="limit-reached-message">Limit Reached</div>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Video Upload */}
                    <div className="upload-card">
                        <div className="card-header">
                            <h3>2. Upload Video (Optional)</h3>
                        </div>
                        <div className="card-body">
                            {remainingUploads > 0 && (
                                <label
                                    className={`upload-dropzone compact ${isVideoDragOver ? 'active' : ''}`}
                                    onDragOver={handleVideoDragOver}
                                    onDragLeave={handleVideoDragLeave}
                                    onDrop={handleVideoDrop}
                                >
                                    <input type="file" accept="video/*" onChange={handleVideoChange} />
                                    {videoPreview ? (
                                        <div className="preview-wrapper compact">
                                            <video src={videoPreview} controls className="upload-preview" />
                                            <div className="preview-overlay">
                                                <span>Replace</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="dropzone-content compact">
                                            <span className="upload-icon">🎥</span>
                                            <p>Click or Drop Video</p>
                                        </div>
                                    )}
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Card 3: Description */}
                    <div className="upload-card full-width">
                        <div className="card-header">
                            <h3>3. Offer Description</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Description about the offer</label>
                                <textarea
                                    placeholder="Describe your offer in detail..."
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="text-input"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Offer Rate */}
                    <div className="upload-card">
                        <div className="card-header">
                            <h3>4. Offer Rate</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Rate (₹ or %)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 50% OFF or ₹999"
                                    value={offerRate}
                                    onChange={(e) => setOfferRate(e.target.value)}
                                    className="text-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 5: Offer Period */}
                    <div className="upload-card">
                        <div className="card-header">
                            <h3>5. Offer Period</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Validity Period</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Valid till 31st Dec"
                                    value={offerPeriod}
                                    onChange={(e) => setOfferPeriod(e.target.value)}
                                    className="text-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 6: Location */}
                    <div className="upload-card full-width">
                        <div className="card-header">
                            <h3>6. Location</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Google Maps Link</label>
                                <input
                                    type="text"
                                    placeholder="Paste Google Maps Link here..."
                                    value={manualLocation}
                                    onChange={(e) => setManualLocation(e.target.value)}
                                    disabled={remainingUploads <= 0}
                                    className="text-input"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="submit-section">
                    <button className="btn-primary" onClick={handleSubmit} disabled={!image || remainingUploads <= 0 || !manualLocation || !description}>
                        Publish Post
                    </button>
                </div>
            </div>

            {/* Bottom Section: History */}
            <div className="history-section">
                <h2>Upload History</h2>
                {history.length === 0 ? (
                    <p className="no-history">No uploads yet.</p>
                ) : (
                    <div className="history-grid">
                        {history.map(item => (
                            <div key={item.id} className="history-card">
                                <img src={item.preview} alt="poster" />
                                <div className="history-info">
                                    <h4>{item.name}</h4>
                                    {item.video && <span className="video-badge">🎥 Video</span>}
                                    <p className="history-desc">{item.description?.substring(0, 50)}...</p>
                                    <div className="history-meta">
                                        <span>🏷️ {item.offerRate}</span>
                                        <span>📅 {item.offerPeriod}</span>
                                    </div>
                                    <div className="history-footer">
                                        <span>{item.date}</span>
                                        <a href={item.locationDetails} target="_blank" rel="noopener noreferrer">Map ↗</a>
                                    </div>
                                    <span className="status-badge">{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
