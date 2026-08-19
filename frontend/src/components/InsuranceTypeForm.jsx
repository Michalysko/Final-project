import { useEffect, useState } from "react";

const emptyFormData = {
    name: '',
    default_amount: '',
    subject: '',
}

function InsuranceTypeForm({
    authToken,
    editingInsuranceType,
    onInsuranceTypeCreated,
    onInsuranceTypeUpdated,
    t,
}) {
    const [formData, setFormData] = useState({ ...emptyFormData });

    useEffect(() => {
        if (editingInsuranceType) {
            setFormData({
                name: editingInsuranceType.name || '',
                default_amount: editingInsuranceType.default_amount || '',
                subject: editingInsuranceType.subject || '',
            });
        } else {
            setFormData({ ...emptyFormData });
        }
    }, [editingInsuranceType]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const url = editingInsuranceType
            ? `http://127.0.0.1:8000/api/insurance-types/${editingInsuranceType.id}/`
            : 'http://127.0.0.1:8000/api/insurance-types/';

        const method = editingInsuranceType ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${authToken}`
            },
            body: JSON.stringify({
                ...formData,
                default_amount: Number(formData.default_amount),
            }),
        })
            .then((response) => response.json())
            .then((savedInsuranceType) => {
                if (editingInsuranceType) {
                    onInsuranceTypeUpdated(savedInsuranceType);
                } else {
                    onInsuranceTypeCreated(savedInsuranceType);
                }
                setFormData({ ...emptyFormData });
            })
            .catch((error) => {
                console.error('Error creating insurance type:', error);
            });
    };

    return (
        <form className="insured-form" onSubmit={handleSubmit}>
            <h2>{editingInsuranceType ? t.editInsuranceType : t.addInsuranceType}</h2>

            <div className="form-grid">
                <label>
                    {t.name}
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    {t.defaultAmount}
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
                    {t.subject}
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <button type="submit">
                {editingInsuranceType ? t.saveChanges : t.addInsuranceTypeButton}
            </button>
        </form>
    );
}

export default InsuranceTypeForm;
