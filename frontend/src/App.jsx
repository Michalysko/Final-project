import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';

import InsuranceContractsPage from './pages/InsuranceContractsPage';
import InsuranceTypesPage from './pages/InsuranceTypesPage';
import InsuredPeoplePage from './pages/InsuredPeoplePage';
import LoginPage from './pages/LoginPage';
import MyContractsPage from './pages/MyContractsPage';
import MyProfilePage from './pages/MyProfilePage';
import InsuredPersonDetailPage from './pages/InsuredPersonDetailPage';
import { translations } from './translations';
import './App.css';

function App() {
    const [authToken, setAuthToken] = useState(
        localStorage.getItem('authToken')
    );
    const [currentUser, setCurrentUser] = useState(null);
    const [language, setLanguage] = useState(
        localStorage.getItem('language') || 'en'
    );

    const t = translations[language];

    const handleLanguageChange = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
    };

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
                setCurrentUser(data);
            })
            .catch((error) => {
                console.error('Error loading current user:', error);
                localStorage.removeItem('authToken');
                setAuthToken(null);
                setCurrentUser(null);
            });
    }, [authToken]);

    return (
        <main className="app">
            <section className="app-container">
                <header className="app-header">
                    <div className="app-header-top">
                        <div>
                            <h1>{t.appTitle}</h1>

                            {currentUser && (
                                <p className="user-info">
                                    {t.loggedInAs} {currentUser.username}
                                </p>
                            )}
                        </div>

                        <div className="language-switcher" aria-label={t.languageLabel}>
                            <button
                                type="button"
                                className={language === 'cs' ? 'language-button active' : 'language-button'}
                                onClick={() => handleLanguageChange('cs')}
                            >
                                {t.czech}
                            </button>
                            <button
                                type="button"
                                className={language === 'en' ? 'language-button active' : 'language-button'}
                                onClick={() => handleLanguageChange('en')}
                            >
                                {t.english}
                            </button>
                        </div>
                    </div>

                    {authToken && currentUser && (
                        <nav className="main-nav">
                            {currentUser.is_admin ? (
                                <>
                                    <NavLink to="/insured-people">{t.navInsuredPeople}</NavLink>
                                    <NavLink to="/insurance-types">{t.navInsuranceTypes}</NavLink>
                                    <NavLink to="/insurance-contracts">{t.navInsuranceContracts}</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/my-profile">{t.navMyProfile}</NavLink>
                                    <NavLink to="/my-contracts">{t.navMyContracts}</NavLink>
                                </>
                            )}

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={handleLogout}
                            >
                                {t.logout}
                            </button>
                        </nav>
                    )}
                </header>

                <Routes>
                    <Route
                        path="/login"
                        element={
                            authToken && currentUser?.is_admin ? (
                                <Navigate to="/insured-people" replace />
                            ) : authToken && currentUser ? (
                                <Navigate to="/my-profile" replace />
                            ) : (
                                <LoginPage onLogin={handleLogin} t={t} />
                            )
                        }
                    />

                    <Route
                        path="/"
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
                        path="/insured-people"
                        element={
                            authToken && currentUser?.is_admin ? (
                                <InsuredPeoplePage authToken={authToken} t={t} />
                            ) : authToken ? (
                                <Navigate to="/my-profile" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/insured-people/:personId"
                        element={
                            authToken && currentUser?.is_admin ? (
                                <InsuredPersonDetailPage authToken={authToken} t={t} language={language} />
                            ) : authToken ? (
                                <Navigate to="/my-profile" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/insurance-types"
                        element={
                            authToken && currentUser?.is_admin ? (
                                <InsuranceTypesPage authToken={authToken} t={t} language={language} />
                            ) : authToken ? (
                                <Navigate to="/my-profile" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/insurance-contracts"
                        element={
                            authToken && currentUser?.is_admin ? (
                                <InsuranceContractsPage authToken={authToken} t={t} language={language} />
                            ) : authToken ? (
                                <Navigate to="/my-contracts" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/my-profile"
                        element={
                            authToken && currentUser ? (
                                <MyProfilePage
                                    authToken={authToken}
                                    currentUser={currentUser}
                                    t={t}
                                    language={language}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/my-contracts"
                        element={
                            authToken && currentUser ? (
                                <MyContractsPage
                                    authToken={authToken}
                                    currentUser={currentUser}
                                    t={t}
                                    language={language}
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



