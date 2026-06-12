import { useState, useEffect } from "react";

import InsuranceContractForm from "../components/InsuranceContractForm";
import InsuranceContractList from "../components/InsuranceContractList";

function InsuranceContractsPage( {authToken} ) {
    const [insuranceContracts, setInsuranceContracts] = useState([]);
    const [editingContract, setEditingContract] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/insurance-contracts', {
            headers: {
                Authorization: `Token ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setInsuranceContracts(data);
            })
            .catch((error) => {
                console.error('Error loading insurance contracts:', error);
            });
    }, [authToken]);

    const handleInsuranceContractCreated = (createdInsuranceContract) => {
        setInsuranceContracts([
            ...insuranceContracts, createdInsuranceContract,
        ]);
    };

    const handleInsuranceContractUpdated = (updatedInsuranceContract) => {
        setInsuranceContracts(
            insuranceContracts.map((contract) => 
            contract.id === updatedInsuranceContract.id
                ? updatedInsuranceContract
                : contract
            )
        );
        setEditingContract(null);
    };

    const handleInsuranceContractDelete = (insuranceContractId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this insurance contract?'
        );
        if (!confirmed) {
            return;
        }
        fetch(`http://127.0.0.1:8000/api/insurance-contracts/${insuranceContractId}/`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Delete request failed');
                }
                setInsuranceContracts(
                    insuranceContracts.filter(
                        (contract) => contract.id != insuranceContractId
                    )
                );
            })
            .catch((error) => {
                console.error('Error deleting insurance contract:', error);
            });
        if (editingContract?.id === insuranceContractId) {
            setEditingContract(null);
        }
    };

    return (
        <section>
            <InsuranceContractForm
                authToken={authToken}
                editingContract={editingContract}
                onInsuranceContractCreated={handleInsuranceContractCreated}
                onInsuranceContractUpdated={handleInsuranceContractUpdated}
            />

            <h2>InsuranceContracts</h2>

            <InsuranceContractList 
                insuranceContracts={insuranceContracts}
                onInsuranceContractEdit={setEditingContract}
                onInsuranceContractDelete={handleInsuranceContractDelete}
            />
        </section>
    );
}

export default InsuranceContractsPage;