import { useState, useEffect } from "react";
import InsuredPersonDetail from "../components/InsuredPersonDetail";
import { apiRequest, getAuthHeaders } from '../api/apiClient';

function MyProfilePage({ authToken, t, language }) {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const noProfileLinkedMessage = t.noProfileLinked

    useEffect(() => {
        if (!authToken) {
            return
        }
        apiRequest('/my-profile/', {
            headers: getAuthHeaders(authToken),
        })
            .then((data) => {
                setProfile(data);
            })
            .catch((error) => {
                console.error('Error loading profile:', error);
                setErrorMessage(noProfileLinkedMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [authToken, noProfileLinkedMessage]);

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

