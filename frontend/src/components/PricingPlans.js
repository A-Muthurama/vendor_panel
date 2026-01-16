
import "./Pricing.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopHeader from "../components/TopHeader";
import { subscribePlan } from "../api/vendorApi";

const plans = [
  { id: 1, price: 299, posts: 5 },
  { id: 2, price: 399, posts: 8 },
  { id: 3, price: 599, posts: 15 },
  { id: 4, price: 999, posts: 30 }
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

    // Bypass payment for now (Testing)
    try {
      await subscribePlan({
        planName: "Premium (Test)",
        price: plan.price,
        posts: plan.posts,
        paymentId: "bypass_test_" + Date.now()
      });
      alert("Subscription Activated (Test Mode)");
      navigate("/upload");
    } catch (err) {
      console.error("Subscription Error:", err);
      alert("Failed to activate subscription: " + (err.response?.data?.message || err.message));
    }
    return; // Stop here for now to avoid Razorpay flow while testing

    /* 
    // Razorpay Flow (Uncomment when ready)
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
      handler: async function (response) {
        try {
            await subscribePlan({
                planName: "Premium", // You might want to pass the real plan name
                price: plan.price,
                posts: plan.posts,
                paymentId: response.razorpay_payment_id
            });
            alert("Payment Successful & Subscription Activated");
            navigate("/upload");
        } catch (err) {
            alert("Payment successful but activation failed. Contact support.");
             navigate("/vendor/dashboard");
        }
      },
      // ... rest of options
    };
     
    const razorpay = new window.Razorpay(options);
    razorpay.open();
    */
    /*
    // START OF COMMENTED OUT RAZORPAY CODE
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
  // END OF COMMENTED OUT RAZORPAY CODE
  */
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
      </div>
    </div>
  );
}
