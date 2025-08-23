// Sound effects for swipe actions
export const playEngineRevSound = () => {
  try {
    const audio = new Audio('/enginerevmp3_8pePh9yy.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore errors if audio fails
  } catch (error) {
    console.log('Audio not supported');
  }
};

export const playHonkSound = () => {
  try {
    const audio = new Audio('/carhonkmp3_pGq2VkKH.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {}); // Ignore errors if audio fails
  } catch (error) {
    console.log('Audio not supported');
  }
};