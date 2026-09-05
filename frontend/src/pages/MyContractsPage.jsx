import { useState, useEffect } from "react";
import InsuranceContractList from "../components/InsuranceContractList";
import { apiRequest, getAuthHeaders } from "../api/apiClient";

function MyContractsPage({ authToken, t, language }) {
    const [contracts, setContracts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const noContractsLinkedMessage = t.noContractsLinked;

    useEffect(() => {
        if (!authToken) {
            return;
        }
        apiRequest('/my-contracts/', {
            headers: getAuthHeaders(authToken),
        })
            .then((data) => {
                setContracts(data.results || data || []);
            })
            .catch((error) => {
                console.error('Error loading contracts:', error);
                setErrorMessage(noContractsLinkedMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [authToken, noContractsLinkedMessage]);

    return (
        <section>
            <h2>{t.myContracts}</h2>

            {isLoading ? (
                <p className="loading-message">{t.loading}</p>
            ) : (
                <>
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}
                    <InsuranceContractList insuranceContracts={contracts} t={t} language={language} />
                </>
            )}
        </section>
    );
}

export default MyContractsPage;

