import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import styles from './Register.module.css'; // Usaremos este CSS atualizado

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // State para diferenciar erro de sucesso
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Limpa mensagens anteriores
    setIsError(false);
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      setMessage(response.data.message || 'Registration successful!'); // Mensagem de sucesso
      // Opcional: Redirecionar para login após sucesso
      // setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error registering user.'); // Mensagem de erro
      setIsError(true);
    }
  };

  // Função para navegar para a página de login
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    // Wrapper para aplicar o fundo gradiente
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <h2 className={styles.title}>Create Account</h2> {/* Título */}
        <form onSubmit={handleSubmit} className={styles.form}>
           {/* Grupo de Input para Username */}
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={styles.input}
              required
            />
          </div>
          {/* Grupo de Input para Password */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={styles.input}
              required
              minLength="6" // Exemplo: exigir senha mínima
            />
          </div>

           {/* Exibe a mensagem (sucesso ou erro) */}
          {message && (
            <p className={`${styles.message} ${isError ? styles.errorMessage : styles.successMessage}`}>
              {message}
            </p>
          )}

          {/* Botão de Registrar */}
          <button type="submit" className={`${styles.button} ${styles.registerButton}`}>
            Register
          </button>

           {/* Link/Botão para voltar ao Login */}
           <button type="button" onClick={handleLoginRedirect} className={`${styles.button} ${styles.backButton}`}>
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;