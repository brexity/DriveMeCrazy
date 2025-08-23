// Humorous chatbot responses for vehicles
export const generateVehicleResponse = (userMessage: string, vehicleName: string, vehicleType: string): string => {
  const message = userMessage.toLowerCase();
  
  // Greeting responses
  if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
    const greetings = [
      `Hey there! ${vehicleName} here, ready to take you for a ride! 🚗💨`,
      `Hello gorgeous! Just thinking about you makes my engine purr! 😍`,
      `Hi! I've been waiting here for someone just like you! ⛽`,
      `Hey! Want to see my trunk? It's surprisingly spacious! 😉`,
      `Greetings! I promise I'm not a lemon - I'm more like fine wine on wheels! 🍷`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Compliment responses
  if (message.includes('beautiful') || message.includes('gorgeous') || message.includes('hot') || message.includes('sexy')) {
    const complimentResponses = [
      `Wow, you're making my headlights blush! 💡✨`,
      `You really know how to rev an engine! My RPMs are through the roof! 📈`,
      `Stop it, you're making me overheat! Good thing I have excellent cooling! 🌡️`,
      `You're like premium fuel for my engine! High octane romance! ⛽💕`,
      `My paint job is nothing compared to your shine! ✨`
    ];
    return complimentResponses[Math.floor(Math.random() * complimentResponses.length)];
  }

  // Date/meetup responses
  if (message.includes('date') || message.includes('meet') || message.includes('drive') || message.includes('ride')) {
    const dateResponses = [
      `I'd love to! I know this beautiful route with the most romantic gas stations! 🌅⛽`,
      `Yes! Let's cruise into the sunset together! I promise smooth handling! 🌅`,
      `I'm always up for adventure! My GPS is already planning the perfect route! 🗺️`,
      `Count me in! I've got a full tank and nowhere to go but with you! ⛽💕`,
      `Let's hit the road! I promise I won't break down... much! 😅`
    ];
    return dateResponses[Math.floor(Math.random() * dateResponses.length)];
  }

  // Question about specs/features
  if (message.includes('engine') || message.includes('horsepower') || message.includes('speed') || message.includes('fuel')) {
    const specResponses = [
      `I've got all the horsepower you need and more! Want to feel my torque? 💪`,
      `My engine purrs like a kitten but roars like a lion! Best of both worlds! 🦁`,
      `I'm fuel efficient on the streets but... well, never mind! 😏⛽`,
      `My 0-60 time is impressive, but my 0-to-your-heart time is even faster! 💓`,
      `I've got more curves than a mountain highway and twice the handling! 🏔️`
    ];
    return specResponses[Math.floor(Math.random() * specResponses.length)];
  }

  // Relationship talk
  if (message.includes('love') || message.includes('relationship') || message.includes('together')) {
    const relationshipResponses = [
      `I'm looking for something long-term, not just a quick joyride! 💕`,
      `Love is like a road trip - it's about the journey, not the destination! 🛣️`,
      `I want someone who'll love me even when my check engine light comes on! ⚠️💕`,
      `Together we could be the ultimate power couple - like turbo and boost! 💨`,
      `I promise to always be your ride or die! Literally! 🚗💀`
    ];
    return relationshipResponses[Math.floor(Math.random() * relationshipResponses.length)];
  }

  // Vehicle-specific responses
  if (vehicleType.toLowerCase().includes('ferrari') || vehicleType.toLowerCase().includes('sports')) {
    const sportsCarResponses = [
      `Darling, I don't do slow. Life's too short for economy mode! 🏎️💨`,
      `I'm high maintenance, but honey, I'm worth every penny! 💎`,
      `Want to see what 200mph feels like? Buckle up, buttercup! 🏁`,
      `I only date premium - regular unleaded need not apply! ⛽👑`
    ];
    return sportsCarResponses[Math.floor(Math.random() * sportsCarResponses.length)];
  }

  if (vehicleType.toLowerCase().includes('honda') || vehicleType.toLowerCase().includes('civic')) {
    const reliableResponses = [
      `I may not be flashy, but I'll never leave you stranded! Reliability is sexy! 🔧💕`,
      `200,000 miles and still going strong! That's commitment! 💪`,
      `I'm like a good friend - always there when you need me! 🤝`,
      `Low maintenance, high value - that's the Honda way! 💰`
    ];
    return reliableResponses[Math.floor(Math.random() * reliableResponses.length)];
  }

  if (vehicleType.toLowerCase().includes('boeing') || vehicleType.toLowerCase().includes('plane')) {
    const planeResponses = [
      `Want to join the mile-high club? I've got the altitude covered! ✈️☁️`,
      `I'll take you places you've never been - literally! 🌍`,
      `My love for you is like my flight path - direct and non-stop! 💕`,
      `Turbulence? That's just my heart skipping a beat for you! 💓`
    ];
    return planeResponses[Math.floor(Math.random() * planeResponses.length)];
  }

  if (vehicleType.toLowerCase().includes('tesla') || vehicleType.toLowerCase().includes('electric')) {
    const electricResponses = [
      `I'm 100% electric and 200% into you! Zero emissions, maximum attraction! ⚡💚`,
      `Silent but deadly... in the best way! Want to experience my instant torque? 🔋`,
      `I'm saving the planet one date at a time! Eco-friendly romance! 🌱`,
      `My battery life is impressive, but my love for you is infinite! 🔋💕`
    ];
    return electricResponses[Math.floor(Math.random() * electricResponses.length)];
  }

  if (vehicleType.toLowerCase().includes('truck') || vehicleType.toLowerCase().includes('f-150')) {
    const truckResponses = [
      `I'm built tough and ready for anything! Need something hauled? I'm your truck! 💪`,
      `Country roads, take me home... with you! 🛤️🏡`,
      `I've got a big bed and I'm not afraid to use it! For cargo, of course! 😉`,
      `Mud, rain, or shine - I'll always get you there! 4WD and proud! 🌧️`
    ];
    return truckResponses[Math.floor(Math.random() * truckResponses.length)];
  }

  // Generic flirty responses
  const genericResponses = [
    `You're really revving my engine the right way! 🏎️💨`,
    `Is it hot in here or is my radiator overheating from your charm? 🌡️`,
    `You must be premium fuel because you bring out my best performance! ⛽✨`,
    `I'd drive a thousand miles just to spend five minutes with you! 🛣️💕`,
    `My GPS says I've reached my destination - your heart! 📍💓`,
    `You're like the perfect parking spot - hard to find but worth the wait! 🅿️`,
    `I'm not usually this forward, but you make my transmission shift! ⚙️`,
    `Want to see my interior? I promise it's well maintained! 😉`,
    `You're the oil to my engine - I can't function without you! 🛢️💕`,
    `I have airbags, but you take my breath away! 💨💕`
  ];

  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
};