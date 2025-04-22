// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Modal from "react-modal";
// // Import ethers
// import { ethers } from "ethers"; // <-- Importar ethers

// // Import assets and icons
// import backgroundGif from "../assets/images/play.gif";
// import calmBackground from "../assets/images/calm-wallpaper.jpg";
// import backgroundMusic from "../assets/audio/background-music.mp3";
// import buttonHoverSound from "../assets/audio/button-hover.mp3";
// import buttonClickSound from "../assets/audio/button-click.mp3";
// import { X, Settings, Play as PlayIcon, History as HistoryIcon, Wallet } from "lucide-react";
// import "./Play.css";

// Modal.setAppElement('#root');

// // Modal Styles Definitions (mantendo como antes)
// const modalStyles = {
//   overlay: {
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     zIndex: 999,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//   },
//   content: {
//     backgroundColor: "#1e1e2e",
//     border: "2px solid #4a4e69",
//     borderRadius: "20px",
//     padding: "40px",
//     maxWidth: "600px",
//     minHeight: "300px",
//     width: "90%",
//     color: "#fff",
//     textAlign: "center",
//     position: "relative",
//     top: "auto",
//     left: "auto",
//     transform: "none",
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-around"
//   },
// };

// const modalPlayStyles = {
//   ...modalStyles,
//   content: {
//     ...modalStyles.content,
//     minHeight: "250px",
//     maxWidth: "500px",
//   },
// };

// // Componente Principal
// const Play = () => {
//   const navigate = useNavigate();

//   // States
//   const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
//   const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
//   const [selectedDifficulty, setSelectedDifficulty] = useState(null);
//   const [isCalmMode, setIsCalmMode] = useState(false);

//   const [bgVolume, setBgVolume] = useState(() => parseInt(localStorage.getItem("bgVolume"), 10) || 50);
//   const [sfxVolume, setSfxVolume] = useState(() => parseInt(localStorage.getItem("sfxVolume"), 10) || 50);
//   const [mutedBg, setMutedBg] = useState(() => localStorage.getItem("mutedBg") === 'true' || bgVolume === 0);
//   const [mutedSfx, setMutedSfx] = useState(() => localStorage.getItem("mutedSfx") === 'true' || sfxVolume === 0);

//   const [walletAddress, setWalletAddress] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [provider, setProvider] = useState(null);

//   // Refs de Áudio
//   const bgAudioRef = useRef(null);
//   const hoverAudioRef = useRef(null);
//   const clickAudioRef = useRef(null);

//   // --- Lógica de Conexão com a Carteira ---
//   const connectWallet = async () => {
//     console.log("Attempting to connect wallet...");
//     if (window.ethereum == null) {
//       console.error("MetaMask not installed; using read-only defaults");
//       alert("MetaMask is not installed. Please install it to connect your wallet.");
//       return;
//     }

//     try {
//         const web3Provider = new ethers.BrowserProvider(window.ethereum);
//         setProvider(web3Provider);

//         const web3Signer = await web3Provider.getSigner();
//         setSigner(web3Signer);

//         const address = await web3Signer.getAddress();
//         console.log("Wallet connected:", address);
//         setWalletAddress(address);

//          // Listener para mudança de contas
//          window.ethereum.on('accountsChanged', handleAccountsChanged);

//          // Listener para mudança de rede
//          window.ethereum.on('chainChanged', handleChainChanged);

//     } catch (error) {
//       console.error("Error connecting to MetaMask:", error);
//       if (error.code === 4001) {
//          alert("Connection rejected. Please connect your wallet to continue.");
//       } else {
//          alert("Failed to connect wallet. See console for details.");
//       }
//       setWalletAddress(null);
//       setSigner(null);
//       setProvider(null);
//     }
//   };

//   // Handle mudança de contas
//   const handleAccountsChanged = (accounts) => {
//       console.log('Account changed:', accounts);
//       if (accounts.length > 0) {
//           setWalletAddress(accounts[0]);
//           // Re-obter o signer para a nova conta
//           provider?.getSigner().then(setSigner).catch(console.error);
//       } else {
//           setWalletAddress(null);
//           setSigner(null);
//           console.log("Wallet disconnected.");
//       }
//   };

//   // Handle mudança de rede
//   const handleChainChanged = (chainId) => {
//      console.log('Network changed to:', chainId);
//      alert("Network changed. Reloading the page."); // Informa o usuário
//      window.location.reload();
//   };

//   // Remove listeners on unmount
//   useEffect(() => {
//       return () => {
//           if (window.ethereum?.removeListener) {
//               window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//               window.ethereum.removeListener('chainChanged', handleChainChanged);
//           }
//       };
//   }, [provider]); // Depende do provider para garantir que window.ethereum está disponível


//   // Função para formatar o endereço
//   const formatAddress = (address) => {
//     if (!address) return "";
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
//   };

//  // --- Lógica de Áudio ---
//   useEffect(() => {
//     // Inicializa áudios
//     bgAudioRef.current = new Audio(backgroundMusic);
//     hoverAudioRef.current = new Audio(buttonHoverSound);
//     clickAudioRef.current = new Audio(buttonClickSound);

//     const bgAudio = bgAudioRef.current;
//     bgAudio.loop = true;
//     bgAudio.volume = mutedBg ? 0 : bgVolume / 100; // Volume inicial baseado no state

//     const startMusic = () => {
//       if (!mutedBg && bgAudio.paused) {
//         bgAudio.play().catch((error) => console.error("Autoplay failed:", error));
//       }
//     };
//     document.addEventListener("click", startMusic, { once: true });

//     return () => { // Cleanup
//       document.removeEventListener("click", startMusic);
//       if (bgAudio) {
//         bgAudio.pause();
//         bgAudio.currentTime = 0;
//       }
//     };
//   }, []); // Executa apenas na montagem

//   // Efeito para atualizar volume/mute e localStorage
//   useEffect(() => {
//     if (bgAudioRef.current) {
//       bgAudioRef.current.volume = mutedBg ? 0 : bgVolume / 100;
//       // Play/Pause baseado no mute
//       if (!mutedBg && bgAudioRef.current.paused && bgAudioRef.current.readyState >= 3) {
//         bgAudioRef.current.play().catch(e => console.log("Error resuming music:", e));
//       } else if (mutedBg) {
//         bgAudioRef.current.pause();
//       }
//     }
//     localStorage.setItem("bgVolume", bgVolume);
//     localStorage.setItem("mutedBg", String(mutedBg)); // Salva como string
//   }, [bgVolume, mutedBg]);

//   useEffect(() => {
//     if (hoverAudioRef.current) hoverAudioRef.current.volume = mutedSfx ? 0 : sfxVolume / 100;
//     if (clickAudioRef.current) clickAudioRef.current.volume = mutedSfx ? 0 : sfxVolume / 100;
//     localStorage.setItem("sfxVolume", sfxVolume);
//     localStorage.setItem("mutedSfx", String(mutedSfx)); // Salva como string
//   }, [sfxVolume, mutedSfx]);

//   // --- Handlers de Volume e Mute ---
//   const handleBgVolumeChange = (event) => {
//     const newVolume = parseInt(event.target.value, 10);
//     setBgVolume(newVolume);
//     if (newVolume === 0 && !mutedBg) setMutedBg(true);
//     else if (newVolume > 0 && mutedBg) setMutedBg(false);
//   };

//   const handleSfxVolumeChange = (event) => {
//     const newVolume = parseInt(event.target.value, 10);
//     setSfxVolume(newVolume);
//     if (newVolume === 0 && !mutedSfx) setMutedSfx(true);
//     else if (newVolume > 0 && mutedSfx) setMutedSfx(false);
//   };

//   const toggleBgMute = () => { setMutedBg(prev => !prev); playClickSound(); };
//   const toggleSfxMute = () => { setMutedSfx(prev => !prev); playClickSound(); };

//   // --- Funções de Play Sound ---
//   const playHoverSound = () => { if (!mutedSfx && hoverAudioRef.current) { hoverAudioRef.current.currentTime = 0; hoverAudioRef.current.play().catch(console.error); } };
//   const playClickSound = () => { if (!mutedSfx && clickAudioRef.current) { clickAudioRef.current.currentTime = 0; clickAudioRef.current.play().catch(console.error); } };

//   // --- Handlers de Modal ---
//   const openSettingsModal = () => { playClickSound(); setIsSettingsModalOpen(true); };
//   const closeSettingsModal = () => { playClickSound(); setIsSettingsModalOpen(false); };
//   const openPlayModal = () => { playClickSound(); setIsPlayModalOpen(true); };
//   const closePlayModal = () => { playClickSound(); setSelectedDifficulty(null); setIsPlayModalOpen(false); };

//   // --- Handlers de Jogo ---
//   const handleDifficultySelect = (level) => { playClickSound(); setSelectedDifficulty(level); };
//   const handlePlay = () => {
//     playClickSound();
//     if (!selectedDifficulty) { alert("Please select a difficulty level!"); return; }
//     const userID = localStorage.getItem("userID");
//     if (!userID) { alert("UserID is missing. Please log in again."); navigate('/login'); return; }
//     localStorage.setItem("gameStarted", "true");

//     // CORREÇÃO APLICADA NOS CASES ABAIXO:
//     switch (selectedDifficulty) {
//       case "easy": // Mantido como "easy" se o botão envia "easy"
//         navigate("/easy");
//         break;
//       case "medium": // Mantido como "medium" se o botão envia "medium"
//         navigate("/medium");
//         break;
//       case "red": // CORRIGIDO de "hard" para "red"
//         navigate("/hard"); // Navega para a rota /hard (que carrega MemoryCardHard)
//         break;
//       default:
//         // Este console.error não deve mais ser atingido para easy/medium/hard
//         console.error("Invalid difficulty selected:", selectedDifficulty);
//         alert("An unexpected error occurred selecting the difficulty."); // Mensagem de alerta genérica
//     }
//     closePlayModal();
//   };

//   // --- Navegação para Histórico ---
//   const goToHistory = () => { playClickSound(); navigate('/history'); };

//   // --- Toggle Calm Mode ---
//   const toggleCalmMode = () => { playClickSound(); setIsCalmMode(prev => !prev); };


//   // --- Renderização ---
//   return (
//     <div
//       className="background-container"
//       style={{ backgroundImage: `url(${isCalmMode ? calmBackground : backgroundGif})` }}
//     >
//       {/* Status da Carteira */}
//       <div className="wallet-status-container">
//         {walletAddress ? (
//           <div className="wallet-connected">
//             <Wallet size={18} style={{ marginRight: '6px', color: '#00d9ff' }} />
//             <span>{formatAddress(walletAddress)}</span>
//           </div>
//         ) : (
//           <button onClick={connectWallet} className="connect-wallet-button" onMouseEnter={playHoverSound}>
//             <Wallet size={18} style={{ marginRight: '8px' }} /> Connect Wallet
//           </button>
//         )}
//       </div>

//       {/* Título */}
//       <h1 className={`game-title ${isCalmMode ? "calm-title" : ""}`}>
//         WonderCards
//       </h1>

//       {/* Botões Principais */}
//       <div className="button-container">
//         <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={openPlayModal} onMouseEnter={playHoverSound}>
//           <PlayIcon size={20} style={{ marginRight: '8px' }} /> Play
//         </button>
//         <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={goToHistory} onMouseEnter={playHoverSound}>
//           <HistoryIcon size={20} style={{ marginRight: '8px' }} /> History
//         </button>
//         <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={openSettingsModal} onMouseEnter={playHoverSound}>
//           <Settings size={20} style={{ marginRight: '8px' }} /> Settings
//         </button>
//       </div>

//       {/* Modal de Configurações */}
//       <Modal
//         isOpen={isSettingsModalOpen}
//         onRequestClose={closeSettingsModal}
//         style={{ ...modalStyles, content: { ...modalStyles.content, backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e", color: isCalmMode ? "#ffffff" : "#fff" } }}
//         contentLabel="Game Settings"
//       >
//         <button onClick={closeSettingsModal} className="modal-close-button"><X size={24} /></button>
//         <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>Settings</h2>
//         <div>
//           <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Background Music</h3>
//           <div className="volume-control">
//             <button onClick={toggleBgMute} className="mute-button" aria-label="Toggle Background Music Mute"><span className="volume-icon">{mutedBg ? "這" : "矧"}</span></button>
//             <input type="range" min="0" max="100" value={mutedBg ? 0 : bgVolume} onChange={handleBgVolumeChange} className="volume-slider" aria-label="Background Music Volume" disabled={mutedBg} />
//             <span className="volume-value">{mutedBg ? 'Muted' : `${bgVolume}%`}</span>
//           </div>
//         </div>
//         <div>
//           <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Sound Effects</h3>
//           <div className="volume-control">
//             <button onClick={toggleSfxMute} className="mute-button" aria-label="Toggle Sound Effects Mute"><span className="volume-icon">{mutedSfx ? "這" : "矧"}</span></button>
//             <input type="range" min="0" max="100" value={mutedSfx ? 0 : sfxVolume} onChange={handleSfxVolumeChange} className="volume-slider" aria-label="Sound Effects Volume" disabled={mutedSfx} />
//             <span className="volume-value">{mutedSfx ? 'Muted' : `${sfxVolume}%`}</span>
//           </div>
//         </div>
//         <div className="calm-mode">
//           <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Calm Mode</h3>
//           <label className="switch"><input type="checkbox" checked={isCalmMode} onChange={toggleCalmMode} aria-label="Toggle Calm Mode" /><span className="slider round"></span></label>
//         </div>
//       </Modal>

//       {/* Modal de Seleção de Dificuldade */}
//       <Modal
//         isOpen={isPlayModalOpen}
//         onRequestClose={closePlayModal}
//         style={{ ...modalPlayStyles, content: { ...modalPlayStyles.content, backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e", color: isCalmMode ? "#ffffff" : "#fff" } }}
//         contentLabel="Select Difficulty"
//       >
//         <button onClick={closePlayModal} className="modal-close-button"><X size={24} /></button>
//         <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>Select Difficulty</h2>
//         <div className="difficulty-selection">
//           <button onClick={() => handleDifficultySelect("easy")} className={`difficulty-button green ${selectedDifficulty === "easy" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Easy</button>
//           <button onClick={() => handleDifficultySelect("medium")} className={`difficulty-button yellow ${selectedDifficulty === "medium" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Normal</button>
//           <button onClick={() => handleDifficultySelect("red")} className={`difficulty-button red ${selectedDifficulty === "hard" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Hard</button>
//         </div>
//         <button onClick={handlePlay} className={`play-button ${!selectedDifficulty ? 'disabled' : ''}`} onMouseEnter={playHoverSound} disabled={!selectedDifficulty}>Accept</button>
//       </Modal>
//     </div>
//   );
// };

// export default Play;

// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Modal from "react-modal";
// // Import ethers
// import { ethers } from "ethers"; // <-- Importar ethers

// // Import assets and icons
// import backgroundGif from "../assets/images/play.gif";
// import calmBackground from "../assets/images/calm-wallpaper.jpg";
// import backgroundMusic from "../assets/audio/background-music.mp3";
// import buttonHoverSound from "../assets/audio/button-hover.mp3";
// import buttonClickSound from "../assets/audio/button-click.mp3";
// // Importar LogOut icon
// import { X, Settings, Play as PlayIcon, History as HistoryIcon, Wallet, LogOut } from "lucide-react";
// import "./Play.css";

// Modal.setAppElement('#root');

// // Modal Styles Definitions
// const modalStyles = {
//   overlay: {
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     zIndex: 999,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//   },
//   content: {
//     backgroundColor: "#1e1e2e",
//     border: "2px solid #4a4e69",
//     borderRadius: "20px",
//     padding: "40px",
//     maxWidth: "600px",
//     minHeight: "300px",
//     width: "90%",
//     color: "#fff",
//     textAlign: "center",
//     position: "relative",
//     top: "auto",
//     left: "auto",
//     transform: "none",
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-around"
//   },
// };

// const modalPlayStyles = {
//   ...modalStyles,
//   content: {
//     ...modalStyles.content,
//     minHeight: "250px",
//     maxWidth: "500px",
//   },
// };

// // Componente Principal
// const Play = () => {
//   const navigate = useNavigate();

//   // States
//   const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
//   const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
//   const [selectedDifficulty, setSelectedDifficulty] = useState(null);
//   const [isCalmMode, setIsCalmMode] = useState(false);
//   const [bgVolume, setBgVolume] = useState(() => parseInt(localStorage.getItem("bgVolume"), 10) || 50);
//   const [sfxVolume, setSfxVolume] = useState(() => parseInt(localStorage.getItem("sfxVolume"), 10) || 50);
//   const [mutedBg, setMutedBg] = useState(() => localStorage.getItem("mutedBg") === 'true' || bgVolume === 0);
//   const [mutedSfx, setMutedSfx] = useState(() => localStorage.getItem("mutedSfx") === 'true' || sfxVolume === 0);
//   const [walletAddress, setWalletAddress] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [provider, setProvider] = useState(null);

//   // Refs de Áudio
//   const bgAudioRef = useRef(null);
//   const hoverAudioRef = useRef(null);
//   const clickAudioRef = useRef(null);

//   // --- Lógica de Conexão com a Carteira ---
//   const connectWallet = async () => {
//     console.log("Attempting to connect wallet...");
//     if (window.ethereum == null) {
//       console.error("MetaMask not installed; using read-only defaults");
//       alert("MetaMask is not installed. Please install it to connect your wallet.");
//       return;
//     }
//     try {
//         const web3Provider = new ethers.BrowserProvider(window.ethereum);
//         setProvider(web3Provider);
//         const web3Signer = await web3Provider.getSigner();
//         setSigner(web3Signer);
//         const address = await web3Signer.getAddress();
//         console.log("Wallet connected:", address);
//         setWalletAddress(address);
//          window.ethereum.on('accountsChanged', handleAccountsChanged);
//          window.ethereum.on('chainChanged', handleChainChanged);
//     } catch (error) {
//       console.error("Error connecting to MetaMask:", error);
//       if (error.code === 4001) { alert("Connection rejected. Please connect your wallet to continue."); }
//       else { alert("Failed to connect wallet. See console for details."); }
//       setWalletAddress(null); setSigner(null); setProvider(null);
//     }
//   };
//   const handleAccountsChanged = (accounts) => {
//       console.log('Account changed:', accounts);
//       if (accounts.length > 0) {
//           setWalletAddress(accounts[0]);
//           provider?.getSigner().then(setSigner).catch(console.error);
//       } else {
//           setWalletAddress(null); setSigner(null); console.log("Wallet disconnected.");
//       }
//   };
//   const handleChainChanged = (chainId) => {
//      console.log('Network changed to:', chainId);
//      alert("Network changed. Reloading the page."); window.location.reload();
//   };
//   useEffect(() => {
//       return () => {
//           if (window.ethereum?.removeListener) {
//               window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//               window.ethereum.removeListener('chainChanged', handleChainChanged);
//           }
//       };
//   }, [provider]);
//   const formatAddress = (address) => {
//     if (!address) return "";
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
//   };

//   // --- Lógica de Logout ---
//   const handleLogout = () => {
//     playClickSound();
//     console.log("Logging out...");
//     localStorage.removeItem('token');
//     localStorage.removeItem('userID');
//     localStorage.removeItem('gameCompleted');
//     localStorage.removeItem('gameStarted');
//     // Considerar limpar outros itens do localStorage relacionados à sessão, se houver
//     navigate('/login');
//   };

//   // --- Lógica de Áudio ---
//   useEffect(() => {
//     bgAudioRef.current = new Audio(backgroundMusic);
//     hoverAudioRef.current = new Audio(buttonHoverSound);
//     clickAudioRef.current = new Audio(buttonClickSound);
//     const bgAudio = bgAudioRef.current;
//     bgAudio.loop = true;
//     bgAudio.volume = mutedBg ? 0 : bgVolume / 100;
//     const startMusic = () => { if (!mutedBg && bgAudio.paused) { bgAudio.play().catch(console.error); } };
//     document.addEventListener("click", startMusic, { once: true });
//     return () => { document.removeEventListener("click", startMusic); if (bgAudio) { bgAudio.pause(); bgAudio.currentTime = 0; } };
//   }, []);
//   useEffect(() => {
//     if (bgAudioRef.current) {
//       bgAudioRef.current.volume = mutedBg ? 0 : bgVolume / 100;
//       if (!mutedBg && bgAudioRef.current.paused && bgAudioRef.current.readyState >= 3) { bgAudioRef.current.play().catch(console.error); }
//       else if (mutedBg) { bgAudioRef.current.pause(); }
//     }
//     localStorage.setItem("bgVolume", bgVolume); localStorage.setItem("mutedBg", String(mutedBg));
//   }, [bgVolume, mutedBg]);
//   useEffect(() => {
//     if (hoverAudioRef.current) hoverAudioRef.current.volume = mutedSfx ? 0 : sfxVolume / 100;
//     if (clickAudioRef.current) clickAudioRef.current.volume = mutedSfx ? 0 : sfxVolume / 100;
//     localStorage.setItem("sfxVolume", sfxVolume); localStorage.setItem("mutedSfx", String(mutedSfx));
//   }, [sfxVolume, mutedSfx]);

//   // --- Handlers de Volume e Mute ---
//   const handleBgVolumeChange = (event) => { const v = parseInt(event.target.value, 10); setBgVolume(v); if (v === 0 && !mutedBg) setMutedBg(true); else if (v > 0 && mutedBg) setMutedBg(false); };
//   const handleSfxVolumeChange = (event) => { const v = parseInt(event.target.value, 10); setSfxVolume(v); if (v === 0 && !mutedSfx) setMutedSfx(true); else if (v > 0 && mutedSfx) setMutedSfx(false); };
//   const toggleBgMute = () => { setMutedBg(p => !p); playClickSound(); };
//   const toggleSfxMute = () => { setMutedSfx(p => !p); playClickSound(); };

//   // --- Funções de Play Sound ---
//   const playHoverSound = () => { if (!mutedSfx && hoverAudioRef.current) { hoverAudioRef.current.currentTime = 0; hoverAudioRef.current.play().catch(console.error); } };
//   const playClickSound = () => { if (!mutedSfx && clickAudioRef.current) { clickAudioRef.current.currentTime = 0; clickAudioRef.current.play().catch(console.error); } };

//   // --- Handlers de Modal ---
//   const openSettingsModal = () => { playClickSound(); setIsSettingsModalOpen(true); };
//   const closeSettingsModal = () => { playClickSound(); setIsSettingsModalOpen(false); };
//   const openPlayModal = () => { playClickSound(); setIsPlayModalOpen(true); };
//   const closePlayModal = () => { playClickSound(); setSelectedDifficulty(null); setIsPlayModalOpen(false); };

//   // --- Handlers de Jogo ---
//   const handleDifficultySelect = (level) => { playClickSound(); setSelectedDifficulty(level); };
//   const handlePlay = () => {
//     playClickSound();
//     if (!selectedDifficulty) { alert("Please select a difficulty level!"); return; }
//     const userID = localStorage.getItem("userID");
//     if (!userID) { alert("UserID is missing. Please log in again."); navigate('/login'); return; }
//     localStorage.setItem("gameStarted", "true");
//     switch (selectedDifficulty) {
//       case "easy": navigate("/easy"); break;
//       case "medium": navigate("/medium"); break;
//       case "red": navigate("/hard"); break; // Corrigido para "red" e rota "/hard"
//       default: console.error("Invalid difficulty selected:", selectedDifficulty); alert("An unexpected error occurred selecting the difficulty.");
//     }
//     closePlayModal();
//   };

//   // --- Navegação para Histórico ---
//   const goToHistory = () => { playClickSound(); navigate('/history'); };

//   // --- Toggle Calm Mode ---
//   const toggleCalmMode = () => { playClickSound(); setIsCalmMode(prev => !prev); };


//   // --- Renderização ---
//   return (
//     <div
//       className="background-container"
//       style={{ backgroundImage: `url(${isCalmMode ? calmBackground : backgroundGif})` }}
//     >
//       {/* Container Superior Direito (Carteira e Logout) */}
//       <div className="top-right-container">
//           <div className="wallet-status-container">
//             {walletAddress ? (
//               <div className="wallet-connected">
//                 <Wallet size={18} style={{ marginRight: '6px', color: '#00d9ff' }} />
//                 <span>{formatAddress(walletAddress)}</span>
//               </div>
//             ) : (
//               <button onClick={connectWallet} className="connect-wallet-button" onMouseEnter={playHoverSound}>
//                 <Wallet size={18} style={{ marginRight: '8px' }} /> Connect Wallet
//               </button>
//             )}
//           </div>
//           {/* Botão de Logout */}
//           <button onClick={handleLogout} className="logout-button" onMouseEnter={playHoverSound} title="Logout">
//               <LogOut size={18} />
//           </button>
//       </div>

//       {/* Título */}
//       <h1 className={`game-title ${isCalmMode ? "calm-title" : ""}`}>
//         WonderCards
//       </h1>

//       {/* Botões Principais */}
//       <div className="button-container">
//         <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={openPlayModal} onMouseEnter={playHoverSound}>
//             <PlayIcon size={20} style={{ marginRight: '8px' }} /> Play
//         </button>
//         <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={goToHistory} onMouseEnter={playHoverSound}>
//             <HistoryIcon size={20} style={{ marginRight: '8px' }} /> History
//         </button>
//         <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={openSettingsModal} onMouseEnter={playHoverSound}>
//             <Settings size={20} style={{ marginRight: '8px' }} /> Settings
//         </button>
//       </div>

//       {/* Modal de Configurações */}
//       <Modal isOpen={isSettingsModalOpen} onRequestClose={closeSettingsModal} style={{ ...modalStyles, content: { ...modalStyles.content, backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e", color: isCalmMode ? "#ffffff" : "#fff" } }} contentLabel="Game Settings" >
//         <button onClick={closeSettingsModal} className="modal-close-button"><X size={24} /></button>
//         <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>Settings</h2>
//         <div> <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Background Music</h3> <div className="volume-control"> <button onClick={toggleBgMute} className="mute-button" aria-label="Toggle Background Music Mute"><span className="volume-icon">{mutedBg ? "這" : "矧"}</span></button> <input type="range" min="0" max="100" value={mutedBg ? 0 : bgVolume} onChange={handleBgVolumeChange} className="volume-slider" aria-label="Background Music Volume" disabled={mutedBg} /> <span className="volume-value">{mutedBg ? 'Muted' : `${bgVolume}%`}</span> </div> </div>
//         <div> <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Sound Effects</h3> <div className="volume-control"> <button onClick={toggleSfxMute} className="mute-button" aria-label="Toggle Sound Effects Mute"><span className="volume-icon">{mutedSfx ? "這" : "矧"}</span></button> <input type="range" min="0" max="100" value={mutedSfx ? 0 : sfxVolume} onChange={handleSfxVolumeChange} className="volume-slider" aria-label="Sound Effects Volume" disabled={mutedSfx} /> <span className="volume-value">{mutedSfx ? 'Muted' : `${sfxVolume}%`}</span> </div> </div>
//         <div className="calm-mode"> <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Calm Mode</h3> <label className="switch"><input type="checkbox" checked={isCalmMode} onChange={toggleCalmMode} aria-label="Toggle Calm Mode" /><span className="slider round"></span></label> </div>
//       </Modal>

//        {/* Modal de Seleção de Dificuldade */}
//       <Modal isOpen={isPlayModalOpen} onRequestClose={closePlayModal} style={{ ...modalPlayStyles, content: { ...modalPlayStyles.content, backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e", color: isCalmMode ? "#ffffff" : "#fff" } }} contentLabel="Select Difficulty" >
//         <button onClick={closePlayModal} className="modal-close-button"><X size={24} /></button>
//         <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>Select Difficulty</h2>
//         <div className="difficulty-selection">
//           <button onClick={() => handleDifficultySelect("easy")} className={`difficulty-button green ${selectedDifficulty === "easy" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Easy</button>
//           <button onClick={() => handleDifficultySelect("medium")} className={`difficulty-button yellow ${selectedDifficulty === "medium" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Normal</button>
//           <button onClick={() => handleDifficultySelect("red")} className={`difficulty-button red ${selectedDifficulty === "red" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Hard</button> {/* Valor "red" aqui */}
//         </div>
//         <button onClick={handlePlay} className={`play-button ${!selectedDifficulty ? 'disabled' : ''}`} onMouseEnter={playHoverSound} disabled={!selectedDifficulty}>Accept</button>
//       </Modal>
//     </div>
//   );
// };

// export default Play;


// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Modal from "react-modal";
// // Import ethers
// import { ethers } from "ethers";

// // Import assets and icons
// import backgroundGif from "../assets/images/play.gif";
// import calmBackground from "../assets/images/calm-wallpaper.jpg";
// import backgroundMusic from "../assets/audio/background-music.mp3";
// import buttonHoverSound from "../assets/audio/button-hover.mp3";
// import buttonClickSound from "../assets/audio/button-click.mp3";
// // Import LogOut icon
// import { X, Settings, Play as PlayIcon, History as HistoryIcon, Wallet, LogOut } from "lucide-react";
// import "./Play.css";

// Modal.setAppElement('#root');

// // Modal Styles Definitions
// const modalStyles = {
//   overlay: {
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     zIndex: 999,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//   },
//   content: {
//     backgroundColor: "#1e1e2e",
//     border: "2px solid #4a4e69",
//     borderRadius: "20px",
//     padding: "40px",
//     maxWidth: "600px",
//     minHeight: "300px",
//     width: "90%",
//     color: "#fff",
//     textAlign: "center",
//     position: "relative",
//     top: "auto",
//     left: "auto",
//     transform: "none",
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-around"
//   },
// };

// const modalPlayStyles = {
//   ...modalStyles,
//   content: {
//     ...modalStyles.content,
//     minHeight: "250px",
//     maxWidth: "500px",
//   },
// };

// // Componente Principal
// const Play = () => {
//   const navigate = useNavigate();

//   // States
//   const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
//   const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
//   const [selectedDifficulty, setSelectedDifficulty] = useState(null);
//   const [isCalmMode, setIsCalmMode] = useState(false);
//   const [bgVolume, setBgVolume] = useState(() => parseInt(localStorage.getItem("bgVolume"), 10) || 50);
//   const [sfxVolume, setSfxVolume] = useState(() => parseInt(localStorage.getItem("sfxVolume"), 10) || 50);
//   const [mutedBg, setMutedBg] = useState(() => localStorage.getItem("mutedBg") === 'true' || bgVolume === 0);
//   const [mutedSfx, setMutedSfx] = useState(() => localStorage.getItem("mutedSfx") === 'true' || sfxVolume === 0);
//   const [walletAddress, setWalletAddress] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [provider, setProvider] = useState(null);

//   // Refs de Áudio
//   const bgAudioRef = useRef(null);
//   const hoverAudioRef = useRef(null);
//   const clickAudioRef = useRef(null);

//   // --- Lógica de Conexão com a Carteira ---
//   const connectWallet = async () => {
//     console.log("Attempting to connect wallet...");
//     if (window.ethereum == null) {
//       console.error("MetaMask not installed; using read-only defaults");
//       alert("MetaMask is not installed. Please install it to connect your wallet.");
//       return;
//     }
//     try {
//         const web3Provider = new ethers.BrowserProvider(window.ethereum);
//         setProvider(web3Provider);
//         const web3Signer = await web3Provider.getSigner();
//         setSigner(web3Signer);
//         const address = await web3Signer.getAddress();
//         console.log("Wallet connected:", address);
//         setWalletAddress(address);
//          window.ethereum.on('accountsChanged', handleAccountsChanged);
//          window.ethereum.on('chainChanged', handleChainChanged);
//     } catch (error) {
//       console.error("Error connecting to MetaMask:", error);
//       if (error.code === 4001) { alert("Connection rejected. Please connect your wallet to continue."); }
//       else { alert("Failed to connect wallet. See console for details."); }
//       setWalletAddress(null); setSigner(null); setProvider(null);
//     }
//   };
//   const handleAccountsChanged = (accounts) => {
//       console.log('Account changed:', accounts);
//       if (accounts.length > 0) {
//           setWalletAddress(accounts[0]);
//           provider?.getSigner().then(setSigner).catch(console.error);
//       } else {
//           setWalletAddress(null); setSigner(null); console.log("Wallet disconnected.");
//       }
//   };
//   const handleChainChanged = (chainId) => {
//      console.log('Network changed to:', chainId);
//      alert("Network changed. Reloading the page."); window.location.reload();
//   };
//   useEffect(() => {
//       return () => {
//           if (window.ethereum?.removeListener) {
//               window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//               window.ethereum.removeListener('chainChanged', handleChainChanged);
//           }
//       };
//   }, [provider]); // Depende do provider para garantir que window.ethereum está disponível
//   const formatAddress = (address) => {
//     if (!address) return "";
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
//   };

//   // --- Lógica de Logout ---
//   const handleLogout = () => {
//     playClickSound();
//     console.log("Logging out...");
//     localStorage.removeItem('token');
//     localStorage.removeItem('userID');
//     localStorage.removeItem('gameCompleted');
//     localStorage.removeItem('gameStarted');
//     setWalletAddress(null); // Limpa estado da carteira também
//     setSigner(null);
//     setProvider(null);
//     navigate('/login');
//   };

//   // --- Lógica de Áudio ---
//   useEffect(() => {
//     bgAudioRef.current = new Audio(backgroundMusic);
//     hoverAudioRef.current = new Audio(buttonHoverSound);
//     clickAudioRef.current = new Audio(buttonClickSound);
//     const bgAudio = bgAudioRef.current;
//     bgAudio.loop = true;
//     bgAudio.volume = mutedBg ? 0 : bgVolume / 100;
//     const startMusic = () => { if (!mutedBg && bgAudio.paused) { bgAudio.play().catch(console.error); } };
//     document.addEventListener("click", startMusic, { once: true });
//     return () => { document.removeEventListener("click", startMusic); if (bgAudio) { bgAudio.pause(); bgAudio.currentTime = 0; } };
//   }, []);
//   useEffect(() => {
//     if (bgAudioRef.current) {
//       bgAudioRef.current.volume = mutedBg ? 0 : bgVolume / 100;
//       if (!mutedBg && bgAudioRef.current.paused && bgAudioRef.current.readyState >= 3) { bgAudioRef.current.play().catch(console.error); }
//       else if (mutedBg) { bgAudioRef.current.pause(); }
//     }
//     localStorage.setItem("bgVolume", bgVolume); localStorage.setItem("mutedBg", String(mutedBg));
//   }, [bgVolume, mutedBg]);
//   useEffect(() => {
//     if (hoverAudioRef.current) hoverAudioRef.current.volume = mutedSfx ? 0 : sfxVolume / 100;
//     if (clickAudioRef.current) clickAudioRef.current.volume = mutedSfx ? 0 : sfxVolume / 100;
//     localStorage.setItem("sfxVolume", sfxVolume); localStorage.setItem("mutedSfx", String(mutedSfx));
//   }, [sfxVolume, mutedSfx]);

//   // --- Handlers de Volume e Mute ---
//   const handleBgVolumeChange = (event) => { const v = parseInt(event.target.value, 10); setBgVolume(v); if (v === 0 && !mutedBg) setMutedBg(true); else if (v > 0 && mutedBg) setMutedBg(false); };
//   const handleSfxVolumeChange = (event) => { const v = parseInt(event.target.value, 10); setSfxVolume(v); if (v === 0 && !mutedSfx) setMutedSfx(true); else if (v > 0 && mutedSfx) setMutedSfx(false); };
//   const toggleBgMute = () => { setMutedBg(p => !p); playClickSound(); };
//   const toggleSfxMute = () => { setMutedSfx(p => !p); playClickSound(); };

//   // --- Funções de Play Sound ---
//   const playHoverSound = () => { if (!mutedSfx && hoverAudioRef.current) { hoverAudioRef.current.currentTime = 0; hoverAudioRef.current.play().catch(console.error); } };
//   const playClickSound = () => { if (!mutedSfx && clickAudioRef.current) { clickAudioRef.current.currentTime = 0; clickAudioRef.current.play().catch(console.error); } };

//   // --- Handlers de Modal ---
//   const openSettingsModal = () => { playClickSound(); setIsSettingsModalOpen(true); };
//   const closeSettingsModal = () => { playClickSound(); setIsSettingsModalOpen(false); };
//   const openPlayModal = () => { playClickSound(); setIsPlayModalOpen(true); };
//   const closePlayModal = () => { playClickSound(); setSelectedDifficulty(null); setIsPlayModalOpen(false); };

//   // --- Handlers de Jogo ---
//   const handleDifficultySelect = (level) => { playClickSound(); setSelectedDifficulty(level); };
//   const handlePlay = () => {
//     playClickSound();
//     if (!selectedDifficulty) { alert("Please select a difficulty level!"); return; }
//     const userID = localStorage.getItem("userID");
//     if (!userID) { alert("UserID is missing. Please log in again."); navigate('/login'); return; }
//     localStorage.setItem("gameStarted", "true");
//     switch (selectedDifficulty) {
//       case "easy": navigate("/easy"); break;
//       case "medium": navigate("/medium"); break;
//       case "red": navigate("/hard"); break; // Rota corrigida
//       default: console.error("Invalid difficulty selected:", selectedDifficulty); alert("An unexpected error occurred selecting the difficulty.");
//     }
//     closePlayModal();
//   };

//   // --- Navegação para Histórico ---
//   const goToHistory = () => { playClickSound(); navigate('/history'); };

//   // --- Toggle Calm Mode ---
//   const toggleCalmMode = () => { playClickSound(); setIsCalmMode(prev => !prev); };

//   // --- Renderização ---
//   return (
//     <div
//       className="background-container"
//       style={{ backgroundImage: `url(${isCalmMode ? calmBackground : backgroundGif})` }}
//     >
//       {/* Container Superior Esquerdo (Carteira) */}
//       <div className="top-left-container">
//           <div className="wallet-status-container">
//             {walletAddress ? (
//               <div className="wallet-connected">
//                 <Wallet size={18} style={{ marginRight: '6px', color: '#00d9ff' }} />
//                 <span>{formatAddress(walletAddress)}</span>
//               </div>
//             ) : (
//               <button onClick={connectWallet} className="connect-wallet-button" onMouseEnter={playHoverSound}>
//                 <Wallet size={18} style={{ marginRight: '8px' }} /> Connect Wallet
//               </button>
//             )}
//           </div>
//       </div>

//       {/* Container Superior Direito (Logout) */}
//       <div className="top-right-container">
//           <button onClick={handleLogout} className="logout-button" onMouseEnter={playHoverSound} title="Logout">
//               <LogOut size={18} />
//           </button>
//       </div>

//       {/* Título (Centralizado) */}
//       <h1 className={`game-title ${isCalmMode ? "calm-title" : ""}`}>
//         WonderCards
//       </h1>

//       {/* Botões Principais (Centralizados) */}
//       <div className="button-container">
//         <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={openPlayModal} onMouseEnter={playHoverSound}> <PlayIcon size={20} style={{ marginRight: '8px' }} /> Play </button>
//         <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={goToHistory} onMouseEnter={playHoverSound}> <HistoryIcon size={20} style={{ marginRight: '8px' }} /> History </button>
//         <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={openSettingsModal} onMouseEnter={playHoverSound}> <Settings size={20} style={{ marginRight: '8px' }} /> Settings </button>
//       </div>

//       {/* Modais */}
//       <Modal isOpen={isSettingsModalOpen} onRequestClose={closeSettingsModal} style={{ ...modalStyles, content: { ...modalStyles.content, backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e", color: isCalmMode ? "#ffffff" : "#fff" } }} contentLabel="Game Settings" >
//         <button onClick={closeSettingsModal} className="modal-close-button"><X size={24} /></button>
//         <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>Settings</h2>
//         <div> <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Background Music</h3> <div className="volume-control"> <button onClick={toggleBgMute} className="mute-button" aria-label="Toggle Background Music Mute"><span className="volume-icon">{mutedBg ? "這" : "矧"}</span></button> <input type="range" min="0" max="100" value={mutedBg ? 0 : bgVolume} onChange={handleBgVolumeChange} className="volume-slider" aria-label="Background Music Volume" disabled={mutedBg} /> <span className="volume-value">{mutedBg ? 'Muted' : `${bgVolume}%`}</span> </div> </div>
//         <div> <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Sound Effects</h3> <div className="volume-control"> <button onClick={toggleSfxMute} className="mute-button" aria-label="Toggle Sound Effects Mute"><span className="volume-icon">{mutedSfx ? "這" : "矧"}</span></button> <input type="range" min="0" max="100" value={mutedSfx ? 0 : sfxVolume} onChange={handleSfxVolumeChange} className="volume-slider" aria-label="Sound Effects Volume" disabled={mutedSfx} /> <span className="volume-value">{mutedSfx ? 'Muted' : `${sfxVolume}%`}</span> </div> </div>
//         <div className="calm-mode"> <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Calm Mode</h3> <label className="switch"><input type="checkbox" checked={isCalmMode} onChange={toggleCalmMode} aria-label="Toggle Calm Mode" /><span className="slider round"></span></label> </div>
//       </Modal>
//       <Modal isOpen={isPlayModalOpen} onRequestClose={closePlayModal} style={{ ...modalPlayStyles, content: { ...modalPlayStyles.content, backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e", color: isCalmMode ? "#ffffff" : "#fff" } }} contentLabel="Select Difficulty" >
//         <button onClick={closePlayModal} className="modal-close-button"><X size={24} /></button>
//         <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>Select Difficulty</h2>
//         <div className="difficulty-selection"> <button onClick={() => handleDifficultySelect("easy")} className={`difficulty-button green ${selectedDifficulty === "easy" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Easy</button> <button onClick={() => handleDifficultySelect("medium")} className={`difficulty-button yellow ${selectedDifficulty === "medium" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Normal</button> <button onClick={() => handleDifficultySelect("red")} className={`difficulty-button red ${selectedDifficulty === "red" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Hard</button> </div>
//         <button onClick={handlePlay} className={`play-button ${!selectedDifficulty ? 'disabled' : ''}`} onMouseEnter={playHoverSound} disabled={!selectedDifficulty}>Accept</button>
//       </Modal>

//     </div>
//   );
// };

// export default Play;


import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
// Import ethers
import { ethers } from "ethers"; // <-- Importar ethers

// Import assets and icons
import backgroundGif from "../assets/images/play.gif";
import calmBackground from "../assets/images/calm-wallpaper.jpg";
import backgroundMusic from "../assets/audio/background-music.mp3";
import buttonHoverSound from "../assets/audio/button-hover.mp3";
import buttonClickSound from "../assets/audio/button-click.mp3";
// Importar LogOut icon
import { X, Settings, Play as PlayIcon, History as HistoryIcon, Wallet, LogOut } from "lucide-react";
import "./Play.css";

Modal.setAppElement('#root');

// Modal Styles Definitions
const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    backgroundColor: "#1e1e2e",
    border: "2px solid #4a4e69",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    minHeight: "300px",
    width: "90%",
    color: "#fff",
    textAlign: "center",
    position: "relative",
    top: "auto",
    left: "auto",
    transform: "none",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
  },
};

const modalPlayStyles = {
  ...modalStyles,
  content: {
    ...modalStyles.content,
    minHeight: "250px",
    maxWidth: "500px",
  },
};

// Componente Principal
const Play = () => {
  const navigate = useNavigate();

  // States
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isCalmMode, setIsCalmMode] = useState(false);
  const [bgVolume, setBgVolume] = useState(() => parseInt(localStorage.getItem("bgVolume"), 10) || 50);
  const [sfxVolume, setSfxVolume] = useState(() => parseInt(localStorage.getItem("sfxVolume"), 10) || 50);
  const [mutedBg, setMutedBg] = useState(() => localStorage.getItem("mutedBg") === 'true' || bgVolume === 0);
  const [mutedSfx, setMutedSfx] = useState(() => localStorage.getItem("mutedSfx") === 'true' || sfxVolume === 0);
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);

  // Refs de Áudio
  const bgAudioRef = useRef(null);
  const hoverAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  // --- Lógica de Conexão com a Carteira ---
  const connectWallet = async () => {
    console.log("Attempting to connect wallet...");
    if (window.ethereum == null) {
      console.error("MetaMask not installed; using read-only defaults");
      alert("MetaMask is not installed. Please install it to connect your wallet.");
      return;
    }
    try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        const web3Signer = await web3Provider.getSigner();
        setSigner(web3Signer);
        const address = await web3Signer.getAddress();
        console.log("Wallet connected:", address);
        setWalletAddress(address);
         window.ethereum.on('accountsChanged', handleAccountsChanged);
         window.ethereum.on('chainChanged', handleChainChanged);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      if (error.code === 4001) { alert("Connection rejected. Please connect your wallet to continue."); }
      else { alert("Failed to connect wallet. See console for details."); }
      setWalletAddress(null); setSigner(null); setProvider(null);
    }
  };
  const handleAccountsChanged = (accounts) => {
      console.log('Account changed:', accounts);
      if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          provider?.getSigner().then(setSigner).catch(console.error);
      } else {
          setWalletAddress(null); setSigner(null); console.log("Wallet disconnected.");
      }
  };
  const handleChainChanged = (chainId) => {
     console.log('Network changed to:', chainId);
     alert("Network changed. Reloading the page."); window.location.reload();
  };
  useEffect(() => {
      return () => {
          if (window.ethereum?.removeListener) {
              window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
              window.ethereum.removeListener('chainChanged', handleChainChanged);
          }
      };
  }, [provider]);
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // --- Lógica de Logout ---
  const handleLogout = () => {
    playClickSound();
    console.log("Logging out...");
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('gameCompleted');
    localStorage.removeItem('gameStarted');
    // Considerar limpar outros itens do localStorage relacionados à sessão, se houver
    navigate('/login');
  };

  // --- Lógica de Áudio ---
  useEffect(() => {
    bgAudioRef.current = new Audio(backgroundMusic);
    hoverAudioRef.current = new Audio(buttonHoverSound);
    clickAudioRef.current = new Audio(buttonClickSound);
    const bgAudio = bgAudioRef.current;
    bgAudio.loop = true;
    bgAudio.volume = mutedBg ? 0 : bgVolume / 100;
    const startMusic = () => { if (!mutedBg && bgAudio.paused) { bgAudio.play().catch(console.error); } };
    document.addEventListener("click", startMusic, { once: true });
    return () => { document.removeEventListener("click", startMusic); if (bgAudio) { bgAudio.pause(); bgAudio.currentTime = 0; } };
  }, []);
  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = mutedBg ? 0 : bgVolume / 100;
      if (!mutedBg && bgAudioRef.current.paused && bgAudioRef.current.readyState >= 3) { bgAudioRef.current.play().catch(console.error); }
      else if (mutedBg) { bgAudioRef.current.pause(); }
    }
    localStorage.setItem("bgVolume", bgVolume); localStorage.setItem("mutedBg", String(mutedBg));
  }, [bgVolume, mutedBg]);
  useEffect(() => {
    if (hoverAudioRef.current) hoverAudioRef.current.volume = mutedSfx ? 0 : sfxVolume / 100;
    if (clickAudioRef.current) clickAudioRef.current.volume = mutedSfx ? 0 : sfxVolume / 100;
    localStorage.setItem("sfxVolume", sfxVolume); localStorage.setItem("mutedSfx", String(mutedSfx));
  }, [sfxVolume, mutedSfx]);

  // --- Handlers de Volume e Mute ---
  const handleBgVolumeChange = (event) => { const v = parseInt(event.target.value, 10); setBgVolume(v); if (v === 0 && !mutedBg) setMutedBg(true); else if (v > 0 && mutedBg) setMutedBg(false); };
  const handleSfxVolumeChange = (event) => { const v = parseInt(event.target.value, 10); setSfxVolume(v); if (v === 0 && !mutedSfx) setMutedSfx(true); else if (v > 0 && mutedSfx) setMutedSfx(false); };
  const toggleBgMute = () => { setMutedBg(p => !p); playClickSound(); };
  const toggleSfxMute = () => { setMutedSfx(p => !p); playClickSound(); };

  // --- Funções de Play Sound ---
  const playHoverSound = () => { if (!mutedSfx && hoverAudioRef.current) { hoverAudioRef.current.currentTime = 0; hoverAudioRef.current.play().catch(console.error); } };
  const playClickSound = () => { if (!mutedSfx && clickAudioRef.current) { clickAudioRef.current.currentTime = 0; clickAudioRef.current.play().catch(console.error); } };

  // --- Handlers de Modal ---
  const openSettingsModal = () => { playClickSound(); setIsSettingsModalOpen(true); };
  const closeSettingsModal = () => { playClickSound(); setIsSettingsModalOpen(false); };
  const openPlayModal = () => { playClickSound(); setIsPlayModalOpen(true); };
  const closePlayModal = () => { playClickSound(); setSelectedDifficulty(null); setIsPlayModalOpen(false); };

  // --- Handlers de Jogo ---
  const handleDifficultySelect = (level) => { playClickSound(); setSelectedDifficulty(level); };
  const handlePlay = () => {
    playClickSound();
    if (!selectedDifficulty) { alert("Please select a difficulty level!"); return; }
    const userID = localStorage.getItem("userID");
    if (!userID) { alert("UserID is missing. Please log in again."); navigate('/login'); return; }
    localStorage.setItem("gameStarted", "true");
    switch (selectedDifficulty) {
      case "easy": navigate("/easy"); break;
      case "medium": navigate("/medium"); break;
      case "red": navigate("/hard"); break; // Corrigido para "red" e rota "/hard"
      default: console.error("Invalid difficulty selected:", selectedDifficulty); alert("An unexpected error occurred selecting the difficulty.");
    }
    closePlayModal();
  };

  // --- Navegação para Histórico ---
  const goToHistory = () => { playClickSound(); navigate('/history'); };

  // --- Toggle Calm Mode ---
  const toggleCalmMode = () => { playClickSound(); setIsCalmMode(prev => !prev); };


  // --- Renderização ---
  return (
    <div
      className="background-container"
      style={{ backgroundImage: `url(${isCalmMode ? calmBackground : backgroundGif})` }}
    >
      {/* Container Superior Esquerdo (Conectar Carteira) */}
      <div className="top-left-container">
        {walletAddress ? (
          <div className="wallet-connected">
            <Wallet size={18} style={{ marginRight: '6px', color: '#00d9ff' }} />
            <span>{formatAddress(walletAddress)}</span>
          </div>
        ) : (
          <button onClick={connectWallet} className="connect-wallet-button" onMouseEnter={playHoverSound}>
            <Wallet size={18} style={{ marginRight: '8px' }} /> Connect Wallet
          </button>
        )}
      </div>
      
      {/* Container Superior Direito (Logout) */}
      <div className="top-right-container">
        {/* Botão de Logout */}
        <button onClick={handleLogout} className="logout-button" onMouseEnter={playHoverSound} title="Logout">
          <LogOut size={18} />
        </button>
      </div>

      {/* Título */}
      <h1 className={`game-title ${isCalmMode ? "calm-title" : ""}`}>
        WonderCards
      </h1>

      {/* Botões Principais */}
      <div className="button-container">
        <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={openPlayModal} onMouseEnter={playHoverSound}>
            <PlayIcon size={20} style={{ marginRight: '8px' }} /> Play
        </button>
        <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={goToHistory} onMouseEnter={playHoverSound}>
            <HistoryIcon size={20} style={{ marginRight: '8px' }} /> History
        </button>
        <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={openSettingsModal} onMouseEnter={playHoverSound}>
            <Settings size={20} style={{ marginRight: '8px' }} /> Settings
        </button>
      </div>

      {/* Modal de Configurações */}
      <Modal isOpen={isSettingsModalOpen} onRequestClose={closeSettingsModal} style={{ ...modalStyles, content: { ...modalStyles.content, backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e", color: isCalmMode ? "#ffffff" : "#fff" } }} contentLabel="Game Settings" >
        <button onClick={closeSettingsModal} className="modal-close-button"><X size={24} /></button>
        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>Settings</h2>
        <div> <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Background Music</h3> <div className="volume-control"> <button onClick={toggleBgMute} className="mute-button" aria-label="Toggle Background Music Mute"><span className="volume-icon">{mutedBg ? "這" : "矧"}</span></button> <input type="range" min="0" max="100" value={mutedBg ? 0 : bgVolume} onChange={handleBgVolumeChange} className="volume-slider" aria-label="Background Music Volume" disabled={mutedBg} /> <span className="volume-value">{mutedBg ? 'Muted' : `${bgVolume}%`}</span> </div> </div>
        <div> <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Sound Effects</h3> <div className="volume-control"> <button onClick={toggleSfxMute} className="mute-button" aria-label="Toggle Sound Effects Mute"><span className="volume-icon">{mutedSfx ? "這" : "矧"}</span></button> <input type="range" min="0" max="100" value={mutedSfx ? 0 : sfxVolume} onChange={handleSfxVolumeChange} className="volume-slider" aria-label="Sound Effects Volume" disabled={mutedSfx} /> <span className="volume-value">{mutedSfx ? 'Muted' : `${sfxVolume}%`}</span> </div> </div>
        <div className="calm-mode"> <h3 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h3`}>Calm Mode</h3> <label className="switch"><input type="checkbox" checked={isCalmMode} onChange={toggleCalmMode} aria-label="Toggle Calm Mode" /><span className="slider round"></span></label> </div>
      </Modal>

       {/* Modal de Seleção de Dificuldade */}
      <Modal isOpen={isPlayModalOpen} onRequestClose={closePlayModal} style={{ ...modalPlayStyles, content: { ...modalPlayStyles.content, backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e", color: isCalmMode ? "#ffffff" : "#fff" } }} contentLabel="Select Difficulty" >
        <button onClick={closePlayModal} className="modal-close-button"><X size={24} /></button>
        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>Select Difficulty</h2>
        <div className="difficulty-selection">
          <button onClick={() => handleDifficultySelect("easy")} className={`difficulty-button green ${selectedDifficulty === "easy" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Easy</button>
          <button onClick={() => handleDifficultySelect("medium")} className={`difficulty-button yellow ${selectedDifficulty === "medium" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Normal</button>
          <button onClick={() => handleDifficultySelect("red")} className={`difficulty-button red ${selectedDifficulty === "red" ? (isCalmMode ? "calm-selected" : "selected") : ""}`} onMouseEnter={playHoverSound}>Hard</button> {/* Valor "red" aqui */}
        </div>
        <button onClick={handlePlay} className={`play-button ${!selectedDifficulty ? 'disabled' : ''}`} onMouseEnter={playHoverSound} disabled={!selectedDifficulty}>Accept</button>
      </Modal>
    </div>
  );
};

export default Play;