"use client";
import { useState } from 'react';

const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Thank you for your inquiry! We will contact you soon.');
        setFormData({ fullName: '', phoneNumber: '', email: '', message: '' });
      } else {
        setError('Failed to send your inquiry. Please try again later.');
      }
    } catch (err) {
      setError('Failed to send your inquiry. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      aria-label="Get A Free Consultation Form" 
      className="relative z-10 bg-white rounded-3xl p-8 mt-12 lg:mt-0 lg:ml-16 w-full max-w-md shadow-lg border border-gray-200"
    >
      <h2 className="text-center text-lg mb-6 font-serif text-black">
        Get A Free Consultation!
      </h2>
      <input 
        name="fullName"
        value={formData.fullName}
        onChange={handleInputChange}
        className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-300 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f3d7a]" 
        placeholder="Full Name" 
        type="text"
        required
      />
      <input 
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-300 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f3d7a]" 
        placeholder="Phone Number" 
        type="tel"
        required
      />
      <input 
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-300 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f3d7a]" 
        placeholder="Official Email" 
        type="email"
        required
      />
      <textarea 
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        className="w-full mb-6 px-4 py-3 rounded-xl border border-gray-300 text-gray-600 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#0f3d7a]" 
        placeholder="Your Message" 
        rows="4"
      />
      <button 
        className="w-full bg-[#AA7C4D]  text-white font-bold py-3 rounded-full  transition-colors disabled:opacity-60" 
        type="submit"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Get A Quote'}
      </button>
      {success && <p className="text-green-600 text-center mt-4">{success}</p>}
      {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    </form>
  );
};

export default ConsultationForm;
