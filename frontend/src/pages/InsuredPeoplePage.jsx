import { useState, useEffect } from "react";

import InsuredPersonForm from '../components/InsuredPersonForm';
import InsuredPersonList from '../components/InsuredPersonList';

function InsuredPeoplePage({ authToken, t, language }) {
    const [insuredPeople, setInsuredPeople] = useState([]);
    const [editingPerson, setEditingPerson] = useState(null);
    const [searchData, setSearchData] = useState({
        name: '',
        address: '',
        phone_number: '',
    });

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
    }, [authToken]);

    const handlePersonCreated = (createdPerson) => {
        setInsuredPeople([...insuredPeople, createdPerson])
    };

    const handlePersonUpdated = (updatedPerson) => {
        setInsuredPeople(
            insuredPeople.map((person) =>
                person.id === updatedPerson.id ? updatedPerson : person
            )
        );
        setEditingPerson(null);
    };

    const handlePersonEdit = (person) => {
        setEditingPerson(person)
    };

    const handleSearchChange = (event) => {
        const { name, value } = event.target;

        setSearchData({
            ...searchData,
            [name]: value,
        });
    }

    const handlePersonDelete = (personId) => {
        const confirmed = window.confirm(t.deletePersonConfirm);
        if (!confirmed) {
            return;
        }
        fetch(`http://127.0.0.1:8000/api/insured-people/${personId}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Delete request failed');
                }
                setInsuredPeople(
                    insuredPeople.filter((person) => person.id !== personId)
                );
                if (editingPerson?.id === personId) {
                    setEditingPerson(null)
                }
            })
            .catch((error) => {
                console.error('Error deleting insured person:', error);
            });
    };

    const filteredPeople = insuredPeople.filter((person) => {
        const fullName = `${person.first_name} ${person.last_name}`.toLowerCase();

        const matchesName = fullName.includes(searchData.name.toLowerCase());
        const matchesAddress = person.address
            .toLowerCase()
            .includes(searchData.address.toLowerCase());
        const matchesPhone = person.phone_number
            .toLowerCase()
            .includes(searchData.phone_number.toLowerCase());

        return matchesName && matchesAddress && matchesPhone;
    });

    return (
        <section>
            <InsuredPersonForm
                key={editingPerson?.id ?? 'new'}
                authToken={authToken}
                editingPerson={editingPerson}
                onPersonCreated={handlePersonCreated}
                onPersonUpdated={handlePersonUpdated}
                t={t}
            />
            <form className="search-form">
                <h2>{t.searchInsuredPeople}</h2>

                <div className="form-grid">
                    <label>
                        {t.name}
                        <input
                            type="text"
                            name="name"
                            value={searchData.name}
                            onChange={handleSearchChange}
                            placeholder={t.namePlaceholder}
                        />
                    </label>
                    <label>
                        {t.address}
                        <input
                            type="text"
                            name="address"
                            value={searchData.address}
                            onChange={handleSearchChange}
                            placeholder={t.addressPlaceholder}
                        />
                    </label>
                    <label>
                        {t.phoneNumber}
                        <input
                            type="text"
                            name="phone_number"
                            value={searchData.phone_number}
                            onChange={handleSearchChange}
                            placeholder={t.phonePlaceholder}
                        />
                    </label>
                </div>
            </form>
            <h2>{t.navInsuredPeople}</h2>
            <InsuredPersonList
                insuredPeople={filteredPeople}
                onPersonEdit={handlePersonEdit}
                onPersonDelete={handlePersonDelete}
                t={t}
            />
        </section>
    );
}

export default InsuredPeoplePage;

