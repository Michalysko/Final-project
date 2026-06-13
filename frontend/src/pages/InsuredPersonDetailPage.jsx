import { useState, useEffect } from "react";
import { data, Link, useParams } from "react-router-dom";
import InsuredPersonDetail from '../components/InsuredPersonDetail';

function InsuredPersonDetailPage({ authToken }) {
    const { personId } = useParams();
    const [person, setPerson] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/insured-people/${personId}/`, {
            headers: {
                Authorization: `Token ${authToken}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Insured person detail request failed');
                }
                return response.json();
            })
            .then((data) => {
                setPerson(data);
            })
            .catch((error) => {
                console.error('Error loading insured person detail:', error);
                setErrorMessage('Unable to  load insured person detail.');
            });
    }, [authToken, personId]);

    return (
        <section>
            <Link className="back-link" to="/insured-people">
                Back to insured people
            </Link>

            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}
            <InsuredPersonDetail person={person} />
        </section>
    );
}

export default InsuredPersonDetailPage;