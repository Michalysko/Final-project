import { useEffect, useState } from "react";
import { data } from "react-router-dom";

const emptyFormData = {
    insured_person: '',
    insurance_type: '',
    amount: '',
    contract_date: '',
    valid_until: '',
};

function InsuranceContractForm({ authToken, onInsuranceContractCreated }) {
    const [formData, setFormData] = useState(emptyFormData);
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
                setInsuredPeople(data);
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
                setInsuranceTypes(data);
            })
            .catch((error) => {
                console.error('Error loading insurance types', error);
            });
    }, [authToken]);

    const handelChange = (event) => {
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

        fetch('http://127.0.0.1:8000/api/insurance-contracts/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Token ${authToken}`
            },
            body: JSON.stringify({
                ...formData,
                insured_person: Number(formData.insured_person),
                insurance_type: Number(formData.insurance_type),
                amount: Number(formData.amount),
            }),
        })
        .then((response) => response.json())
        .then((createInsuranceContract) => {
            onInsuranceContractCreated(createInsuranceContract);
            setFormData({...emptyFormData});
        })
        .catch((error) => {
            console.error('Error creating insurance contract:', error);
        });
    };

    return (
        <form className="insured-form" onSubmit={handleSubmit}>
            <h2>Add Insurance Contract</h2>

            <div className="form-grid">
                <label>
                    Insured person
                    <select
                        name="insured_person"
                        value={formData.insured_person}
                        onChange={handelChange}
                        required
                        >
                        <option value="">Select insured person</option>
                        {insuredPeople.map((person) => (
                            <option key={person.id} value={person.id}>
                                {person.first_name} {person.last_name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Insurance type
                    <select
                        name="insurance_type"
                        value={formData.insurance_type}
                        onChange={handleInsuranceTypeChange}
                        required
                    >
                        <option value="">Select insurance type</option>
                        {insuranceTypes.map((insuranceType) => (
                            <option key={insuranceType.id} value={insuranceType.id}>
                                {insuranceType.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Amount
                    <input 
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handelChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </label>
                <label>
                    Contract date
                    <input
                        type="date"
                        name="contract_date"
                        value={formData.contract_date}
                        onChange={handelChange}
                        required
                    />
                </label>
                <label>
                    Valid until
                    <input
                        type="date"
                        name="valid_until"
                        value={formData.valid_until}
                        onChange={handelChange}
                        required
                    />
                </label>
            </div>

            <button type="submit">Add contract</button>
        </form>
    );
}

export default InsuranceContractForm;