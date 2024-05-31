import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import CheckoutForm from "./CheckoutForm";
import axios from "axios";
import "../Stripe.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51OHl0BHdXlFYdA6aOh9nZOndpP2cFxO73WJDUyK0oOexQJfRHA9gzMBCxZzwm6al0P9nFi7KAb3h1lJ06ymT8Ocn00fq6nTh1X"
);

export default function StripeCheckout() {
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [backClicked, setBackClicked] = useState(false);

  const currentOrder = useSelector((state) => state.order.currentOrder);

  function setPaymentStatus() {
    setIsPaymentCompleted(true);
  }

  useEffect(() => {
    const cancelPaymentIntent = async () => {
      try {
        await axios.post("/api/checkout/cancel-payment-intent", {
          paymentIntentId,
        });
        console.log("Payment intent canceled successfully.");
      } catch (error) {
        console.error("Failed to cancel payment intent:", error);
      }
    };

    return () => {
      // Cancel the payment intent when the component is unmounted
      !isPaymentCompleted &&
        paymentIntentId.length !== 0 &&
        cancelPaymentIntent();
    };
  }, [paymentIntentId]);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    loading === false &&
      fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: currentOrder.amounts,
          orderId: currentOrder._id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        });

    setLoading(false);
  }, [loading]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="StripeContainer">
      <div className="Stripe">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm setPaymentStatus={setPaymentStatus} />
          </Elements>
        )}
      </div>
    </div>
  );
}
