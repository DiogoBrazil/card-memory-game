// import { StrictMode, useState } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './Login/Login';
// import Register from './Login/Register';
// import Play from './MemoryCardGame/Play';
// import Easy from './MemoryCardGame/MemoryEasy';
// import Medium from './MemoryCardGame/MemoryMedium';
// import MemoryCardGame from './MemoryCardGame/MemoryCardGame';
// import Congratulations from "./MemoryCardGame/Congratulation";
// import CongtEasy from "./MemoryCardGame/Congratseasy";
// import CongtNormal from "./MemoryCardGame/Congratsnormal";
// import GameHistory from './History/GameHistory'; // <-- Importar o novo componente

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//   const handleLogin = () => {
//     setIsAuthenticated(true);
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* ... (rotas existentes: /login, /register, /congratulations, etc.) ... */}
//         <Route path="/login" element={<Login onLogin={handleLogin} />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/congratulations"
//           element={isAuthenticated ? <Congratulations /> : <Navigate to="/login" />}
//         />
//         <Route path="/congt-easy"
//           element={isAuthenticated ? <CongtEasy /> : <Navigate to="/login" />}
//         />
//         <Route path="/congt-normal"
//           element={isAuthenticated ? <CongtNormal /> : <Navigate to="/login" />}
//         />
//         <Route path="/easy"
//           element={isAuthenticated ? <Easy /> : <Navigate to="/login" />}
//         />
//         <Route path="/medium"
//           element={isAuthenticated ? <Medium /> : <Navigate to="/login" />}
//         />
//          <Route path="/memory-card-game"
//           element={isAuthenticated ? <MemoryCardGame /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/play"
//           element={isAuthenticated ? <Play /> : <Navigate to="/login" />}
//         />

//         {/* Rota para o Histórico */}
//         <Route
//             path="/history"
//             element={isAuthenticated ? <GameHistory /> : <Navigate to="/login" />}
//         />

//         <Route path="/" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// };

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Login/Register';
import Play from './MemoryCardGame/Play';
import Easy from './MemoryCardGame/MemoryEasy';
import Medium from './MemoryCardGame/MemoryMedium';
// import MemoryCardGame from './MemoryCardGame/MemoryCardGame'; // <-- REMOVER OU COMENTAR ESTA LINHA
import MemoryCardHard from './MemoryCardGame/MemoryCardHard'; // <-- IMPORTAR O NOVO COMPONENTE
import Congratulations from "./MemoryCardGame/Congratulation";
import CongtEasy from "./MemoryCardGame/Congratseasy";
import CongtNormal from "./MemoryCardGame/Congratsnormal";
import GameHistory from './History/GameHistory';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {/* ... (rotas /login, /register, /congratulations, etc.) ... */}
         <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/congratulations"
          element={isAuthenticated ? <Congratulations /> : <Navigate to="/login" />}
        />
        <Route path="/congt-easy"
          element={isAuthenticated ? <CongtEasy /> : <Navigate to="/login" />}
        />
        <Route path="/congt-normal"
          element={isAuthenticated ? <CongtNormal /> : <Navigate to="/login" />}
        />
        <Route path="/easy"
          element={isAuthenticated ? <Easy /> : <Navigate to="/login" />}
        />
        <Route path="/medium"
          element={isAuthenticated ? <Medium /> : <Navigate to="/login" />}
        />
        <Route
          path="/play"
          element={isAuthenticated ? <Play /> : <Navigate to="/login" />}
        />
         <Route
            path="/history"
            element={isAuthenticated ? <GameHistory /> : <Navigate to="/login" />}
        />

        {/* Rota Atualizada para Hard */}
        <Route
          path="/hard" // <-- ATUALIZADO O CAMINHO DA ROTA
          element={isAuthenticated ? <MemoryCardHard /> : <Navigate to="/login" />} // <-- USA O NOVO COMPONENTE
        />

        {/* Rota Raiz */}
        <Route path="/" element={<Navigate to="/login" />} />

         {/* Opcional: Rota de fallback para /memory-card-game se quiser manter compatibilidade temporária */}
         {/* <Route path="/memory-card-game" element={<Navigate to="/hard" />} /> */}

      </Routes>
    </Router>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);