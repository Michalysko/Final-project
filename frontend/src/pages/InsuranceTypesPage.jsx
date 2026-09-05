import { useState, useEffect } from "react";

import InsuranceTypeForm from "../components/InsuranceTypeForm";
import InsuranceTypeList from "../components/InsuranceTypeList";
import { apiRequest, getAuthHeaders } from "../api/apiClient";

function InsuranceTypesPage({ authToken, t, language }) {
    const [insuranceTypes, setInsuranceTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingInsuranceType, setEditingInsuranceType] = useState(null)

    useEffect(() => {
        if (!authToken) {
            return;
        }
        apiRequest('/insurance-types/', {
            headers: getAuthHeaders(authToken),
        })
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
            })
            .finally(() => {
                setIsLoading(false);
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

        apiRequest(`/insurance-types/${insuranceTypeId}/`, {
            method: 'DELETE',
            headers: getAuthHeaders(authToken),
        })
            .then(() => {
                setInsuranceTypes(
                    insuranceTypes.filter(
                        (insuranceType) =>
                            insuranceType.id !== insuranceTypeId
                    )
                );
                if (editingInsuranceType?.id === insuranceTypeId) {
                    setEditingInsuranceType(null);
                }
            })
            .catch((error) => {
                console.error('Error deleting insurance type:', error);
            });
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
                language={language}
            />
            <h2>{t.navInsuranceTypes}</h2>

            {isLoading ? (
                <p className="loading-message">{t.loading}</p>
            ) : (
                <InsuranceTypeList
                    insuranceTypes={insuranceTypes}
                    onInsuranceTypeEdit={setEditingInsuranceType}
                    onInsuranceTypeDelete={handleInsuranceTypeDeleted}
                    t={t}
                    language={language}
                />
            )}
        </section>
    );
};

export default InsuranceTypesPage;



