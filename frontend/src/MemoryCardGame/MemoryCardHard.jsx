// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Box, Grid, Button, Modal, Typography } from "@mui/material";
// import { styled } from "@mui/system";
// import PropTypes from "prop-types";
// import { useSpring, animated } from "@react-spring/web";
// import background from "../assets/images/mode1.gif"; 
// import bgMusic from "../assets/audio/memory-bg.mp3"; 
// import axios from "axios";

// // Define a dificuldade específica para este componente
// const defaultDifficulty = "Hard"; // <-- ATUALIZADO AQUI

// const cardImages = [
//     { id: 1, image: "/images/earth.png" },   
//     { id: 2, image: "/images/earth.png" },   
//     { id: 3, image: "/images/jupiter.png" }, 
//     { id: 4, image: "/images/jupiter.png" }, 
//     { id: 5, image: "/images/mars.png" },    
//     { id: 6, image: "/images/mars.png" },    
//     { id: 7, image: "/images/mercury.png" }, 
//     { id: 8, image: "/images/mercury.png" }, 
//     { id: 9, image: "/images/neptune.png" }, 
//     { id: 10, image: "/images/neptune.png" },
//     { id: 11, image: "/images/saturn.png" }, 
//     { id: 12, image: "/images/saturn.png" }, 
//   ];
  

// // Audio files para o nível Hard (verifique se são os corretos)
// const matchAudioFiles = [
//   "/audio/wonderful.mp3",
//   "/audio/NiceJob.mp3",
//   "/audio/Greatwork.mp3",
//   "/audio/KeepItGoing.mp3",
//   "/audio/Amazing.mp3",
// ];

// const congratsAudio = "/audio/congrats.mp3"; // Final congratulations audio

// // Shuffle Logic
// const shuffleArray = (array) => {
//   const shuffledArray = [...array];
//   for (let i = shuffledArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//   }
//   return shuffledArray;
// };

// const saveGameData = async (gameData) => {
//   try {
//     // Recupera userID do localStorage dentro da função para garantir valor atualizado
//     const userID = localStorage.getItem("userID");
//     if (!userID) {
//       console.error("Error: userID is missing when trying to save game data.");
//       // Poderia lançar um erro ou retornar um status indicando falha
//       return;
//     }
//     const dataToSend = { ...gameData, userID }; // Adiciona userID aos dados
//     const response = await axios.post("http://localhost:5000/api/memory/save", dataToSend, {
//       headers: { "Content-Type": "application/json" },
//        // Adicionar token de autenticação se a API exigir
//        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
//     });
//     console.log("Game data saved successfully", response.data);
//   } catch (error) {
//     console.error("Error saving game data:", error.response ? error.response.data : error.message);
//   }
// };

// // Styled Components (mantidos como estavam)
// const StyledGameContainer = styled(Box)(({ theme, mouseDisabled }) => ({
//     minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
//     backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
//     position: "relative", pointerEvents: mouseDisabled ? "none" : "auto",
// }));
// const PixelButton = styled(Box)(({ theme }) => ({
//     display: "inline-block", backgroundColor: "#2c2c54", color: "#fff", fontFamily: '"Press Start 2P", cursive', fontSize: "14px",
//     padding: "15px 30px", border: "2px solid #00d9ff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//     cursor: "pointer", textAlign: "center", transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
//     "&:hover": { backgroundColor: "#40407a", borderColor: "#00aaff", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)", },
//     "&:active": { transform: "scale(0.95)", },
// }));
// const PixelBox = styled(Box)(({ theme }) => ({
//     position: "absolute", bottom: "10%", left: "1%", backgroundColor: "#ff4d4f", color: "#fff", padding: "10px 20px",
//     border: "2px solid #00d9ff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", fontFamily: '"Press Start 2P", cursive',
//     fontSize: "12px", textAlign: "center", marginBottom: "10px",
// }));
// const PixelTimerBox = styled(Box)(({ theme }) => ({
//     position: "absolute", bottom: "5%", left: "1%", backgroundColor: "#2c2c54", color: "#fff", padding: "10px 20px",
//     border: "2px solid #00d9ff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", fontFamily: '"Press Start 2P", cursive',
//     fontSize: "12px", textAlign: "center",
// }));
// const CardContainer = styled(Box)({ perspective: "1000px", cursor: "pointer", width: "120px", height: "120px", }); // Ajuste tamanho se necessário
// const CardInner = styled(animated.div)({ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 0.6s", });
// const CardFront = styled(Box)({
//     position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backfaceVisibility: "hidden", display: "flex",
//     justifyContent: "center", alignItems: "center", borderRadius: "8px", transform: "rotateY(180deg)", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
// });
// const CardBack = styled(Box)({
//     position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backfaceVisibility: "hidden", display: "flex",
//     justifyContent: "center", alignItems: "center", backgroundColor: "#2c2c54", border: "2px solid #00aaff",
//     borderRadius: "8px", transform: "rotateY(0deg)", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
// });
// const modalStyle = {
//     position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#2c2c54',
//     border: '2px solid #00d9ff', boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", padding: '20px', textAlign: 'center', borderRadius: '10px',
// };
// const PixelTypography = styled(Typography)(({ theme }) => ({
//     fontFamily: '"Press Start 2P", cursive', fontSize: '24px', color: '#fff', letterSpacing: '1px',
//     textShadow: `-1px -1px 0 #ff0000, 1px -1px 0 #ff7f00, 1px 1px 0 #ffd700, -1px 1px 0 #ff4500`,
// }));
// const PixelButtonModal = styled(Button)(({ theme }) => ({
//     backgroundColor: "#2c2c54", color: "#fff", fontFamily: '"Press Start 2P", cursive', fontSize: "14px", padding: "15px 30px",
//     border: "2px solid #00d9ff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", cursor: "pointer", textAlign: "center",
//     transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
//     "&:hover": { backgroundColor: "#40407a", borderColor: "#00aaff", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)", },
//     "&:active": { transform: "scale(0.95)", },
// }));

// // Card Component
// const Card = ({ card, handleClick, flipped, matched }) => {
//   const { transform } = useSpring({
//     transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
//     config: { tension: 500, friction: 30 },
//   });

//   return (
//     <CardContainer onClick={handleClick}>
//       <CardInner style={{ transform }}>
//         <CardFront>
//            {/* Usando caminho relativo para assets em src */}
//           <img src={`${card.image}`} alt="Card front" style={{ width: "140%", height: "140%" }} />
//         </CardFront>
//         <CardBack>
//            {/* Usando caminho relativo para assets em src */}
//           <img src="../assets/images/Back2.png" alt="Card back" style={{ width: "140%", height: "140%" }} />
//         </CardBack>
//       </CardInner>
//     </CardContainer>
//   );
// };

// Card.propTypes = {
//   card: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     image: PropTypes.string.isRequired, // Deve ser relativo a partir de /public ou src/assets
//   }).isRequired,
//   handleClick: PropTypes.func.isRequired,
//   flipped: PropTypes.bool.isRequired,
//   matched: PropTypes.bool.isRequired,
// };

// // Renomeia o componente principal
// const MemoryCardHard = () => { // <-- RENOMEADO AQUI
//   const navigate = useNavigate();
//   const [cards, setCards] = useState([]);
//   const [flippedCards, setFlippedCards] = useState([]);
//   const [matchedCards, setMatchedCards] = useState([]);
//   const [failedAttempts, setFailedAttempts] = useState(0);
//   const [timer, setTimer] = useState(0);
//   const [timerActive, setTimerActive] = useState(false);
//   const [initialReveal, setInitialReveal] = useState(true);
//   const [musicStarted, setMusicStarted] = useState(false);
//   const [mouseDisabled, setMouseDisabled] = useState(false);
//   const [bgVolume, setBgVolume] = useState(() => parseInt(localStorage.getItem("bgVolume"), 10) || 50);
//   const [sfxVolume, setSfxVolume] = useState(() => parseInt(localStorage.getItem("sfxVolume"), 10) || 50);
//   const audioRef = useRef(null);
//   const [audioIndex, setAudioIndex] = useState(0);
//   const [openModal, setOpenModal] = useState(false);

//   const handleSaveNewGame = () => {
     
//     saveGameData({
//         gameDate: new Date(),
//         failed: failedAttempts,
//         difficulty: defaultDifficulty,
//         completed: 0, 
//         timeTaken: timer, 
//     });
//   };

//   const handleNewGame = () => {
//     setCards(shuffleArray(cardImages));
//     setMatchedCards([]);
//     setFlippedCards([]);
//     setFailedAttempts(0);
//     setTimer(0);
//     setTimerActive(false); // Garante que o timer pare
//     setInitialReveal(true);
//     setAudioIndex(0);
//     setMouseDisabled(true); // Desabilita mouse no início

//     const mouseDisableDuration = 1700; // Um pouco mais que o reveal
//     setTimeout(() => {
//       setMouseDisabled(false);
//     }, mouseDisableDuration);

//     setTimeout(() => {
//       setInitialReveal(false);
//       setTimerActive(true);
//     }, 1500); // Tempo de revelação inicial
//   };

//   const handleBackButton = () => {
//     setOpenModal(true); // Show the confirmation modal
//   };

//   const handleModalYes = () => {
//     // Salva o jogo incompleto antes de sair
//     handleSaveNewGame();
//     setOpenModal(false);
//     localStorage.removeItem("gameCompleted"); // Remove game completion flag
//     navigate("/play"); // Navigate to play
//   };

//   const handleModalNo = () => {
//     setOpenModal(false); // Close the modal and resume game
//   };

//   // Setup inicial e música
//   useEffect(() => {
//     handleNewGame(); // Inicia um novo jogo na montagem

//     const audio = audioRef.current;
//     if (audio) {
//         audio.volume = bgVolume / 100;
//     }

//     const handleFirstClick = () => {
//       if (!musicStarted && audio) {
//         audio.play().catch((error) => console.error("Audio play error:", error));
//         setMusicStarted(true);
//         document.removeEventListener("click", handleFirstClick); // Remove após o primeiro clique
//       }
//     };

//     document.addEventListener("click", handleFirstClick);

//     // Cleanup listener
//     return () => document.removeEventListener("click", handleFirstClick);

//   }, []); // Executa apenas na montagem inicial

//   // Atualiza volume da música se bgVolume mudar
//    useEffect(() => {
//         if (audioRef.current && musicStarted) {
//             audioRef.current.volume = bgVolume / 100;
//         }
//     }, [bgVolume, musicStarted]);


//   // Timer logic
//   useEffect(() => {
//     let interval = null;
//     if (timerActive) {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => prevTimer + 1);
//       }, 1000);
//     } else if (!timerActive && timer !== 0) {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval); // Cleanup interval on unmount or when timer stops
//   }, [timerActive, timer]); // Adicionado 'timer' como dependência

//   // Card matching logic
//   useEffect(() => {
//     if (flippedCards.length === 2) {
//       const [card1, card2] = flippedCards;
//       if (card1.image === card2.image) {
//         // Match
//         setMatchedCards((prev) => [...prev, card1.id, card2.id]);
//         if (audioIndex < matchAudioFiles.length) {
//            // Toca o som de match correspondente
//            const matchAudio = new Audio(`${matchAudioFiles[audioIndex]}`); // Caminho relativo
//            matchAudio.volume = sfxVolume / 100;
//            matchAudio.play();
//            setAudioIndex(prev => prev + 1); // Próximo som
//         } else {
//              // Opcional: Toca um som padrão se a lista acabar
//              const defaultMatchSound = new Audio(`${matchAudioFiles[0]}`); // Ex: toca o primeiro
//              defaultMatchSound.volume = sfxVolume / 100;
//              defaultMatchSound.play();
//         }
//         setFlippedCards([]); // Limpa imediatamente no match
//       } else {
//         // No match
//         setFailedAttempts((prev) => prev + 1);
//         // Delay before flipping back
//         setTimeout(() => {
//           setFlippedCards([]);
//         }, 1000); // Tempo para visualizar o erro
//       }
//     }
//   }, [flippedCards, audioIndex, matchAudioFiles, sfxVolume]); // Adicionado matchAudioFiles e sfxVolume

//   // Game completion logic
//   useEffect(() => {
//     // Verifica se todas as cartas foram combinadas
//     if (cards.length > 0 && matchedCards.length === cards.length) {
//         console.log("Game Completed!");
//         setTimerActive(false); // Para o timer

//         // Toca som de congratulações
//         const congrats = new Audio(`${congratsAudio}`); // Caminho relativo
//         congrats.volume = sfxVolume / 100;
//         congrats.play();

//         // Salva o jogo como completo
//          saveGameData({
//             gameDate: new Date(),
//             failed: failedAttempts,
//             difficulty: defaultDifficulty,
//             completed: 1, // Jogo completo
//             timeTaken: timer,
//         });

//         localStorage.setItem("gameCompleted", "true"); // Marca como completo no localStorage

//         // Navega para a tela de congratulações após um pequeno delay
//         setTimeout(() => navigate("/congratulations"), 1500); // Rota para congrats Hard
//     }
//   }, [matchedCards, cards, failedAttempts, timer, navigate, sfxVolume, congratsAudio]); // Inclui dependências relevantes

//   const handleCardClick = (card) => {
//     // Impede clique se mouse estiver desabilitado, carta já combinada, já virada ou se 2 já estão viradas
//     if (mouseDisabled || matchedCards.includes(card.id) || flippedCards.some(c => c.id === card.id) || flippedCards.length === 2) {
//       return;
//     }
//     setFlippedCards((prev) => [...prev, card]);
//   };

//   // Verificação de userID (opcional, mas boa prática)
//    useEffect(() => {
//     const userID = localStorage.getItem("userID");
//      if (!userID) {
//         console.error("Error: userID is missing. Redirecting to login.");
//         navigate("/login");
//      }
//    }, [navigate]);


//   return (
//     <StyledGameContainer mouseDisabled={mouseDisabled}>
//        {/* Usando caminho relativo para assets em src */}
//       <audio ref={audioRef} src={`${bgMusic}`} loop />

//       {/* Botão Voltar no Topo Esquerdo */}
//       <PixelButton onClick={handleBackButton} sx={{ position: "absolute", top: "20px", left: "20px" }}>
//         Back
//       </PixelButton>

//        {/* Timer e Contagem de Erros (posicionados como antes) */}
//       <PixelTimerBox>Timer: {timer}s</PixelTimerBox>
//       <PixelBox>Learning Moments: {failedAttempts}</PixelBox>

//       {/* Grid das Cartas */}
//       {/* Ajuste maxWidth e marginTop conforme necessário para layout Hard */}
//       <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 700, marginTop: "20px" }}>
//         {cards.map((card) => (
//           // Ajuste 'xs' para layout Hard (ex: 12 cartas -> xs=3 dá 4 por linha)
//           <Grid item xs={3} key={card.id}>
//             <Card
//               card={card}
//               handleClick={() => handleCardClick(card)}
//               flipped={initialReveal || flippedCards.some((c) => c.id === card.id) || matchedCards.includes(card.id)}
//               matched={matchedCards.includes(card.id)}
//             />
//           </Grid>
//         ))}
//       </Grid>

//       {/* Botão Novo Jogo */}
//       <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}> {/* Aumentei margem superior */}
//         <PixelButton onClick={() => { handleSaveNewGame(); handleNewGame(); }}>
//           New Game
//         </PixelButton>
//       </Box>

//       {/* Modal de Confirmação para Voltar */}
//       <Modal open={openModal} onClose={handleModalNo} aria-labelledby="modal-title">
//           <Box sx={modalStyle}>
//             <PixelTypography id="modal-title" variant="h6">
//               Are you sure you want to go back? (Game progress will be saved)
//             </PixelTypography>
//             <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
//               <PixelButtonModal onClick={handleModalYes} variant="contained" color="primary">
//                 Yes
//               </PixelButtonModal>
//               <PixelButtonModal onClick={handleModalNo} variant="contained" color="secondary">
//                 No
//               </PixelButtonModal>
//             </Box>
//           </Box>
//       </Modal>

//     </StyledGameContainer>
//   );
// };

// export default MemoryCardHard;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button, Modal, Typography } from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
// Assets importados via JS podem continuar em src/assets (ex: fundo)
import background from "../assets/images/mode1.gif";
// Importa a música de fundo de src/assets
import bgMusicPath from "../assets/audio/memory-bg.mp3";
import axios from "axios";

const defaultDifficulty = "Hard";

// Paths absolutos para assets na pasta /public
const cardImages = [
  { id: 1, image: "/images/earth.png" },
  { id: 2, image: "/images/earth.png" },
  { id: 3, image: "/images/jupiter.png" },
  { id: 4, image: "/images/jupiter.png" },
  { id: 5, image: "/images/mars.png" },
  { id: 6, image: "/images/mars.png" },
  { id: 7, image: "/images/mercury.png" },
  { id: 8, image: "/images/mercury.png" },
  { id: 9, image: "/images/neptune.png" },
  { id: 10, image: "/images/neptune.png" },
  { id: 11, image: "/images/saturn.png" },
  { id: 12, image: "/images/saturn.png" },
];

// Paths absolutos para áudios na pasta /public
const matchAudioFiles = [
  "/audio/wonderful.mp3",
  "/audio/NiceJob.mp3",
  "/audio/Greatwork.mp3",
  "/audio/KeepItGoing.mp3",
  "/audio/Amazing.mp3",
];
const congratsAudioPath = "/audio/congrats.mp3";

// --- Funções Utilitárias ---
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const saveGameData = async (gameData) => {
  try {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      console.error("Error: userID is missing when trying to save game data.");
      return;
    }
    const dataToSend = { ...gameData, userID };
    const response = await axios.post("http://localhost:5000/api/memory/save", dataToSend, {
      headers: { "Content-Type": "application/json" },
      // headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    console.log("Game data saved successfully", response.data);
  } catch (error) {
    console.error("Error saving game data:", error.response ? error.response.data : error.message);
  }
};

// --- Styled Components ---
const StyledGameContainer = styled(Box)(({ theme, mouseDisabled }) => ({
    minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
    backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
    position: "relative", pointerEvents: mouseDisabled ? "none" : "auto",
}));
const PixelButton = styled(Box)(({ theme }) => ({
    display: "inline-block", backgroundColor: "#2c2c54", color: "#fff", fontFamily: '"Press Start 2P", cursive', fontSize: "14px",
    padding: "15px 30px", border: "2px solid #00d9ff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    cursor: "pointer", textAlign: "center", transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
    "&:hover": { backgroundColor: "#40407a", borderColor: "#00aaff", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)", },
    "&:active": { transform: "scale(0.95)", },
}));
const PixelBox = styled(Box)(({ theme }) => ({
    position: "absolute", bottom: "10%", left: "1%", backgroundColor: "#ff4d4f", color: "#fff", padding: "10px 20px",
    border: "2px solid #00d9ff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", fontFamily: '"Press Start 2P", cursive',
    fontSize: "12px", textAlign: "center", marginBottom: "10px",
}));
const PixelTimerBox = styled(Box)(({ theme }) => ({
    position: "absolute", bottom: "5%", left: "1%", backgroundColor: "#2c2c54", color: "#fff", padding: "10px 20px",
    border: "2px solid #00d9ff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", fontFamily: '"Press Start 2P", cursive',
    fontSize: "12px", textAlign: "center",
}));
const CardContainer = styled(Box)({ perspective: "1000px", cursor: "pointer", width: "100px", height: "130px", });
const CardInner = styled(animated.div)({ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 0.6s", });
const CardFront = styled(Box)({
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backfaceVisibility: "hidden", display: "flex",
    justifyContent: "center", alignItems: "center", borderRadius: "8px", transform: "rotateY(180deg)", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});
const CardBack = styled(Box)({
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backfaceVisibility: "hidden", display: "flex",
    justifyContent: "center", alignItems: "center", backgroundColor: "#2c2c54", border: "2px solid #00aaff",
    borderRadius: "8px", transform: "rotateY(0deg)", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});
const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#2c2c54',
    border: '2px solid #00d9ff', boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", padding: '20px', textAlign: 'center', borderRadius: '10px',
};
const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: '"Press Start 2P", cursive', fontSize: '24px', color: '#fff', letterSpacing: '1px',
    textShadow: `-1px -1px 0 #ff0000, 1px -1px 0 #ff7f00, 1px 1px 0 #ffd700, -1px 1px 0 #ff4500`,
}));
const PixelButtonModal = styled(Button)(({ theme }) => ({
    backgroundColor: "#2c2c54", color: "#fff", fontFamily: '"Press Start 2P", cursive', fontSize: "14px", padding: "15px 30px",
    border: "2px solid #00d9ff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", cursor: "pointer", textAlign: "center",
    transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
    "&:hover": { backgroundColor: "#40407a", borderColor: "#00aaff", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)", },
    "&:active": { transform: "scale(0.95)", },
}));

// --- Componente Card ---
const Card = ({ card, handleClick, flipped, matched }) => {
    const { transform } = useSpring({
      transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
      config: { tension: 500, friction: 30 },
    });
  
    return (
      // O tamanho real da carta é definido pelo CardContainer (ex: 130px)
      <CardContainer onClick={handleClick}>
        <CardInner style={{ transform }}>
          <CardFront>
             {/* A imagem preenche 100% do CardContainer */}
            <img
              src={card.image} // Usa o caminho absoluto vindo de cardImages
              alt="Card front"
              style={{ width: "100%", height: "100%", objectFit: 'contain' }} // Garante que a imagem caiba
             />
          </CardFront>
          <CardBack>
             {/* A imagem preenche 100% do CardContainer */}
            <img
              src="/images/Back2.png" // Usa o caminho absoluto de /public/images/
              alt="Card back"
              style={{ width: "100%", height: "100%", objectFit: 'contain' }} // Garante que a imagem caiba
             />
          </CardBack>
        </CardInner>
      </CardContainer>
    );
  };

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired, // Espera caminho absoluto como "/images/earth.png"
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
  flipped: PropTypes.bool.isRequired,
  matched: PropTypes.bool.isRequired,
};

// --- Componente Principal ---
const MemoryCardHard = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [initialReveal, setInitialReveal] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [mouseDisabled, setMouseDisabled] = useState(false);
  const [bgVolume, setBgVolume] = useState(() => parseInt(localStorage.getItem("bgVolume"), 10) || 50);
  const [sfxVolume, setSfxVolume] = useState(() => parseInt(localStorage.getItem("sfxVolume"), 10) || 50);
  const audioRef = useRef(null);
  const [audioIndex, setAudioIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  // --- Handlers ---
  const handleSaveNewGame = () => {
    saveGameData({
        gameDate: new Date(), failed: failedAttempts, difficulty: defaultDifficulty,
        completed: 0, timeTaken: timer,
    });
  };

  const handleNewGame = () => {
    setCards(shuffleArray(cardImages));
    setMatchedCards([]);
    setFlippedCards([]);
    setFailedAttempts(0);
    setTimer(0);
    setTimerActive(false);
    setInitialReveal(true);
    setAudioIndex(0);
    setMouseDisabled(true);
    const mouseDisableDuration = 1700;
    setTimeout(() => setMouseDisabled(false), mouseDisableDuration);
    setTimeout(() => { setInitialReveal(false); setTimerActive(true); }, 1500);
  };

  const handleBackButton = () => { setOpenModal(true); };
  const handleModalYes = () => { handleSaveNewGame(); setOpenModal(false); localStorage.removeItem("gameCompleted"); navigate("/play"); };
  const handleModalNo = () => { setOpenModal(false); };
  const handleCardClick = (card) => {
    if (mouseDisabled || matchedCards.includes(card.id) || flippedCards.some(c => c.id === card.id) || flippedCards.length === 2) return;
    setFlippedCards((prev) => [...prev, card]);
  };

  // --- UseEffects ---

  // Setup inicial, música e verificação de userID
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (!userID) { navigate("/login"); return; }
    handleNewGame();
    const audio = audioRef.current;
    if (audio) audio.volume = bgVolume / 100;
    const handleFirstClick = () => { if (!musicStarted && audio) { audio.play().catch(console.error); setMusicStarted(true); } };
    document.addEventListener("click", handleFirstClick, { once: true });
  }, [navigate]); // Apenas navigate como dependência aqui

   // Atualiza volume da música (separado do setup inicial)
   useEffect(() => {
        if (audioRef.current && musicStarted) {
            audioRef.current.volume = bgVolume / 100;
        }
    }, [bgVolume, musicStarted]);


  // Lógica do Timer
  useEffect(() => {
    let interval = null;
    if (timerActive) interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  // Lógica de combinação de cartas
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      if (card1.image === card2.image) { // Match
        setMatchedCards((prev) => [...prev, card1.id, card2.id]);
        let soundToPlay = matchAudioFiles[0]; // Usa path absoluto
        if (audioIndex < matchAudioFiles.length) {
            soundToPlay = matchAudioFiles[audioIndex];
            setAudioIndex(prev => prev + 1);
        }
        const matchAudio = new Audio(soundToPlay); // Usa path absoluto
        matchAudio.volume = sfxVolume / 100;
        matchAudio.play().catch(e => console.error("Error playing match sound:", e));
        setFlippedCards([]);
      } else { // No Match
        setFailedAttempts((prev) => prev + 1);
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
    // Depende de flippedCards para reavaliar, e audioIndex/sfxVolume para tocar som
  }, [flippedCards, audioIndex, sfxVolume]);

  // Lógica de conclusão do jogo
  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length) {
        setTimerActive(false);
        const congrats = new Audio(congratsAudioPath); // Usa path absoluto
        congrats.volume = sfxVolume / 100;
        congrats.play().catch(e => console.error("Error playing congrats sound:", e));
        saveGameData({ gameDate: new Date(), failed: failedAttempts, difficulty: defaultDifficulty, completed: 1, timeTaken: timer });
        localStorage.setItem("gameCompleted", "true");
        setTimeout(() => navigate("/congratulations"), 1500);
    }
    // Depende de matchedCards e cards para verificar conclusão
  }, [matchedCards, cards, failedAttempts, timer, navigate, sfxVolume]);


  // --- Renderização ---
  return (
    <StyledGameContainer mouseDisabled={mouseDisabled}>
      {/* Usa a variável importada de src/assets */}
      <audio ref={audioRef} src={bgMusicPath} loop />

      <PixelButton onClick={handleBackButton} sx={{ position: "absolute", top: "20px", left: "20px" }}> Back </PixelButton>
      <PixelTimerBox>Timer: {timer}s</PixelTimerBox>
      <PixelBox>Learning Moments: {failedAttempts}</PixelBox>

      <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 700, marginTop: "20px" }}>
        {cards.map((card) => (
          <Grid item xs={3} key={card.id}>
            <Card
              card={card} // Passa o objeto card inteiro
              handleClick={() => handleCardClick(card)}
              flipped={initialReveal || flippedCards.some((c) => c.id === card.id) || matchedCards.includes(card.id)}
              matched={matchedCards.includes(card.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        <PixelButton onClick={() => { handleSaveNewGame(); handleNewGame(); }}> New Game </PixelButton>
      </Box>

      <Modal open={openModal} onClose={handleModalNo} aria-labelledby="modal-title">
          <Box sx={modalStyle}>
            <PixelTypography id="modal-title" variant="h6"> Are you sure you want to go back? (Game progress will be saved) </PixelTypography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
              <PixelButtonModal onClick={handleModalYes} variant="contained" color="primary"> Yes </PixelButtonModal>
              <PixelButtonModal onClick={handleModalNo} variant="contained" color="secondary"> No </PixelButtonModal>
            </Box>
          </Box>
      </Modal>
    </StyledGameContainer>
  );
};

export default MemoryCardHard;
