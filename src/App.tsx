import React, { useState } from 'react';
import { useEffect } from 'react';
import { Heart, X, MessageCircle, Settings, Crown, Zap, Fuel, Calendar, MapPin, Star, Send, ArrowLeft } from 'lucide-react';
import { supabase, UserMatch, ChatMessage } from './lib/supabase';
import AuthScreen from './components/AuthScreen';
import { generateVehicleResponse } from './utils/chatbot';
import { playEngineRevSound, playHonkSound } from './utils/soundEffects';

interface Vehicle {
  id: number;
  name: string;
  type: string;
  age: number;
  mileage: string;
  location: string;
  bio: string;
  images: string[];
  interests: string[];
  lookingFor: string;
  dealBreakers: string[];
  isPremium: boolean;
}

interface Match {
  id: number;
  vehicle: Vehicle;
  lastMessage: string;
  timestamp: string;
}

const vehicles: Vehicle[] = [
  {
    id: 1,
    name: "Baleno",
    type: "Ferrari 488",
    age: 3,
    mileage: "12,000 KM",
    location: "Beverly Hills, CA",
    bio: "You can see a lot like me, but no one’s as cool as me. Topper of JEE Mileage Exam. Papa says i’m the pride of the family. Good with number (kmpl), bad with safety (I break faster than hearts in DTU). Looking for someone who likes stability, not airbags.",
    images: ["https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg"],
    interests: ["Speed", "Luxury", "Italian Cuisine", "Valet Parking"],
    lookingFor: "Premium fuel only, garage space, someone who appreciates Italian engineering",
    dealBreakers: ["Diesel engines", "Pickup trucks", "Anyone over 100k miles"],
    isPremium: true
  },
  {
    id: 2,
    name: "Chuck Reliable",
    type: "Honda Civic",
    age: 8,
    mileage: "156,000 miles",
    location: "Suburban Anywhere, USA",
    bio: "Honest, reliable, and fuel-efficient! 🚗 I may not be the flashiest, but I'll never let you down. Great with kids (car seats), love road trips, and I come with a spotless maintenance record!",
    images: ["https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg"],
    interests: ["Long-term relationships", "Family trips", "Fuel efficiency", "Regular maintenance"],
    lookingFor: "Someone stable, good with parallel parking, appreciates reliability over flash",
    dealBreakers: ["Racing", "Off-roading", "Neglecting oil changes"],
    isPremium: false
  },
  {
    id: 3,
    name: "Captain Wanderlust",
    type: "Boeing 737",
    age: 12,
    mileage: "2.5 million air miles",
    location: "Always traveling ✈️",
    bio: "World traveler seeking co-pilot for life's adventures! I'm always on the move but looking to settle down in the right hangar. Love sunrises at 30,000 feet and romantic layovers in Paris.",
    images: ["https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg"],
    interests: ["Travel", "International cuisine", "Weather patterns", "Aviation museums"],
    lookingFor: "Someone who loves adventure, doesn't mind long-distance, appreciates jet fuel",
    dealBreakers: ["Fear of flying", "Ground transportation only", "Helicopter types"],
    isPremium: true
  },
  {
    id: 4,
    name: "Eco Emma",
    type: "Tesla Model 3",
    age: 2,
    mileage: "28,000 miles",
    location: "Portland, OR",
    bio: "Saving the planet one mile at a time! 🌱 Zero emissions, maximum vibes. I love silent mornings, solar charging, and judging gas guzzlers at traffic lights. Autopilot certified!",
    images: ["https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg"],
    interests: ["Sustainability", "Tech", "Yoga retreats", "Solar panels"],
    lookingFor: "Carbon-neutral lifestyle, someone who cares about the environment",
    dealBreakers: ["Gas engines", "Diesel", "Coal rollers", "Littering"],
    isPremium: true
  },
  {
    id: 5,
    name: "Big Mike",
    type: "Ford F-150",
    age: 6,
    mileage: "78,000 miles",
    location: "Texas, USA",
    bio: "Built tough and ready for anything! 💪 Whether it's hauling your furniture or towing your boat, I'm your guy. Love country music, muddy trails, and honest work. Family-oriented and loyal.",
    images: ["https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg"],
    interests: ["Outdoor adventures", "Country music", "BBQ", "Honest work"],
    lookingFor: "Down-to-earth companion, someone who appreciates hard work",
    dealBreakers: ["City-only driving", "Afraid of dirt", "Hybrid attitudes"],
    isPremium: false
  }
];

function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'swipe' | 'matches' | 'profile' | 'premium' | 'chat'>('swipe');
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [userMatches, setUserMatches] = useState<UserMatch[]>([]);
  const [activeChat, setActiveChat] = useState<UserMatch | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(true); // Default to offline mode for better UX
  const [allChatMessages, setAllChatMessages] = useState<{[key: string]: ChatMessage[]}>({});
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Always start in offline mode for demo purposes
        console.log('Starting in offline mode for better demo experience');
        setIsOfflineMode(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsOfflineMode(true);
      }
    };

    checkAuth();

    // Skip Supabase auth listener in offline mode
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadUserMatches = async (userId: string) => {
    if (isOfflineMode) return;
    try {
      const { data, error } = await supabase
        .from('user_matches')
        .select('*')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });

      if (data && !error) {
        console.log('Loaded matches:', data);
        setUserMatches(data);
      } else {
        console.error('Error loading matches:', error);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const loadChatMessages = async (matchId: string) => {
    if (isOfflineMode) return;
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        id,
        message,
        is_from_user,
        created_at
      `)
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (data && !error) {
      setChatMessages(data);
    }
  };

  const handleAuthSuccess = () => {
    console.log('Auth success triggered');
    setIsAuthenticated(true);
  };

  const currentVehicle = vehicles[currentVehicleIndex];

  const handleScreenChange = (screen: 'swipe' | 'matches' | 'profile' | 'premium' | 'chat') => {
    setIsTransitioning(true);
    if (screen !== 'swipe') {
      setSelectedVehicle(null); // Close vehicle profile when changing screens
    }
    setTimeout(() => {
      setCurrentScreen(screen);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  const openVehicleProfile = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const closeVehicleProfile = () => {
    setSelectedVehicle(null);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    // Play sound effects
    if (direction === 'right') {
      playEngineRevSound(); // Engine rev for likes
    } else {
      playHonkSound(); // Honk for passes
    }
    
    if (direction === 'right' && Math.random() > 0.7) {
      setShowMatch(true);
      
      // Create match with proper structure
      const newMatch = {
        id: `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user_id: user?.id || 'demo-user',
        vehicle_id: currentVehicle.id,
        vehicle_name: currentVehicle.name,
        vehicle_type: currentVehicle.type,
        vehicle_image: currentVehicle.images[0],
        last_message: `Hey there! Thanks for swiping right on me! 😊`,
        last_message_at: new Date().toISOString(),
        matched_at: new Date().toISOString()
      };
      
      console.log('Adding new match:', newMatch);
      setUserMatches(prev => {
        // Check if match already exists to avoid duplicates
        const exists = prev.find(m => m.vehicle_id === newMatch.vehicle_id);
        if (exists) {
          console.log('Match already exists, skipping');
          return prev;
        }
        const updated = [newMatch, ...prev];
        console.log('Updated matches:', updated);
        return updated;
      });
    }
    
    setTimeout(() => {
      setCurrentVehicleIndex((prev) => (prev + 1) % vehicles.length);
      setShowMatch(false);
    }, 300);
  };

  const openChat = async (match: UserMatch) => {
    setActiveChat(match);
    // Load chat messages specific to this match from global storage
    const matchMessages = allChatMessages[match.id] || [];
    setChatMessages(matchMessages);
    handleScreenChange('chat');
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    
    setSendingMessage(true);
    const messageText = newMessage;
    setNewMessage('');
    
    // Always use local mode for demo
    const userMessage = {
      id: `user-${Date.now()}`,
      match_id: activeChat.id,
      user_id: 'demo-user',
      message: messageText,
      is_from_user: true,
      created_at: new Date().toISOString()
    };
    
    setAllChatMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), userMessage]
    }));
    setChatMessages(prev => [...prev, userMessage]);
    // Add message to current chat and global storage
    // Generate bot response after delay
    setTimeout(() => {
      const vehicleResponse = generateVehicleResponse(
        messageText, 
        activeChat.vehicle_name, 
        activeChat.vehicle_type
      );
      
      const botMessage = {
        id: `bot-${Date.now()}`,
        match_id: activeChat.id,
        user_id: 'demo-user',
        message: vehicleResponse,
        is_from_user: false,
        created_at: new Date().toISOString()
      };
      
      // Add bot message to current chat and global storage
      setChatMessages(prev => [...prev, botMessage]);
      setAllChatMessages(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), botMessage]
      }));
      
      // Update local matches state
      setUserMatches(prev => prev.map(match => 
        match.id === activeChat.id 
          ? { ...match, last_message: vehicleResponse, last_message_at: new Date().toISOString() }
          : match
      ));
      setSendingMessage(false);
    }, 1500 + Math.random() * 2000);
  };

  const handleLogout = async () => {
    try {
      // Reset everything for demo mode
      setIsAuthenticated(false);
      setUser(null);
      setUserMatches([]);
      setUserProfile(null);
      setChatMessages([]);
      setActiveChat(null);
      setCurrentScreen('swipe');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfilePicture = async (avatarUrl: string) => {
    if (!user || !userProfile || isOfflineMode) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', user.id);

      if (!error) {
        setUserProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} isOfflineMode={isOfflineMode} />;
  }

  const TransitionScreen = () => (
    <div className="fixed inset-0 flex items-center justify-center z-40 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, #F8B6C7 100%)' }}>
      <div className="text-center text-white">
        <div className="animate-spin mb-4">
          <Heart className="w-16 h-16 mx-auto" style={{ color: '#C24264' }} />
        </div>
        <h2 className="text-2xl font-bold animate-pulse" style={{ color: '#C24264' }}>DriveMeCrazy</h2>
        <p className="text-sm opacity-75 mt-2" style={{ color: '#C24264' }}>Shifting gears...</p>
      </div>
    </div>
  );

  const VehicleProfileScreen = ({ vehicle }: { vehicle: Vehicle }) => {
    const getVehicleQuirks = (vehicle: Vehicle) => {
      const quirks = {
        1: [ // Sophia Sportster - Ferrari
          "Only drinks premium fuel (anything less is peasant juice)",
          "Requires valet parking - self-parking is beneath me",
          "Gets jealous when you look at other cars",
          "Has a personal mechanic named Giuseppe",
          "Refuses to drive in the rain (it ruins my blowout)",
          "Only listens to Italian opera while driving"
        ],
        2: [ // Chuck Reliable - Honda Civic
          "Has never missed an oil change appointment",
          "Keeps a detailed maintenance log in the glove compartment",
          "Gets excited about gas station loyalty programs",
          "Knows every Jiffy Lube employee by name",
          "Has a 'My other car is also a Honda' bumper sticker",
          "Celebrates every 10,000 mile milestone with a car wash"
        ],
        3: [ // Captain Wanderlust - Boeing 737
          "Has frequent flyer miles with every airline",
          "Speaks 12 languages (mostly aviation codes)",
          "Gets homesick for the sky when grounded too long",
          "Has a collection of airport snow globes",
          "Dreams in flight patterns",
          "Once dated a helicopter but it didn't work out (commitment issues)"
        ],
        4: [ // Eco Emma - Tesla
          "Judges gas cars at traffic lights",
          "Has a solar panel collection hobby",
          "Meditates while charging",
          "Only dates other electric vehicles (gas is a dealbreaker)",
          "Has a compost bin in the trunk",
          "Knows the carbon footprint of everything"
        ],
        5: [ // Big Mike - Ford F-150
          "Has a toolbox that's more organized than most people's homes",
          "Can tow literally anything (including your emotional baggage)",
          "Knows every country song by heart",
          "Has mud flaps with naked lady silhouettes",
          "Considers a car wash a spa day",
          "Has a cooler full of beer in the bed (for after work, of course)"
        ]
      };
      return quirks[vehicle.id] || [];
    };

    const getVehicleStats = (vehicle: Vehicle) => {
      const stats = {
        1: { topSpeed: "211 mph", acceleration: "0-60 in 3.0s", fuelType: "Premium Only", maintenance: "$$$$$" },
        2: { topSpeed: "127 mph", acceleration: "0-60 in 8.2s", fuelType: "Regular (like me!)", maintenance: "$" },
        3: { topSpeed: "544 mph", acceleration: "0-30,000ft in 8 min", fuelType: "Jet Fuel", maintenance: "NASA Level" },
        4: { topSpeed: "162 mph", acceleration: "0-60 in 3.1s", fuelType: "Electricity ⚡", maintenance: "$$" },
        5: { topSpeed: "107 mph", acceleration: "0-60 in 6.1s", fuelType: "Regular/Diesel", maintenance: "$$" }
      };
      return stats[vehicle.id] || {};
    };

    const quirks = getVehicleQuirks(vehicle);
    const stats = getVehicleStats(vehicle);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header Image */}
          <div className="relative">
            <img 
              src={vehicle.images[0]} 
              alt={vehicle.name}
              className="w-full h-64 object-cover rounded-t-2xl"
            />
            <button 
              onClick={closeVehicleProfile}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {vehicle.isPremium && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                PREMIUM
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Basic Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{vehicle.name}</h1>
                <span className="text-lg text-gray-500">{vehicle.age} years old</span>
              </div>
              <p className="text-xl text-gray-600 mb-3">{vehicle.type}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Fuel className="w-4 h-4 mr-1" />
                {vehicle.mileage}
                <MapPin className="w-4 h-4 ml-4 mr-1" />
                {vehicle.location}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{vehicle.bio}</p>
            </div>

            {/* Stats */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Vital Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Top Speed</p>
                  <p className="font-bold text-gray-800">{stats.topSpeed}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Acceleration</p>
                  <p className="font-bold text-gray-800">{stats.acceleration}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-bold text-gray-800">{stats.fuelType}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Maintenance Cost</p>
                  <p className="font-bold text-gray-800">{stats.maintenance}</p>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">My Interests</h2>
              <div className="flex flex-wrap gap-2">
                {vehicle.interests.map((interest, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Looking For */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">What I'm Looking For</h2>
              <p className="text-gray-700">{vehicle.lookingFor}</p>
            </div>

            {/* Deal Breakers */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Deal Breakers</h2>
              <ul className="space-y-1">
                {vehicle.dealBreakers.map((dealBreaker, index) => (
                  <li key={index} className="flex items-center text-red-600">
                    <X className="w-4 h-4 mr-2" />
                    {dealBreaker}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quirky Details */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Fun Facts About Me</h2>
              <ul className="space-y-2">
                {quirks.map((quirk, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-pink-500 mr-2">•</span>
                    {quirk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  closeVehicleProfile();
                  handleSwipe('left');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5 mr-2" />
                Pass
              </button>
              <button 
                onClick={() => {
                  closeVehicleProfile();
                  handleSwipe('right');
                }}
                className="flex-1 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center" style={{ backgroundColor: '#C24264' }}
              >
                <Heart className="w-5 h-5 mr-2" />
                Like
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SwipeScreen = () => (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: '#F8B6C7' }}>
      <div className="w-full max-w-sm">
        <div 
          className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
          onClick={() => openVehicleProfile(currentVehicle)}
        >
          <div className="relative">
            <img 
              src={currentVehicle.images[0]} 
              alt={currentVehicle.name}
              className="w-full h-80 object-cover"
            />
            {currentVehicle.isPremium && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                PREMIUM
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{currentVehicle.name}</h2>
              <span className="text-sm text-gray-500">{currentVehicle.age} years old</span>
            </div>
            
            <p className="text-lg text-gray-600 mb-2">{currentVehicle.type}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Fuel className="w-4 h-4 mr-1" />
              {currentVehicle.mileage}
              <MapPin className="w-4 h-4 ml-4 mr-1" />
              {currentVehicle.location}
            </div>
            
            <p className="text-gray-700 mb-4 line-clamp-3">{currentVehicle.bio}</p>
            
            <div className="flex flex-wrap gap-2">
              {currentVehicle.interests.slice(0, 3).map((interest, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-6">
          <button 
            onClick={() => handleSwipe('left')}
            className="bg-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          <button 
            onClick={() => handleSwipe('right')}
            className="p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200" style={{ backgroundColor: '#C24264' }}
          >
            <Heart className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
      
       {selectedVehicle && <VehicleProfileScreen vehicle={selectedVehicle} />}

      {showMatch && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-pulse" style={{ backgroundColor: '#C24264' }}>
          <div className="text-center text-white p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold mb-4">IT'S A MATCH!</h2>
            <p className="text-xl mb-6">You and {currentVehicle.name} have both swiped right!</p>
            <button 
              onClick={() => setShowMatch(false)}
              className="bg-white px-8 py-3 rounded-full font-bold transition-colors" style={{ color: '#C24264' }}
            >
              Keep Swiping
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const MatchesScreen = () => (
    <div className={`min-h-screen p-4 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: '#F8B6C7' }}>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Your Matches</h1>
        
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">Total matches: {userMatches.length}</p>
        </div>
        
        {userMatches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-500 mb-4">
              No matches yet. Keep swiping!
            </p>
            <button 
              onClick={() => handleScreenChange('swipe')}
              className="text-white px-6 py-2 rounded-full transition-colors" style={{ backgroundColor: '#C24264' }}
            >
              Start Swiping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userMatches.map((match) => (
              <div 
                key={match.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openChat(match)}
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={match.vehicle_image || vehicles.find(v => v.id === match.vehicle_id)?.images[0]} 
                    alt={match.vehicle_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-800">{match.vehicle_name}</h3>
                      {vehicles.find(v => v.id === match.vehicle_id)?.isPremium && (
                        <Crown className="w-4 h-4 text-yellow-500 ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{match.last_message}</p>
                    <p className="text-xs text-gray-400">
                      {match.last_message_at ? new Date(match.last_message_at).toLocaleString() : 'Just now'}
                    </p>
                  </div>
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ChatScreen = () => {
    if (!activeChat) return null;
    
    const vehicle = vehicles.find(v => v.id === activeChat.vehicle_id);
    
    return (
      <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: '#FFECF1' }}>
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-4">
          <button 
            onClick={() => handleScreenChange('matches')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <img 
            src={activeChat.vehicle_image || vehicle?.images[0]} 
            alt={activeChat.vehicle_name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <h2 className="font-semibold text-gray-800">{activeChat.vehicle_name}</h2>
              {vehicle?.isPremium && (
                <Crown className="w-4 h-4 text-yellow-500 ml-2" />
              )}
            </div>
            <p className="text-sm text-gray-500">{activeChat.vehicle_type}</p>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {chatMessages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.is_from_user ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.is_from_user 
                  ? 'text-white' 
                  : 'bg-white text-gray-800 shadow-sm'
              }`} style={message.is_from_user ? { backgroundColor: '#C24264' } : {}}>
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.is_from_user ? 'text-pink-100' : 'text-gray-500'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <input
             key="chat-input"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              disabled={sendingMessage}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
             autoFocus
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sendingMessage}
              className="text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center" style={{ backgroundColor: '#C24264' }}
            >
              {sendingMessage ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PremiumScreen = () => (
    <div className={`min-h-screen p-4 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: '#C24264' }}>
      <div className="max-w-md mx-auto text-white">
        <div className="text-center mb-8">
          <Crown className="w-16 h-16 mx-auto mb-4" />
          {/* Logo */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/IMG_6402.PNG" 
              alt="DriveMeCrazy Logo" 
              className="w-21 h-21 object-contain"
            />
          </div>
          </div>
          <p className="text-xl opacity-90">Turbo-charge your love life!</p>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <h2 class="text-4xl font-bold mb-4 text-center">Premium Benefits</h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <Zap className="w-5 h-5 mr-3" />
              Unlimited right swipes (because running out of love is tragic)
            </li>
            <li className="flex items-center">
              <Star className="w-5 h-5 mr-3" />
              See who liked you (spoiler: mostly old cars)
            </li>
            <li className="flex items-center">
              <Crown className="w-5 h-5 mr-3" />
              Premium badge to attract gold-digger vehicles
            </li>
            <li className="flex items-center">
              <Fuel className="w-5 h-5 mr-3" />
              Free monthly car wash credits (for your profile photos)
            </li>
            <li className="flex items-center">
              <Heart className="w-5 h-5 mr-3" />
              Priority parking in all dating app servers
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-white py-4 px-6 rounded-xl font-bold text-lg transition-colors" style={{ color: '#C24264' }}>
            Turbo Boost - ₹149/month
          </button>
          <button className="w-full bg-white/20 backdrop-blur-md py-4 px-6 rounded-xl font-bold hover:bg-white/30 transition-colors">
            Premium Plus (with roadside assistance) - ₹299/month
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm opacity-75">
            Warning: Premium features may cause excessive confidence in older vehicles
          </p>
        </div>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className={`min-h-screen p-4 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: '#F8B6C7' }}>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Your Profile</h1>
        
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <img 
                src={userProfile?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4" style={{ borderColor: '#C24264' }}
              />
              <button 
                onClick={() => {
                  const avatars = [
                    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
                    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
                    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
                    'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg',
                    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
                  ];
                  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
                  updateProfilePicture(randomAvatar);
                }}
                className="absolute -bottom-2 -right-2 text-white p-2 rounded-full transition-colors" style={{ backgroundColor: '#C24264' }}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Shivam Rohatgi</h2>
            <p className="text-gray-600">demo@drivemecrazy.com</p>
            <p className="text-sm text-gray-500 mt-2">Looking for my automotive soulmate! 🚗💕</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Success Stories</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="flex">
                <img src="https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg" alt="Ferrari" className="w-12 h-12 rounded-full object-cover border-2 border-pink-300" />
                <img src="https://images.pexels.com/photos/638479/pexels-photo-638479.jpeg" alt="Lamborghini" className="w-12 h-12 rounded-full object-cover border-2 border-pink-300 -ml-4" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold">Sophia & Lorenzo</h3>
                <p className="text-sm text-gray-600">Italian Supercars</p>
              </div>
            </div>
            <p className="text-gray-700 italic">"We met on DriveMeCrazy and it was love at first sight! Now we race together through the Italian countryside every weekend. Thanks DriveMeCrazy!" 🏎️❤️</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="flex">
                <img src="https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg" alt="Honda" className="w-12 h-12 rounded-full object-cover border-2 border-blue-300" />
                <img src="https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg" alt="Toyota" className="w-12 h-12 rounded-full object-cover border-2 border-blue-300 -ml-4" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold">Chuck & Reliable Rita</h3>
                <p className="text-sm text-gray-600">Practical Partners</p>
              </div>
            </div>
            <p className="text-gray-700 italic">"Two reliable cars finding reliable love! We've been together for 50,000 miles and counting. Our relationship is like our maintenance records - spotless!" 🚗💙</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="flex">
                <img src="https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg" alt="Plane" className="w-12 h-12 rounded-full object-cover border-2 border-blue-300" />
                <img src="https://images.pexels.com/photos/163998/helicopter-aircraft-airplane-plane-163998.jpeg" alt="Helicopter" className="w-12 h-12 rounded-full object-cover border-2 border-blue-300 -ml-4" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold">Captain & Storm</h3>
                <p className="text-sm text-gray-600">Aviation Romance</p>
              </div>
            </div>
            <p className="text-gray-700 italic">"Long distance was tough, but we made it work! Now we share the same hangar and take romantic sunset flights together. Love really can make you soar!" ✈️🚁💕</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Download DriveMeCrazy Today!</h2>
          <p className="text-gray-600 mb-6">Join millions of vehicles finding love, one swipe at a time.</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-[#C24264] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#C24264] transition-colors">
               App Store
            </button>
            <button className="bg-[#C24264] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#C24264] transition-colors">
               Google Play
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center" style={{ backgroundColor: '#C24264' }}
            >
              <span className="mr-2">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {isTransitioning && <TransitionScreen />}
      
      {currentScreen === 'swipe' && <SwipeScreen />}
      {currentScreen === 'matches' && <MatchesScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      {currentScreen === 'premium' && <PremiumScreen />}
      {currentScreen === 'chat' && <ChatScreen />}
      
      {currentScreen !== 'chat' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around max-w-md mx-auto">
            <button 
              onClick={() => handleScreenChange('swipe')}
             className={`p-3 rounded-full transition-colors ${currentScreen === 'swipe' ? 'text-white' : 'text-gray-400'}`} style={currentScreen === 'swipe' ? { backgroundColor: '#C24264' } : {}}
            >
              <Heart className="w-6 h-6" />
            </button>
            <button 
              onClick={() => handleScreenChange('matches')}
             className={`p-3 rounded-full transition-colors ${currentScreen === 'matches' ? 'text-white' : 'text-gray-400'}`} style={currentScreen === 'matches' ? { backgroundColor: '#C24264' } : {}}
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button 
              onClick={() => handleScreenChange('profile')}
             className={`p-3 rounded-full transition-colors ${currentScreen === 'profile' ? 'text-white' : 'text-gray-400'}`} style={currentScreen === 'profile' ? { backgroundColor: '#C24264' } : {}}
            >
              <Star className="w-6 h-6" />
            </button>
            <button 
              onClick={() => handleScreenChange('premium')}
             className={`p-3 rounded-full transition-colors ${currentScreen === 'premium' ? 'text-white' : 'text-gray-400'}`} style={currentScreen === 'premium' ? { backgroundColor: '#C24264' } : {}}
            >
              <Crown className="w-6 h-6" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default App;