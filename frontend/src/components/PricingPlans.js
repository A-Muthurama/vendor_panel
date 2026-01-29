import { useState, useEffect } from "react";
import "./Pricing.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopHeader from "../components/TopHeader";
import { subscribePlan, createOrder, getPlans } from "../api/vendorApi";

export default function PricingPlans() {
  const navigate = useNavigate();
  const { vendor, status } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await getPlans();
        // Sort by price if not already sorted by backend
        setPlans(data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

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

    try {
      // Step 1: Create order on backend
      console.log("Creating Razorpay order on server...");
      const orderResponse = await createOrder({
        amount: plan.price,
        planName: plan.name,
        posts: plan.posts
      });

      const { orderId, amount, keyId } = orderResponse.data;
      console.log("Order created:", orderId);

      // Step 2: Load Razorpay SDK
      const res = await loadRazorpay();
      if (!res) {
        alert("Error: Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      // Step 3: Open Razorpay with server-created order
      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "Seller Marketplace",
        description: `${plan.name} Plan - ${plan.posts} Posts`,
        order_id: orderId, // Server-created order ID
        handler: async function (response) {
          try {
            await subscribePlan({
              planName: plan.name,
              price: plan.price,
              posts: plan.posts,
              months: plan.months || 1, // Pass months
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
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
          contact: vendor?.phone ? String(vendor.phone) : "9999999999"
        },
        theme: {
          color: "#ca8a04"
        },
        modal: {
          ondismiss: function () {
            console.log('Checkout form closed');
          }
        }
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response) {
        console.error("Payment Failed Event:", response.error);
        alert(`Payment Failed: ${response.error.description || response.error.reason || "Unknown error"}`);
      });

      razorpay.open();

    } catch (e) {
      console.error("Payment Initialization Error:", e);
      alert(`Failed to initialize payment: ${e.response?.data?.message || e.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      <TopHeader />
      <div className="dashboard-content">
        <div className="pricing-container" style={{ minHeight: "auto", background: "transparent", padding: "20px" }}>
          <h1>Choose Your Subscription Plan</h1>
          <h3>Select the best subscription to list your products</h3>

          {loading ? (
            <p style={{ textAlign: "center", fontSize: "18px", marginTop: "20px" }}>Loading Plans...</p>
          ) : (
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
                  {/* Display months if available, although not strictly requested by design but good for info */}
                  {plan.months && <p className="duration" style={{ fontSize: '14px', color: '#666' }}>Valid for {plan.months} month(s)</p>}

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
          )}
        </div>
      </div>
    </div>
  );
}
