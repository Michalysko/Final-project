import { useState, useEffect } from "react";
import InsuredPersonDetail from "../components/InsuredPersonDetail";

function MyProfilePage({ authToken, t, language }) {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/my-profile/', {
            headers: {
                Authorization: `Token ${authToken}`,
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Profile request failed');
                }
                return response.json();
            })
            .then((data) => {
                setProfile(data);
            })
            .catch((error) => {
                console.error('Error loading profile:', error);
                setErrorMessage(t.noProfileLinked);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [authToken, t]);

    return (
        <section>
            <h2>{t.myProfile}</h2>
            {isLoading ? (
                <p className="loading-message">{t.loading}</p>
            ) : (
                <>
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}
                    <InsuredPersonDetail person={profile} t={t} language={language} />
                </>
            )}
        </section>
    );
}

export default MyProfilePage;

