import { useState } from "react";

const emptyFormData = {
    name: '',
    default_amount: '',
    subject: '',
}

function InsuranceTypeForm({ authToken, onInsuranceTypeCreated }) {
    const [formData, setFormData] = useState(emptyFormData)

    const handleChange = (event) => {
        const { name, value} = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch('http://127.0.0.1:8000/api/insurance-types/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Token ${authToken}`
            },
            body: JSON.stringify({
                ...formData,
                default_amount: Number(formData.default_amount),
            }),
        })
            .then((response) => response.json())
            .then((createdInsuranceType) => {
                onInsuranceTypeCreated(createdInsuranceType);
                setFormData({...emptyFormData})
            })
            .catch((error) => {
                console.error('Error creating insurance type:', error);
            });
    };

    return (
        <form className="insured-form" onSubmit={handleSubmit}>
            <h2>Add Insurance Type</h2>

            <div className="form-grid">
                <label>
                    Name
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Default amount
                    <input 
                        type="number"
                        name="default_amount"
                        value={formData.default_amount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </label>
                <label>
                    Subject
                    <input 
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <button type="submit">Add insurance type</button>
        </form>
    );
}

export default InsuranceTypeForm;