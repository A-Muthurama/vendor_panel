
import "./Pricing.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopHeader from "../components/TopHeader";
import { subscribePlan } from "../api/vendorApi";

const plans = [
  { id: 1, name: "Starter", price: 299, posts: 5 },
  { id: 2, name: "Growth", price: 399, posts: 8, popular: true },
  { id: 3, name: "Professional", price: 599, posts: 15 },
  { id: 4, name: "Enterprise", price: 999, posts: 30 }
];

export default function PricingPlans() {
  const navigate = useNavigate();
  const { vendor, status } = useAuth();

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
    // Safety check: Only approved vendors can pay/subscribe
    if (status !== 'APPROVED') {
      alert("⚠️ Business Not Verified: You can only purchase plans once your business documents are VERIFIED by our team. Please check your Profile for status.");
      return;
    }

    // Razorpay Flow
    const res = await loadRazorpay();

    if (!res) {
      alert("Error: Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_S68TWLPshRESNF",
      amount: plan.price * 100, // in paise
      currency: "INR",
      name: "Seller Marketplace",
      description: `${plan.name} Plan - ${plan.posts} Posts`,
      handler: async function (response) {
        try {
          await subscribePlan({
            planName: plan.name,
            price: plan.price,
            posts: plan.posts,
            paymentId: response.razorpay_payment_id
          });
          alert("Payment Successful & Subscription Activated");
          navigate("/vendor/dashboard");
        } catch (err) {
          console.error("Subscription Error:", err);
          const msg = err.response?.data?.message || "Payment successful but activation failed. Contact support.";
          alert(`Error: ${msg}`);
          navigate("/vendor/dashboard");
        }
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

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description || "Unknown error"}`);
      });
    } catch (e) {
      console.error("Razorpay Init Error", e);
      alert("Failed to initialize payment gateway.");
    }
  };

  return (
    <div className="dashboard-container">
      <TopHeader />
      <div className="dashboard-content">
        <div className="pricing-container" style={{ minHeight: "auto", background: "transparent", padding: "20px" }}>
          <h1>Choose Your Subscription Plan</h1>
          <h3>Select the best subscription to list your products</h3>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card ${plan.popular ? "popular" : ""}`}
              >
                {plan.popular && <span className="badge">Most Popular</span>}

                <h3 className="plan-name" style={{ color: '#4C0F2E', fontSize: '24px', margin: '10px 0' }}>{plan.name}</h3>
                <h2 className="price">₹{plan.price}</h2>
                <p className="posts">{plan.posts} Product Posts</p>

                <ul>
                  <li>✔ {plan.posts} Listings</li>
                  <li>✔ Admin Approval</li>
                  <li>✔ Visible to Customers</li>
                </ul>

                <button onClick={() => handleSelect(plan)}>
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
