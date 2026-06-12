import { useState, useEffect } from "react";
import InsuranceContractList from "../components/InsuranceContractList";

function MyContractsPage({ authToken }) {
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
                setErrorMessage('No contracts are linked to this account.');
            });
    }, [authToken]);

    return (
        <section>
            <h2>My Contracts</h2>
            
            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}
            <InsuranceContractList insuranceContracts={contracts} />
        </section>
    );
}

export default MyContractsPage;