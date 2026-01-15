import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopHeader from './TopHeader';
import { Upload, Film, MapPin, Tag, Calendar, Link as LinkIcon, Info } from 'lucide-react';
import './PosterUpload.css';
import { locations } from '../data/locations';
import SearchableDropdown from './SearchableDropdown';

export default function PosterUpload() {
    const locationState = useLocation();
    const navigate = useNavigate();
    const { vendor, status } = useAuth();

    // Redirect if pending
    useEffect(() => {
        if (status === "PENDING" || status === "PENDING_APPROVAL") {
            alert("Your account is under review. You have limited access.");
            navigate("/vendor/dashboard");
        }
    }, [status, navigate]);

    const plan = locationState.state?.plan || { posts: 5, price: 0 }; // Default plan if accessed directly

    // Flatten locations to handle Union Territories as states
    const flattenedLocations = React.useMemo(() => {
        const data = { ...locations };
        if (data["Union Territories"]) {
            Object.assign(data, data["Union Territories"]);
            delete data["Union Territories"];
        }
        return data;
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        productTitle: '',
        shopName: vendor?.shopName || '',
        category: 'Gold',
        discountType: 'Making Charges',
        discountValue: '',
        discountValueNumeric: '',
        description: '',
        validFrom: '',
        validUntil: '',
        buyLink: '',
        isFeatured: false,
        location: {
            state: vendor?.state || '',
            city: vendor?.city || '',
            area: vendor?.area || '',
            pincode: vendor?.pincode || ''
        }
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update shop name when vendor changes
    useEffect(() => {
        if (vendor) {
            setFormData(prev => ({
                ...prev,
                shopName: vendor.shopName,
                location: {
                    state: vendor.state || prev.location.state,
                    city: vendor.city || prev.location.city,
                    pincode: vendor.pincode || prev.location.pincode,
                    area: prev.location.area
                }
            }));
        }
    }, [vendor]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleLocationChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: value,
                ...(name === 'state' ? { city: '' } : {})
            }
        }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'image') {
            if (file.size > 2 * 1024 * 1024) {
                alert("Image size must be less than 2MB");
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                alert("Allowed formats: JPEG, PNG, WebP");
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            if (file.size > 10 * 1024 * 1024) {
                alert("Video size must be less than 10MB");
                return;
            }
            if (!['video/mp4', 'video/quicktime'].includes(file.type)) {
                alert("Allowed formats: MP4, MOV");
                return;
            }
            setVideo(file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.productTitle) newErrors.productTitle = "Title is required";
        if (!formData.description) newErrors.description = "Description is required";
        if (!formData.discountValue) newErrors.discountValue = "Discount value is required";
        if (!formData.validFrom) newErrors.validFrom = "Start date is required";
        if (!formData.validUntil) newErrors.validUntil = "End date is required";
        if (!formData.location.area) newErrors.area = "Area is required";
        if (!image) newErrors.image = "Product image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            window.scrollTo(0, 0);
            return;
        }

        setIsSubmitting(true);
        // Simulate API Call
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Offer Submitted Successfully for Review!");
            navigate("/vendor/offers");
        }, 1500);
    };

    return (
        <div className="upload-page-root">
            <TopHeader />

            <main className="upload-main-content">
                <header className="upload-header-section">
                    <div className="upload-title-box">
                        <h1>Post New Offer</h1>
                        <p>Share your latest collections and exclusive deals with customers.</p>
                    </div>
                    <div className="plan-usage-card">
                        <div className="usage-info">
                            <span>Plan: <strong>{plan.posts} Posts</strong></span>
                            <div className="usage-bar">
                                <div className="usage-progress" style={{ width: '20%' }}></div>
                            </div>
                            <span className="remaining-text">4/5 Posts remaining</span>
                        </div>
                    </div>
                </header>

                <form className="upload-form-grid" onSubmit={handleSubmit}>

                    {/* Left Column: Visuals */}
                    <div className="form-column visual-upload-column">
                        <section className="form-section card-box">
                            <div className="section-header">
                                <Upload size={18} className="icon-gold" />
                                <h3>Product Media</h3>
                            </div>

                            <div className="media-upload-container">
                                <div className={`media-box image-box ${errors.image ? 'error-border' : ''}`}>
                                    <label className="upload-label">
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                                        {preview ? (
                                            <div className="preview-container">
                                                <img src={preview} alt="Offer Preview" />
                                                <div className="change-overlay">Change Image</div>
                                            </div>
                                        ) : (
                                            <div className="upload-placeholder">
                                                <Upload size={32} />
                                                <span>Upload Main Poster</span>
                                                <small>Max 10MB (JPEG, PNG, WebP)</small>
                                            </div>
                                        )}
                                    </label>
                                    {errors.image && <span className="error-text">{errors.image}</span>}
                                </div>

                                <div className="media-box video-box">
                                    <label className="upload-label">
                                        <input type="file" accept="video/mp4,video/quicktime" onChange={(e) => handleFileChange(e, 'video')} />
                                        {videoPreview ? (
                                            <div className="preview-container">
                                                <video src={videoPreview} muted />
                                                <div className="change-overlay">Change Video</div>
                                            </div>
                                        ) : (
                                            <div className="upload-placeholder">
                                                <Film size={32} />
                                                <span>Upload Showcase Video (Optional)</span>
                                                <small>Max 10MB (MP4, MOV)</small>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section className="form-section card-box">
                            <div className="section-header">
                                <LinkIcon size={18} className="icon-gold" />
                                <h3>External Links</h3>
                            </div>
                            <div className="input-group">
                                <label>Buy Online Link (Optional)</label>
                                <input
                                    type="url"
                                    name="buyLink"
                                    placeholder="https://yourwebsite.com/product"
                                    value={formData.buyLink}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Details */}
                    <div className="form-column details-column">
                        <section className="form-section card-box">
                            <div className="section-header">
                                <Info size={18} className="icon-gold" />
                                <h3>Basic Information</h3>
                            </div>

                            <div className="input-row">
                                <div className={`input-group full ${errors.productTitle ? 'has-error' : ''}`}>
                                    <label>Product Title*</label>
                                    <input
                                        type="text"
                                        name="productTitle"
                                        placeholder="e.g. Heritage Bridal Choker"
                                        value={formData.productTitle}
                                        onChange={handleInputChange}
                                    />
                                    {errors.productTitle && <span className="error-hint">{errors.productTitle}</span>}
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label>Shop Name</label>
                                    <input type="text" value={formData.shopName} readOnly className="readonly-input" />
                                </div>
                                <div className="input-group">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange}>
                                        <option>Gold</option>
                                        <option>Silver</option>
                                        <option>Diamond</option>
                                        <option>Platinum</option>
                                        <option>Collection</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group full">
                                <label>Description*</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    placeholder="Exquisite handcrafted 22K gold choker..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                                {errors.description && <span className="error-hint">{errors.description}</span>}
                            </div>
                        </section>

                        <section className="form-section card-box">
                            <div className="section-header">
                                <Tag size={18} className="icon-gold" />
                                <h3>Pricing & Discount</h3>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label>Discount Type</label>
                                    <select name="discountType" value={formData.discountType} onChange={handleInputChange}>
                                        <option>Making Charges</option>
                                        <option>Flat Discount</option>
                                        <option>Percentage Off</option>
                                        <option>Buy 1 Get 1</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Discount Label*</label>
                                    <input
                                        type="text"
                                        name="discountValue"
                                        placeholder="50% OFF on Making"
                                        value={formData.discountValue}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Numeric Value (%)</label>
                                    <input
                                        type="number"
                                        name="discountValueNumeric"
                                        placeholder="50"
                                        value={formData.discountValueNumeric}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="form-section card-box">
                            <div className="section-header">
                                <Calendar size={18} className="icon-gold" />
                                <h3>Validity Period</h3>
                            </div>
                            <div className="input-row">
                                <div className="input-group">
                                    <label>Valid From*</label>
                                    <input
                                        type="date"
                                        name="validFrom"
                                        value={formData.validFrom}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Valid Until*</label>
                                    <input
                                        type="date"
                                        name="validUntil"
                                        value={formData.validUntil}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="form-section card-box">
                            <div className="section-header">
                                <MapPin size={18} className="icon-gold" />
                                <h3>Store Availability</h3>
                            </div>
                            <div className="input-row">
                                <div className="input-group">
                                    <label>State</label>
                                    <SearchableDropdown
                                        options={Object.keys(flattenedLocations)}
                                        value={formData.location.state}
                                        onChange={(val) => handleLocationChange("state", val)}
                                        placeholder="Select State"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>City/District</label>
                                    <SearchableDropdown
                                        options={flattenedLocations[formData.location.state] || []}
                                        value={formData.location.city}
                                        onChange={(val) => handleLocationChange("city", val)}
                                        placeholder={formData.location.state ? "Select District" : "Select State First"}
                                        disabled={!formData.location.state}
                                    />
                                </div>
                            </div>
                            <div className="input-row">
                                <div className={`input-group ${errors.area ? 'has-error' : ''}`}>
                                    <label>Area*</label>
                                    <input
                                        type="text"
                                        name="location.area"
                                        placeholder="Andheri West"
                                        value={formData.location.area}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Pincode</label>
                                    <input type="text" value={formData.location.pincode} readOnly className="readonly-input" />
                                </div>
                            </div>
                        </section>

                        <div className="featured-opt-in">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleInputChange}
                                />
                                <span className="checkmark"></span>
                                <div className="checkbox-label">
                                    <strong>Feature this offer</strong>
                                    <p>Featured offers appear at the top of search results.</p>
                                </div>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Publishing...' : 'Publish Offer'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
