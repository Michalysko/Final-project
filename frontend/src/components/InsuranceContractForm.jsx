import { getInsuranceTypeName } from '../translations';
import { useEffect, useState } from "react";

const emptyFormData = {
    insured_person: '',
    insurance_type: '',
    subject: '',
    amount: '',
    contract_date: '',
    valid_until: '',
};

const getInitialFormData = (editingContract) => {
    if (!editingContract) {
        return { ...emptyFormData };
    }
    return {
        insured_person: editingContract.insured_person || '',
        insurance_type: editingContract.insurance_type || '',
        subject: editingContract.subject || '',
        amount: editingContract.amount || '',
        contract_date: editingContract.contract_date || '',
        valid_until: editingContract.valid_until || '',
    };
};

const getApiErrorMessage = (errorData, fallbackMessage) => {
    if (!errorData || typeof errorData !== 'object') {
        return fallbackMessage;
    }

    const messages = Object.entries(errorData).flatMap(([field, errors]) => {
        if (Array.isArray(errors)) {
            return errors.map((error) => `${field}: ${error}`);
        }
        return [`${field}: ${errors}`];
    });

    return messages.join(' ');
}


const getApiList = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data.results)) {
        return data.results;
    }

    return [];
};

function InsuranceContractForm({
    authToken,
    onInsuranceContractCreated,
    editingContract,
    onInsuranceContractUpdated,
    t,
    language,
}) {
    const [formData, setFormData] = useState(() =>
        getInitialFormData(editingContract)
    );
    const [errorMessage, setErrorMessage] = useState('');
    const [insuredPeople, setInsuredPeople] = useState([]);
    const [insuranceTypes, setInsuranceTypes] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/insured-people/', {
            headers: {
                Authorization: `Token ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setInsuredPeople(getApiList(data));
            })
            .catch((error) => {
                console.error('Error loading insured people:', error);
            });

        fetch('http://127.0.0.1:8000/api/insurance-types/', {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const loadedInsuranceTypes = getApiList(data).sort((firstType, secondType) =>
                    getInsuranceTypeName(firstType, language).localeCompare(getInsuranceTypeName(secondType, language))
                );

                setInsuranceTypes(loadedInsuranceTypes);
            })
            .catch((error) => {
                console.error('Error loading insurance types', error);
            });
    }, [authToken, language]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleInsuranceTypeChange = (event) => {
        const selectedInsuranceTypeId = event.target.value;
        const selectedInsuranceType = insuranceTypes.find(
            (insuranceType) => insuranceType.id === Number(selectedInsuranceTypeId)
        );

        setFormData({
            ...formData,
            insurance_type: selectedInsuranceTypeId,
            amount: selectedInsuranceType
                ? selectedInsuranceType.default_amount
                : '',
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setErrorMessage('');

        if (formData.contract_date && formData.valid_until) {
            const contractDate = new Date(formData.contract_date);
            const validUntil = new Date(formData.valid_until);

            if (validUntil <= contractDate) {
                alert('Valid until must be later than contract date.');
                return;
            }
        }

        const url = editingContract
            ? `http://127.0.0.1:8000/api/insurance-contracts/${editingContract.id}/`
            : 'http://127.0.0.1:8000/api/insurance-contracts/';

        const method = editingContract ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${authToken}`
            },
            body: JSON.stringify({
                ...formData,
                insured_person: Number(formData.insured_person),
                insurance_type: Number(formData.insurance_type),
                amount: Number(formData.amount),
            }),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    throw new Error(
                        getApiErrorMessage(errorData, 'Unable to save insurance contract.')
                    );
                });
            }
            return response.json()
        })

        .then((savedInsuranceContract) => {
            if (editingContract) {
                onInsuranceContractUpdated(savedInsuranceContract);
            } else {
                onInsuranceContractCreated(savedInsuranceContract);
            }
            setFormData({ ...emptyFormData });
        })
        .catch((error) => {
            console.error('Error creating insurance contract:', error);
            setErrorMessage(error.message || 'Unable to save insurance contract.')
        });
    };

    return (
        <form className="insured-form" onSubmit={handleSubmit}>
            <h2>{editingContract ? t.editInsuranceContract : t.addInsuranceContract}</h2>
            {errorMessage && (
                <p className='error-message'>{errorMessage}</p>
            )}

            <div className="form-grid">
                <label>
                    {t.insuredPerson}
                    <select
                        name="insured_person"
                        value={formData.insured_person}
                        onChange={handleChange}
                        required
                    >
                        <option value="">{t.selectInsuredPerson}</option>
                        {insuredPeople.map((person) => (
                            <option key={person.id} value={person.id}>
                                {person.first_name} {person.last_name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    {t.insuranceType}
                    <select
                        name="insurance_type"
                        value={formData.insurance_type}
                        onChange={handleInsuranceTypeChange}
                        required
                    >
                        <option value="">{t.selectInsuranceType}</option>
                        {insuranceTypes.map((insuranceType) => (
                            <option key={insuranceType.id} value={insuranceType.id}>
                                {getInsuranceTypeName(insuranceType, language)}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    {t.subject}
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        minLength={2}
                        maxLength={255}
                        required
                    />
                </label>
                <label>
                    {t.amount}
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="0"
                        max="100000000"
                        step="0.01"
                        required
                    />
                </label>
                <label>
                    {t.contractDate}
                    <input
                        type="date"
                        name="contract_date"
                        value={formData.contract_date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    {t.validUntil}
                    <input
                        type="date"
                        name="valid_until"
                        value={formData.valid_until}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <button type="submit">
                {editingContract ? t.saveChanges : t.addContract}
            </button>
        </form>
    );
}

export default InsuranceContractForm;
