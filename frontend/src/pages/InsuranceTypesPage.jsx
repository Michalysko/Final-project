import { useState, useEffect } from "react";

import InsuranceTypeForm from "../components/InsuranceTypeForm";
import InsuranceTypeList from "../components/InsuranceTypeList";

function InsuranceTypesPage({ authToken }) {
    const [insuranceTypes, setInsuranceTypes] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/insurance-types/', {
            headers: {
                Authorization: `Token ${authToken}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Loaded insurance types:', data)

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

    const handleInsuranceTypeDeleted = (insuranceTypeId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this insurance type?'
        );
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
    };
    return (
        <section>
            <InsuranceTypeForm
                authToken={authToken}
                onInsuranceTypeCreated={handleInsuranceTypeCreated}
            />
            <h2>Insurance Types</h2>

            <InsuranceTypeList
                insuranceTypes={insuranceTypes}
                onInsuranceTypeDelete={handleInsuranceTypeDeleted}
            />
        </section>
    );
};

export default InsuranceTypesPage;