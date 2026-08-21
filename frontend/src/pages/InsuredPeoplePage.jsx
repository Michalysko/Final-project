import { useState, useEffect, useCallback } from "react";

import InsuredPersonForm from '../components/InsuredPersonForm';
import InsuredPersonList from '../components/InsuredPersonList';

function InsuredPeoplePage({ authToken, t }) {
    const [insuredPeople, setInsuredPeople] = useState([]);
    const [editingPerson, setEditingPerson] = useState(null);
    const [searchData, setSearchData] = useState({
        name: '',
        address: '',
        phone_number: '',
    });
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const loadInsuredPeople = useCallback((url = null) => {
        const searchParams = new URLSearchParams();

        if (searchData.name) {
            searchParams.append('name', searchData.name);
        }

        if (searchData.address) {
            searchParams.append('address', searchData.address);
        }

        if (searchData.phone_number) {
            searchParams.append('phone_number', searchData.phone_number);
        }

        const apiUrl = url || `http://127.0.0.1:8000/api/insured-people/?${searchParams.toString()}`;

        fetch(apiUrl, {
            headers: {
                Authorization: `Token ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setInsuredPeople(data.results || data || []);
                setNextPage(data.next);
                setPreviousPage(data.previous);
            })
            .catch((error) => {
                console.error('Error loading insured people:', error);
            });
    }, [authToken, searchData]);

    useEffect(() => {
        loadInsuredPeople();
    }, [loadInsuredPeople]);

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
            <form 
                className="search-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    loadInsuredPeople();
                }}
            >
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
                <button type="submit">
                    {t.searchInsuredPeople}
                </button>
            </form>
            <h2>{t.navInsuredPeople}</h2>
            <InsuredPersonList
                insuredPeople={insuredPeople}
                onPersonEdit={handlePersonEdit}
                onPersonDelete={handlePersonDelete}
                t={t}
            />
            <div className="pagination-controls">
                <button 
                    type="button"
                    onClick={() => loadInsuredPeople(previousPage)}
                    disabled={!previousPage}
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={() => loadInsuredPeople(nextPage)}
                    disabled={!nextPage}
                >
                    Next
                </button>
            </div>
        </section>
    );
}

export default InsuredPeoplePage;


