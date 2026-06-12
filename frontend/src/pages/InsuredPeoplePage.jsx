import { useState, useEffect } from "react";

import IsuredPersonDetail from '../components/InsuredPersonDetail';
import InsuredPersonForm from '../components/InsuredPersonForm';
import InsuredPersonList from '../components/InsuredPersonList';

function InsuredPeoplePage({ authToken }) {
    const [insuredPeople, setInsuredPeople] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
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
        if (selectedPerson?.id === updatedPerson.id) {
            setSelectedPerson(updatedPerson);
        }
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
        const confirmed = window.confirm(
            'Are you sure you want to delete this insured person?'
        );
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
                if (selectedPerson?.id === personId) {
                    setSelectedPerson(null);
                }
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
                authToken={authToken}
                editingPerson={editingPerson}
                onPersonCreated={handlePersonCreated}
                onPersonUpdated={handlePersonUpdated}
            />
            <form className="search-form">
                <h2>Search Insured People</h2>

                <div className="form-grid">
                    <label>
                        Name
                        <input
                            type="text"
                            name="name"
                            value={searchData.name}
                            onChange={handleSearchChange}
                            placeholder="First name or last name"
                        />
                    </label>
                    <label>
                        Address
                        <input
                            type="text"
                            name="address"
                            value={searchData.address}
                            onChange={handleSearchChange}
                            placeholder="Address"
                        />
                    </label>
                    <label>
                        Phone number
                        <input
                            type="text"
                            name="phone_number"
                            value={searchData.phone_number}
                            onChange={handleSearchChange}
                            placeholder="Phone number"
                        />
                    </label>
                </div>
            </form>
            <h2>Insured People</h2>
            <InsuredPersonList
                insuredPeople={filteredPeople}
                onPersonSelect={setSelectedPerson}
                onPersonEdit={handlePersonEdit}
                onPersonDelete={handlePersonDelete}
            />
            <IsuredPersonDetail person={selectedPerson}
            />
        </section>
    );
}

export default InsuredPeoplePage;

