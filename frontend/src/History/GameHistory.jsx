import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './GameHistory.module.css';

const GameHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

     useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                     navigate('/login');
                     return;
                }
                const response = await axios.get('http://localhost:5000/api/memory/history', {
                });
                setHistory(response.data);
            } catch (err) {
                console.error("Error fetching game history:", err);
                setError('Failed to load game history. Please try again later.');
                 if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [navigate]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

     const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const handleBack = () => {
        navigate('/play');
    };


    // Adiciona um wrapper principal para o fundo da página
    return (
        <div className={styles.historyPage}> {/* // 👈 Wrapper principal adicionado */}
            <div className={styles.historyContainer}> {/* Container do conteúdo */}
                <h1 className={styles.title}>Game History</h1>
                <button onClick={handleBack} className={styles.backButton}>Back to Play</button>

                {loading && <div className={styles.loading}>Loading history...</div>}
                {error && <div className={styles.error}>{error}</div>}

                {!loading && !error && (
                     history.length === 0 ? (
                        <p className={styles.noHistory}>No game history found.</p>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.historyTable}>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Player</th>
                                        <th>Difficulty</th>
                                        <th>Time Taken</th>
                                        <th>Learning Moments</th>
                                        <th>Completed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((record) => (
                                        <tr key={record._id}>
                                            <td>{formatDate(record.gameDate)}</td>
                                            <td>{record.userID?.username || 'Unknown'}</td>
                                            <td>{record.difficulty}</td>
                                            <td>{formatTime(record.timeTaken)}</td>
                                            <td>{record.failed}</td>
                                            <td>{record.completed ? 'Yes' : 'No'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </div> // 👈 Fim do wrapper principal
    );
};

export default GameHistory;