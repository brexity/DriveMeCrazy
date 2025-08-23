import React, { useState } from 'react';
import { Car, Heart, Zap, Users, Crown, Check } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (user: { id: string; email: string; username: string }) => void;
  isOfflineMode: boolean;
}

export default function AuthScreen({ onAuthSuccess, isOfflineMode }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email: email || 'demo@drivemecrazy.com',
        username: username || email.split('@')[0] || 'demo_user'
      };
      
      onAuthSuccess(user);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8B6C7' }}>
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/IMG_6399.PNG" 
              alt="DriveMeCrazy Logo" 
              className="w-30 h-30 object-contain"
            />
          </div>
          </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isLogin
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`} style={isLogin ? { backgroundColor: '#C24264' } : {}}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ml-2 ${
                !isLogin
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`} style={!isLogin ? { backgroundColor: '#C24264' } : {}}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Choose a username"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#C24264' }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          {isOfflineMode && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                🔄 Demo Mode - Any email/password works!
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: '#C24264' }} />
            <p className="text-sm font-medium" style={{ color: '#C24264' }}>Instant Matches</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#C24264' }} />
            <p className="text-sm font-medium" style={{ color: '#C24264' }}>Active Community</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-6 h-6 mr-2" style={{ color: '#C24264' }} />
            <h3 className="font-bold text-lg" style={{ color: '#C24264' }}>Premium Plans</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between" style={{ color: '#C24264' }}>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2" style={{ color: '#C24264' }} />
                <span className="text-sm">Basic Plan</span>
              </div>
              <span className="font-bold">₹149/mo</span>
            </div>
            
            <div className="flex items-center justify-between" style={{ color: '#C24264' }}>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2" style={{ color: '#C24264' }} />
                <span className="text-sm">Premium Plan</span>
              </div>
              <span className="font-bold">₹299/mo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}