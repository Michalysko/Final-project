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
                    <p className="demo-login-title">{t.loginAsAdministrator}</p>
                    <p>
                        <span>{t.username}</span>
                        <strong>Use your local demo username</strong>
                    </p>
                    <p>
                        <span>{t.password}</span>
                        <strong>Use your local demo password</strong>
                    </p>
                </div>

                <button type="submit">{t.login}</button>
            </form>
        </section>
    );
}

export default LoginPage;
