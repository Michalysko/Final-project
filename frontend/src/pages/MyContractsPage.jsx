import { useState, useEffect } from "react";
import InsuranceContractList from "../components/InsuranceContractList";

function MyContractsPage({ authToken, t, language }) {
    const [contracts, setContracts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/my-contracts/', {
            headers: {
                Authorization: `Token ${authToken}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Contracts request failed');
                }
                return response.json();
            })
            .then((data) => {
                setContracts(data);
            })
            .catch((error) => {
                console.error('Error loading contracts:', error);
                setErrorMessage(t.noContractsLinked);
            });
    }, [authToken, t]);

    return (
        <section>
            <h2>{t.myContracts}</h2>

            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}
            <InsuranceContractList insuranceContracts={contracts} t={t} language={language} />
        </section>
    );
}

export default MyContractsPage;

