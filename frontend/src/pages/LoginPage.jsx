import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({onLogin}) {
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

        fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then((data) => {
                localStorage.setItem('authToken', data.token);
                onLogin(data.token);
                navigate('/insured-people');
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                setErrorMessage('Invalid username or password');
            });
    };

    return (
        <section>
            <form className="insured-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                )}
                <div className="form-grid">
                    <label>
                        Username
                        <input 
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
        </section>
    );
}

export default LoginPage;