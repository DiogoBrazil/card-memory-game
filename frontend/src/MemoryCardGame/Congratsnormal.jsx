import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import background from "../assets/images/celebration.gif"; // Keep relative path for assets handled by Vite build
// Correct the path for the audio file to be absolute from the public root
import bgMusicPath from "../../public/audio/Solar2.mp3"; // Use absolute path
import congratulationImage from "../../public/images/Galaxies.jpg"; // Use absolute path

// Styled Components (remain the same)
const PixelBox = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${background})`, // This should work if background is handled by build
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  fontFamily: '"Press Start 2P", cursive',
  position: "relative",
}));

const ImageContainer = styled(Box)(() => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
  top: "-10%",
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "80%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
}));

const PixelButton = styled(Box)(({ theme }) => ({
  display: "inline-block",
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "18px",
  padding: "20px 50px",
  border: "3px solid #00d9ff",
  borderRadius: "12px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.3s, background-color 0.3s, box-shadow 0.3s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const Congtnormal = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
   const [bgVolume, setBgVolume] = useState(
    parseInt(localStorage.getItem("bgVolume"), 10) || 50 // Default to 50 if not set
  );
  const [musicStarted, setMusicStarted] = useState(false);

  // Audio setup
  useEffect(() => {
    // Initialize audio object using the correct path
    audioRef.current = new Audio(bgMusicPath); // Use the imported path
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = bgVolume / 100;

    // Autoplay logic (requires user interaction first)
    const handleClick = () => {
      if (!musicStarted) {
        audio.play().catch((error) =>
          console.error("Background music playback failed:", error)
        );
        setMusicStarted(true);
        document.removeEventListener("click", handleClick); // Remove listener after first play
      }
    };

    document.addEventListener("click", handleClick, { once: true }); // Listen for first click anywhere

    return () => {
      // Cleanup
      if (audio) {
          audio.pause();
          audio.currentTime = 0;
      }
      document.removeEventListener("click", handleClick); // Ensure listener is removed on unmount
    };
  }, [bgVolume, musicStarted, bgMusicPath]); // Add bgMusicPath to dependencies


  // Listen to volume changes in localStorage
  useEffect(() => {
     const handleStorageChange = (event) => {
       if (event.key === 'bgVolume') {
            const newVolume = parseInt(event.newValue, 10) || 0;
            setBgVolume(newVolume);
            if (audioRef.current) {
                audioRef.current.volume = newVolume / 100;
            }
       }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const gameCompleted = localStorage.getItem("gameCompleted");
    if (gameCompleted !== "true") { // Strict check for "true"
      console.log("Game not completed according to localStorage, redirecting.");
      navigate("/play"); // Navigate to play if not completed
    }
  }, [navigate]);

  // Handlers for navigation buttons
  const handlePlayAgain = () => {
    navigate("/medium"); // Navigate to the medium game
  };

  const handleExit = () => {
    localStorage.removeItem("gameCompleted"); // Clear the flag on exit
    navigate("/play"); // Navigate back to the play menu
  };

  return (
    <PixelBox>
      <ImageContainer>
        <img
           src={congratulationImage} // Use absolute path
           alt="Congratulations"
           style={{
            maxWidth: "80%", 
            height: "auto", // Maintain aspect ratio
            maxHeight: '70vh', // Limit height
          }}
        />
      </ImageContainer>

      <ButtonContainer>
        <PixelButton onClick={handlePlayAgain}>Yes</PixelButton>
        <PixelButton onClick={handleExit}>No</PixelButton>
      </ButtonContainer>
    </PixelBox>
  );
};

export default Congtnormal;