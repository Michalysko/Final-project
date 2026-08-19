import { useState, useEffect } from "react";

import InsuranceContractForm from "../components/InsuranceContractForm";
import InsuranceContractList from "../components/InsuranceContractList";

function InsuranceContractsPage({ authToken, t }) {
    const [insuranceContracts, setInsuranceContracts] = useState([]);
    const [editingContract, setEditingContract] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/insurance-contracts/', {
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
        const confirmed = window.confirm(t.deleteInsuranceContractConfirm);
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
                key={editingContract?.id ?? 'new'}
                authToken={authToken}
                editingContract={editingContract}
                onInsuranceContractCreated={handleInsuranceContractCreated}
                onInsuranceContractUpdated={handleInsuranceContractUpdated}
                t={t}
            />

            <h2>{t.insuranceContracts}</h2>

            <InsuranceContractList
                insuranceContracts={insuranceContracts}
                onInsuranceContractEdit={setEditingContract}
                onInsuranceContractDelete={handleInsuranceContractDelete}
                t={t}
            />
        </section>
    );
}

export default InsuranceContractsPage;
