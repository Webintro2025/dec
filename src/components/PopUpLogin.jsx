"use client";
import React, { useState, useEffect, useRef } from "react";

const parseResponsePayload = async (response) => {
	const rawBody = await response.text();
	if (!rawBody) {
		return null;
	}
	try {
		return JSON.parse(rawBody);
	} catch (error) {
		return rawBody;
	}
};

const Popup = ({ isOpen, onClose, onSuccess }) => {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState({ text: "", isError: false });
	const emailRef = useRef(null);

	useEffect(() => {
		if (!isOpen) {
			setEmail("");
			setOtp("");
			setStep(1);
			setLoading(false);
			setFeedback({ text: "", isError: false });
		}
	}, [isOpen]);

	const handleSubscribeNow = () => {
		// show the email form and focus the input
		setStep(1);
		setTimeout(() => {
			emailRef.current?.focus();
		}, 60);
	};

	if (!isOpen) return null;

	const closePopup = () => {
		onClose?.();
	};

	const handleSendOtp = async (event) => {
		event.preventDefault();
		setLoading(true);
		setFeedback({ text: "", isError: false });
		try {
			const response = await fetch("/api/auth/send-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const payload = await parseResponsePayload(response);
			if (!response.ok) {
				const message = typeof payload === "string" ? payload : payload?.message;
				throw new Error(message || "Unable to send OTP");
			}
			setStep(2);
			setFeedback({ text: "OTP sent to your email address", isError: false });
		} catch (error) {
			setFeedback({ text: error.message, isError: true });
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async (event) => {
		event.preventDefault();
		setLoading(true);
		setFeedback({ text: "", isError: false });
		try {
			const response = await fetch("/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp }),
			});
			const payload = await parseResponsePayload(response);
			if (!response.ok) {
				const message = typeof payload === "string" ? payload : payload?.message;
				throw new Error(message || "Invalid OTP");
			}
			const token = typeof payload === "object" && payload !== null ? payload.token : undefined;
			if (token) {
				localStorage.setItem("token", token);
				if (typeof window !== "undefined") {
					window.dispatchEvent(new CustomEvent("app:token-updated", { detail: token }));
				}
			}
			setFeedback({ text: "Login successful", isError: false });
			onSuccess?.(token || null);
			closePopup();
		} catch (error) {
			setFeedback({ text: error.message, isError: true });
		} finally {
			setLoading(false);
		}
	};

	  return (
	    		<div className="fixed inset-0 bg-transparent flex items-center justify-center min-h-screen z-50 px-4">
				{/* clickable overlay: clicking/touching outside the modal closes it */}
				<div
					className="absolute inset-0"
					onClick={closePopup}
					onTouchStart={closePopup}
				/>
				<div
					className="w-full max-w-[600px] bg-white shadow-lg rounded-md overflow-hidden flex relative flex-col md:flex-row md:h-[460px]"
					onClick={(e) => e.stopPropagation()}
					onTouchStart={(e) => e.stopPropagation()}
				>
						{/* Left Image (hidden on small screens) */}
						<div className="hidden md:block md:w-1/2 md:h-full">
							<img src="/15.JPG" alt="Lounge" className="w-full h-full object-cover" />
						</div>

						{/* Right Form Section */}
						<div className="w-full md:w-1/2 p-3 md:p-6 relative flex flex-col justify-center md:h-full">
					{/* Close Button */}
						<button
							type="button"
							className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl p-2 z-50"
							onClick={closePopup}
							aria-label="Close"
						>
							&times;
						</button>

					{/* Promo banner (matches attached design) */}
					<div className="w-full mb-4">
						<div className="mx-auto w-full p-4 text-center ">
					
							<h3 className="text-sm md:text-base font-semibold text-gray-800">
								EXCLUSIVE FIRST-TIME SHOPPER PERK!
							</h3>
							<p className="text-xs text-gray-600 mt-1 mb-3">
								Subscribe now and unlock your exclusive first-time shopper discount.
							</p>
							
						</div>
					</div>

					{/* Logo */}
							

					{/* Form */}
					{step === 1 && (
						<form className="space-y-4" onSubmit={handleSendOtp}>
							<input
								type="email"
								placeholder="Email address"
								className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								required
							/>
							<button
								type="submit"
								className="w-full bg-gray-700 text-white font-semibold py-3 rounded shadow hover:bg-gray-800 transition disabled:opacity-70"
								disabled={loading}
							>
								{loading ? "Sending OTP..." : "Send OTP"}
							</button>
						</form>
					)}
					{step === 2 && (
						<form className="space-y-4" onSubmit={handleVerifyOtp}>
							<input
								type="text"
								placeholder="Enter OTP"
								className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
								value={otp}
								onChange={(event) => setOtp(event.target.value)}
								required
							/>
							<button
								type="submit"
								className="w-full bg-gray-700 text-white font-semibold py-3 rounded shadow hover:bg-gray-800 transition disabled:opacity-70"
								disabled={loading}
							>
								{loading ? "Verifying..." : "Verify OTP"}
							</button>
						</form>
					)}
					{feedback.text && (
						<p
							className={`text-center text-sm mt-4 ${feedback.isError ? "text-red-500" : "text-green-600"}`}
						>
							{feedback.text}
						</p>
					)}

					{/* Footer Note */}
					<p className="text-center text-gray-500 text-sm mt-4">
						Don’t miss out—this special offer is just for you!
					</p>
				</div>
			</div>
		</div>
	);
};

export default Popup;
