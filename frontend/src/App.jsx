import { useState, useEffect } from 'react';
import { NavLink, Navigate, Route, Routes, data, replace } from 'react-router-dom';

import InsuranceContractsPage from './pages/InsuranceContractsPage';
import InsuranceTypesPage from './pages/InsuranceTypesPage';
import InsuredPeoplePage from './pages/InsuredPeoplePage';
import LoginPage from './pages/LoginPage';
import MyContractsPage from './pages/MyContractsPage';
import MyProfilePage from './pages/MyProfilePage';
import './App.css';

function App() {
    const [authToken, setAuthToken] = useState(
        localStorage.getItem('authToken')
    );
    const [currentUser, setCurrentUser] = useState(null);

    const handleLogin = (token) => {
        setAuthToken(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setCurrentUser(null);
    };

    useEffect(() => {
        if (!authToken) {
            setCurrentUser(null);
            return;
        }
        fetch('http://127.0.0.1:8000/api/me/', {
            headers: {
                Authorization: `Token ${authToken}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Current user request failed');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Current user:', data);
                setCurrentUser(data);
            })
            .catch((error) => {
                console.error('Error loading current user:', error);
                localStorage.removeItem('authToken');
                setAuthToken(null)
                setCurrentUser(null);
            });
    }, [authToken]);

    return (
        <main className="app">
            <section className="app-container">
                <header className='app-header'>
                    <h1>Insurance App</h1>

                    {currentUser && (
                        <p className='user-info'>
                            Logged in as {currentUser.username}
                        </p>
                    )}

                    {authToken && currentUser && (

                        <nav className='main-nav'>
                            {currentUser.is_admin ? (
                                <>
                                    <NavLink to="/insured-people">Insured People</NavLink>
                                    <NavLink to="/insurance-types">Insurance Types</NavLink>
                                    <NavLink to="/insurance-contracts">Insurance Contracts</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/my-profile">My Profile</NavLink>
                                    <NavLink to="/my-contracts">My Contracts</NavLink>
                                </>
                            )}

                            <button
                                type='button'
                                className='secondary-button'
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </nav>
                    )}
                </header>

                <Routes>
                    <Route
                        path='/login'
                        element={
                            authToken && currentUser?.is_admin ? (
                                <Navigate to="/insured-people" replace />
                            ) : authToken && currentUser ? (
                                <Navigate to="/my-profile" replace />
                            ) : (
                                <LoginPage onLogin={handleLogin} />
                            )
                        }
                    />

                    <Route
                        path='/'
                        element={
                            authToken && currentUser?.is_admin ? (
                                <Navigate to="/insured-people" replace />
                            ) : authToken && currentUser ? (
                                <Navigate to="/my-profile" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path='/insured-people'
                        element={
                            authToken && currentUser?.is_admin ? (
                                <InsuredPeoplePage authToken={authToken} />
                            ) : authToken ? (
                                <Navigate to="/my-profile" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path='/insurance-types'
                        element={
                            authToken && currentUser?.is_admin ? (
                                <InsuranceTypesPage authToken={authToken} />
                            ) : authToken ? (
                                <Navigate to="/my-profile" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path='/insurance-contracts'
                        element={
                            authToken && currentUser?.is_admin ? (
                                <InsuranceContractsPage authToken={authToken} />
                            ) : authToken ? (
                                <Navigate to="/my-profile" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path='/my-profile'
                        element={
                            authToken && currentUser ? (
                                <MyProfilePage
                                    authToken={authToken}
                                    currentUser={currentUser}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route 
                        path='/my-contracts'
                        element={
                            authToken && currentUser ? (
                                <MyContractsPage
                                    authToken={authToken}
                                    currentUser={currentUser}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                </Routes>
            </section>
        </main>
    );
}
export default App;