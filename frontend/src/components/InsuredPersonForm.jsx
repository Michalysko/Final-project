import { useState, useEffect } from "react";

const emptyFormData = {
    first_name: '',
    last_name: '',
    age: '',
    address: '',
    phone_number: '',
}

function InsuredPersonForm({
    authToken,
    editingPerson,
    onPersonCreated,
    onPersonUpdated
}) {
    const [formData, setFormData] = useState(emptyFormData);

    useEffect(() => {
        if (editingPerson) {
            setFormData({
                first_name: editingPerson.first_name,
                last_name: editingPerson.last_name,
                age: editingPerson.age,
                address: editingPerson.address,
                phone_number: editingPerson.phone_number,
            });
        } else {
            setFormData(emptyFormData)
        }
    }, [editingPerson]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const url = editingPerson
            ? `http://127.0.0.1:8000/api/insured-people/${editingPerson.id}/`
            : 'http://127.0.0.1:8000/api/insured-people/';

        const method = editingPerson ? 'PUT' : 'POST'

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${authToken}`
            },
            body: JSON.stringify({
                ...formData,
                age: Number(formData.age),
            }),
        })
            .then((response) => response.json())
            .then((savedPerson) => {
                if (editingPerson) {
                    onPersonUpdated(savedPerson);
                } else {
                    onPersonCreated(savedPerson);
                }
                setFormData(emptyFormData);
            })
            .catch((error) => {
                console.error('Error saving insured person:', error);
            });
    };

    return (
        <form className="insured-form" onSubmit={handleSubmit}>
            <h2>{editingPerson ? 'Edit insured person' : 'Add Insured Person'}</h2>

            <div className="form-grid">
                <label>
                    First name
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Last name
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Age
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </label>
                <label>
                    Address
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Phone number
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <button type="submit">
                {editingPerson ? 'Save changes' : 'Add person'}
            </button>
        </form>

    );

}

export default InsuredPersonForm;