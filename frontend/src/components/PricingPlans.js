
import "./Pricing.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const plans = [
  { id: 1, price: 299, posts: 5 },
  { id: 2, price: 399, posts: 8 },
  { id: 3, price: 599, posts: 15 },
  { id: 4, price: 999, posts: 30 }
];

export default function PricingPlans() {
  const navigate = useNavigate();
  const { vendor } = useAuth();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSelect = async (plan) => {
    // Bypass payment for now
    navigate("/upload", { state: { plan } });


    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Check internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_RrmurNVGRTmBXH", // ✅ Your Test Key
      amount: plan.price * 100, // in paise
      currency: "INR",
      name: "Seller Marketplace",
      description: `${plan.posts} Product Posts Subscription`,
      handler: function (response) {
        alert("Payment Successful ");
        console.log("Payment ID:", response.razorpay_payment_id);
        navigate("/upload");
      },
      prefill: {
        name: vendor?.ownerName || "Seller Name",
        email: vendor?.email || "seller@email.com",
        contact: vendor?.phone || "9999999999"
      },
      theme: {
        color: "#ca8a04" // Yellow-600
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

  };

  return (
    <div className="pricing-container">
      <h1>Choose Your Subscription Plan</h1>
      <h3>Select the best subscription to list your products</h3>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`pricing-card ${plan.popular ? "popular" : ""}`}
          >
            {plan.popular && <span className="badge">Most Popular</span>}

            <h2 className="price">₹{plan.price}</h2>
            <p className="posts">{plan.posts} Product Posts</p>

            <ul>
              <li>✔ {plan.posts} Listings</li>
              <li>✔ Admin Approval</li>
              <li>✔ Visible to Customers</li>
            </ul>

            <button onClick={() => handleSelect(plan)}>
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
