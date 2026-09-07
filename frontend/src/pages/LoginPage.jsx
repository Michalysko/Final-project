import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/apiClient";

function LoginPage({ onLogin, t }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');

        apiRequest('/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((data) => {
                localStorage.setItem('authToken', data.token);
                onLogin(data.token);
                navigate('/insured-people');
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                setErrorMessage(t.invalidLogin);
            });
    };

    return (
        <section className="login-page">
            <form className="insured-form login-form" onSubmit={handleSubmit}>
                <div className="login-header">
                    <h2>{t.login}</h2>
                </div>

                {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                )}

                <div className="form-grid login-grid">
                    <label>
                        {t.username}
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        {t.password}
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                <div className="demo-login-box">
                    <p className="demo-login-title">{t.demoAccess}</p>

                    <div className="demo-account">
                        <p className="demo-account-role">{t.demoAdmin}</p>
                        <p>
                            <span>{t.username}</span>
                            <strong>demo_admin</strong>
                        </p>
                        <p>
                            <span>{t.password}</span>
                            <strong>superpassword2026</strong>
                        </p>
                    </div>

                    <div className="demo-account">
                        <p className="demo-account-role">{t.demoClient}</p>
                        <p>
                            <span>{t.username}</span>
                            <strong>demo_client</strong>
                        </p>
                        <p>
                            <span>{t.password}</span>
                            <strong>clientpassword2026</strong>
                        </p>
                    </div>
                    <p className="demo-login-note">{t.demoBackendNote}</p>
                        
                </div>

                <button type="submit">{t.login}</button>
            </form>
        </section>
    );
}

export default LoginPage;
