import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-market-pattern opacity-40"></div>

      <div className="flex flex-col md:flex-row items-center justify-center max-w-4xl w-full mx-5 bg-black/60 shadow-lg p-8 rounded-lg backdrop-blur-lg">
        <div className="flex-1 text-white p-5">
          <h1 className="text-4xl font-bold tracking-wide">
            Welcome to
            <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text"> StockMarketX</span>
          </h1>
          <p className="text-sm mt-3 text-gray-300">Sign up now and start your journey in stock analysis.</p>
        </div>

        <div className="flex-1 bg-white/10 p-8 rounded-md shadow-md">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} className="bg-gray-900 text-white border-none" />
            <TextInput type="email" placeholder="Email" id="email" onChange={handleChange} className="bg-gray-900 text-white border-none" />
            <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} className="bg-gray-900 text-white border-none" />
            <Button gradientDuoTone="greenToBlue" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Sign Up'}
            </Button>
            <OAuth />
          </form>
          <div className="text-gray-300 text-sm mt-5">Already have an account? <Link to="/sign-in" className="text-green-400 hover:underline">Sign In</Link></div>
        </div>
      </div>
    </div>
  );
}
