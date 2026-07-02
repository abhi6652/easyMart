import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';

const API_URL = process.env.REACT_APP_API_URL;

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // ================= PAYMENT =================
  const handlePayment = async () => {
    try {
      const orderRes = await fetch(`${API_URL}/api/payment/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });

      // ❌ HTML crash protection
      const contentType = orderRes.headers.get("content-type");

      if (!orderRes.ok || !contentType?.includes("application/json")) {
        const fallback = window.confirm(
          "Payment system not configured properly. Use test bypass mode?"
        );

        if (fallback) return bypassPayment();

        return alert("Payment failed to initialize");
      }

      const orderData = await orderRes.json();

      const options = {
        key: 'rzp_test_dummykey123',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopNest',
        description: 'Test Transaction',
        order_id: orderData.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            if (!verifyRes.ok) {
              return alert("Payment verification failed");
            }

            const saveOrderRes = await fetch(`${API_URL}/api/orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user?.token}`
              },
              body: JSON.stringify({
                items: cartItems,
                totalAmount: totalPrice,
                address,
                paymentId: response.razorpay_payment_id
              })
            });

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              navigate('/ordersuccess');
            } else {
              alert('Order saving failed');
            }
          } catch (err) {
            console.error(err);
            alert("Payment flow error");
          }
        },

        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },

        theme: {
          color: '#f97316'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error(error);
      alert("Payment error");
    }
  };

  // ================= BYPASS =================
  const bypassPayment = async () => {
    try {
      const saveOrderRes = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: totalPrice,
          address,
          paymentId: 'bypass_txn_' + Date.now()
        })
      });

      if (saveOrderRes.ok) {
        dispatch(clearCart());
        navigate('/ordersuccess');
      } else {
        alert("Order saving failed");
      }
    } catch (err) {
      console.error(err);
      alert("Bypass failed");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }

    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <form onSubmit={handleSubmit} className="shipping-form">
        <input placeholder="Full Name" required value={address.fullName}
          onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />

        <input placeholder="Street" required value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })} />

        <input placeholder="City" required value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })} />

        <input placeholder="Postal Code" required value={address.postalCode}
          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />

        <input placeholder="Country" required value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })} />

        <h4>Total: ₹{totalPrice.toFixed(2)}</h4>

        <button type="submit" className="btn">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Checkout;