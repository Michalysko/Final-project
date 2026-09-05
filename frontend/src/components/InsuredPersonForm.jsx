import { useState } from "react";
import { apiRequest, getJsonHeaders } from "../api/apiClient";

const emptyFormData = {
    first_name: '',
    last_name: '',
    age: '',
    address: '',
    phone_number: '',
    username: '',
    password: '',
}

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

const getInitialFormData = (editingPerson) => {
    if (!editingPerson) {
        return { ...emptyFormData };
    }
    return {
        first_name: editingPerson.first_name || '',
        last_name: editingPerson.last_name || '',
        age: editingPerson.age || '',
        address: editingPerson.address || '',
        phone_number: editingPerson.phone_number || '',
        username: '',
        password: '',
    };
};

function InsuredPersonForm({
    authToken,
    editingPerson,
    onPersonCreated,
    onPersonUpdated,
    t,
}) {

    const [formData, setFormData] = useState(() =>
        getInitialFormData(editingPerson)
    );
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');

        const url = editingPerson
            ? `/insured-people/${editingPerson.id}/`
            : '/insured-people/';

        const method = editingPerson ? 'PUT' : 'POST';

        const requestData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            age: Number(formData.age),
            address: formData.address,
            phone_number: formData.phone_number,
        };

        if (!editingPerson) {
            requestData.username = formData.username;
            requestData.password = formData.password;
        }

        apiRequest(url, {
            method,
            headers: getJsonHeaders(authToken), 
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(
                            getApiErrorMessage(errorData, t.unableToSavePerson)
                        );
                    });
                }
                return response.json();
            })

            .then((savedPerson) => {
                if (editingPerson) {
                    onPersonUpdated(savedPerson);
                } else {
                    onPersonCreated(savedPerson);
                }
                setFormData({ ...emptyFormData });
            })
            .catch((error) => {
                console.error('Error saving insured person:', error);
                setErrorMessage(error.message || t.unableToSavePerson);
            });
    };

    return (
        <form className="insured-form" onSubmit={handleSubmit}>
            <h2>{editingPerson ? t.editInsuredPerson : t.addInsuredPerson}</h2>

            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}

            <div className="form-grid">
                <label>
                    {t.firstName}
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        minLength={2}
                        maxLength={100}
                        required
                    />
                </label>
                <label>
                    {t.lastName}
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        minLength={2}
                        maxLength={100}
                        required
                    />
                </label>
                <label>
                    {t.age}
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min={0}
                        max={120}
                        required
                    />
                </label>
                <label>
                    {t.address}
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        minLength={5}
                        maxLength={255}
                        required
                    />
                </label>
                <label>
                    {t.phoneNumber}
                    <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        pattern="^[0-9+ ]{9,20}$"
                        title="Use 9 to 20 characters: numbers, plus sign and spaces only."
                        required
                    />
                </label>

                {!editingPerson && (
                    <div className="form-grid-spacer" aria-hidden="true"></div>
                )}

                {!editingPerson && (
                    <>
                        <label>
                            {t.username}
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={150}
                                required
                            />
                        </label>
                        <label>
                            {t.password}
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                        </label>
                    </>
                )}
            </div>

            <button type="submit">
                {editingPerson ? t.saveChanges : t.addPerson}
            </button>
        </form>

    );

}

export default InsuredPersonForm;
