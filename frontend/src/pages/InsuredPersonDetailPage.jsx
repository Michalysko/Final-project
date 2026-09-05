import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import InsuredPersonDetail from '../components/InsuredPersonDetail';
import { apiRequest, getAuthHeaders } from "../api/apiClient";

function InsuredPersonDetailPage({ authToken, t, language }) {
    const { personId } = useParams();
    const [person, setPerson] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const unableToLoadPersonDetailMessage = t.unableToLoadPersonDetail;

    useEffect(() => {
        if (!authToken) {
            return;
        }
        apiRequest(`/insured-people/${personId}/`, {
            headers: getAuthHeaders(authToken),
        })
            .then((data) => {
                setPerson(data);
            })
            .catch((error) => {
                console.error('Error loading insured person detail:', error);
                setErrorMessage(unableToLoadPersonDetailMessage);
            });
    }, [authToken, personId, unableToLoadPersonDetailMessage]);

    return (
        <section>
            <Link className="back-link" to="/insured-people">
                {t.backToInsuredPeople}
            </Link>

            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}
            <InsuredPersonDetail person={person} t={t} language={language} />
        </section>
    );
}

export default InsuredPersonDetailPage;

