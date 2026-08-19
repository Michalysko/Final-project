import { useState, useEffect } from "react";

import InsuranceTypeForm from "../components/InsuranceTypeForm";
import InsuranceTypeList from "../components/InsuranceTypeList";

function InsuranceTypesPage({ authToken, t }) {
    const [insuranceTypes, setInsuranceTypes] = useState([]);
    const [editingInsuranceType, setEditingInsuranceType] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/insurance-types/', {
            headers: {
                Authorization: `Token ${authToken}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setInsuranceTypes(data);
                } else if (Array.isArray(data.results)) {
                    setInsuranceTypes(data.results);
                } else {
                    setInsuranceTypes([]);
                }
            })
            .catch((error) => {
                console.error('Error loading insurance types:', error);
            });
    }, [authToken]);

    const handleInsuranceTypeCreated = (createdInsuranceType) => {
        setInsuranceTypes([...insuranceTypes, createdInsuranceType]);
    };

    const handleInsuranceTypeUpdated = (updatedInsuranceType) => {
        setInsuranceTypes(
            insuranceTypes.map((insuranceType) =>
                insuranceType.id === updatedInsuranceType.id
                    ? updatedInsuranceType
                    : insuranceType
            )
        );
        setEditingInsuranceType(null);
    }

    const handleInsuranceTypeDeleted = (insuranceTypeId) => {
        const confirmed = window.confirm(t.deleteInsuranceTypeConfirm);
        if (!confirmed) {
            return;
        }

        fetch(`http://127.0.0.1:8000/api/insurance-types/${insuranceTypeId}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Delete request failed');
                }

                setInsuranceTypes(
                    insuranceTypes.filter(
                        (insuranceType) =>
                            insuranceType.id != insuranceTypeId
                    )
                );
            })
            .catch((error) => {
                console.error('Error deleting insurance type:', error);
            });
            if (editingInsuranceType?.id === insuranceTypeId) {
                setEditingInsuranceType(null);
            }
    };
    return (
        <section>
            <InsuranceTypeForm
                key={editingInsuranceType?.id ?? 'new'}
                authToken={authToken}
                editingInsuranceType={editingInsuranceType}
                onInsuranceTypeCreated={handleInsuranceTypeCreated}
                onInsuranceTypeUpdated={handleInsuranceTypeUpdated}
                t={t}
            />
            <h2>{t.navInsuranceTypes}</h2>

            <InsuranceTypeList
                insuranceTypes={insuranceTypes}
                onInsuranceTypeEdit={setEditingInsuranceType}
                onInsuranceTypeDelete={handleInsuranceTypeDeleted}
                t={t}
            />
        </section>
    );
};

export default InsuranceTypesPage;
