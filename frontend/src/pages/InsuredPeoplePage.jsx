import { useState, useEffect, useCallback } from "react";

import InsuredPersonForm from '../components/InsuredPersonForm';
import InsuredPersonList from '../components/InsuredPersonList';

const emptySearchData = {
    name: '',
    address: '',
    phone_number: '',
};

function InsuredPeoplePage({ authToken, t }) {
    const [insuredPeople, setInsuredPeople] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPerson, setEditingPerson] = useState(null);
    const [searchData, setSearchData] = useState({ ...emptySearchData });
    const [appliedSearchData, setAppliedSearchData] = useState({ ...emptySearchData });
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const loadInsuredPeople = useCallback((url = null) => {
        const searchParams = new URLSearchParams();

        if (appliedSearchData.name) {
            searchParams.append('name', appliedSearchData.name);
        }

        if (appliedSearchData.address) {
            searchParams.append('address', appliedSearchData.address);
        }

        if (appliedSearchData.phone_number) {
            searchParams.append('phone_number', appliedSearchData.phone_number);
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
                setNextPage(data.next || null);
                setPreviousPage(data.previous || null);
            })
            .catch((error) => {
                console.error('Error loading insured people:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [authToken, appliedSearchData]);

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

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setAppliedSearchData({ ...searchData });
    };

    const handleClearSearch = () => {
        setIsLoading(true);
        setSearchData({ ...emptySearchData });
        setAppliedSearchData({ ...emptySearchData });
    };

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

    const handlePageChange = (url) => {
        setIsLoading(true);
        loadInsuredPeople(url);
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
                onSubmit={handleSearchSubmit}
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
                <button 
                    type="button"
                    className="secondary-button"
                    onClick={handleClearSearch}
                >
                    {t.clearSearch}
                </button>
            </form>
            <h2>{t.navInsuredPeople}</h2>
            {isLoading ? (
                <p className="loading-message">{t.loading}</p>
            ) : (
                <InsuredPersonList
                    insuredPeople={insuredPeople}
                    onPersonEdit={handlePersonEdit}
                    onPersonDelete={handlePersonDelete}
                    t={t}
                />
            )}
            <div className="pagination-controls">
                <button 
                    type="button"
                    onClick={() => handlePageChange(previousPage)}
                    disabled={!previousPage}
                >
                    {t.previous}
                </button>
                <button
                    type="button"
                    onClick={() => handlePageChange(nextPage)}
                    disabled={!nextPage}
                >
                    {t.next}
                </button>
            </div>
        </section>
    );
}

export default InsuredPeoplePage;

