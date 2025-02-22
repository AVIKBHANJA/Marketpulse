import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full bg-market-pattern opacity-40"></div>

      <div className="flex flex-col md:flex-row items-center justify-center max-w-4xl w-full mx-5 bg-black/60 shadow-lg p-8 rounded-lg backdrop-blur-lg">
        {/* Left Side */}
        <div className="flex-1 text-white p-5">
          <h1 className="text-4xl font-bold tracking-wide">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
              StockMarketX
            </span>
          </h1>
          <p className="text-sm mt-3 text-gray-300">
            Analyze markets, track trends, and stay ahead. Sign in now to get real-time insights.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1 bg-white/10 p-8 rounded-md shadow-md">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label className="text-gray-300" value="Your email" />
              <TextInput
                type="email"
                placeholder="name@finance.com"
                id="email"
                onChange={handleChange}
                className="bg-gray-900 text-white border-none focus:ring-green-400"
              />
            </div>
            <div>
              <Label className="text-gray-300" value="Your password" />
              <TextInput
                type="password"
                placeholder=""
                id="password"
                onChange={handleChange}
                className="bg-gray-900 text-white border-none focus:ring-green-400"
              />
            </div>
            <Button gradientDuoTone="greenToBlue" type="submit" disabled={loading} className="hover:scale-105 transition">
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>

          <div className="flex gap-2 text-sm mt-5 text-gray-300">
            <span>Don’t have an account?</span>
            <Link to="/sign-up" className="text-green-400 hover:underline">
              Sign Up
            </Link>
          </div>
          
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
