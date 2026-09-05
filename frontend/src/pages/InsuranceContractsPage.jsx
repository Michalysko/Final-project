import { useState, useEffect, useCallback } from "react";

import InsuranceContractForm from "../components/InsuranceContractForm";
import InsuranceContractList from "../components/InsuranceContractList";
import { apiRequest, getAuthHeaders } from '../api/apiClient'

const emptySearchData = {
    insured_person: '',
    insurance_type: '',
    subject: '',
};

function InsuranceContractsPage({ authToken, t, language }) {
    const [insuranceContracts, setInsuranceContracts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingContract, setEditingContract] = useState(null);
    const [searchData, setSearchData] = useState({ ...emptySearchData });
    const [appliedSearchData, setAppliedSearchData] = useState({ ...emptySearchData });
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const loadInsuranceContracts = useCallback((url = null) => {
        const searchParams = new URLSearchParams();

        if (appliedSearchData.insured_person) {
            searchParams.append('insured_person', appliedSearchData.insured_person);
        }

        if (appliedSearchData.insurance_type) {
            searchParams.append('insurance_type', appliedSearchData.insurance_type);
        }

        if (appliedSearchData.subject) {
            searchParams.append('subject', appliedSearchData.subject);
        }

        const apiUrl = url || `/insurance-contracts/?${searchParams.toString()}`;

        apiRequest(apiUrl, {
            headers: getAuthHeaders(authToken),
        })
            .then((data) => {
                setInsuranceContracts(data.results || data || []);
                setNextPage(data.next || null);
                setPreviousPage(data.previous || null);
                setTotalCount(data.count || data.results?.length || data.length || 0);
            })
            .catch((error) => {
                console.error('Error loading insurance contracts:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [authToken, appliedSearchData]);

    useEffect(() => {
        loadInsuranceContracts();
    }, [loadInsuranceContracts]);

    const handleInsuranceContractCreated = (createdInsuranceContract) => {
        setInsuranceContracts([
            ...insuranceContracts, createdInsuranceContract,
        ]);
    };

    const handleInsuranceContractUpdated = (updatedInsuranceContract) => {
        setInsuranceContracts(
            insuranceContracts.map((contract) =>
            contract.id === updatedInsuranceContract.id
                ? updatedInsuranceContract
                : contract
            )
        );
        setEditingContract(null);
    };

    const handleInsuranceContractDelete = (insuranceContractId) => {
        const confirmed = window.confirm(t.deleteInsuranceContractConfirm);
        if (!confirmed) {
            return;
        }
        apiRequest(`/insurance-contracts/${insuranceContractId}/`, {
                method: 'DELETE',
                headers: getAuthHeaders(authToken),
        })
            .then(() => {
                setInsuranceContracts(
                    insuranceContracts.filter(
                        (insuranceContract) => insuranceContract.id !== insuranceContractId
                    )
                );
                if (editingContract?.id === insuranceContractId) {
                    setEditingContract(null);
                }
            })
            .catch((error) => {
                console.error('Error deleting insurance contract:', error);
            });
    };

    const handlePageChange = (url) => {
        setIsLoading(true);
        loadInsuranceContracts(url);
    };

    const handleSearchChange = (event) => {
        const { name, value } = event.target;

        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setAppliedSearchData({ ...searchData });
    };

    const handleClearSearch = () => {
        setIsLoading(true);
        setSearchData({ ...emptySearchData });
        setAppliedSearchData({ ...emptySearchData });
    }

    return (
        <section>
            <InsuranceContractForm
                key={editingContract?.id ?? 'new'}
                authToken={authToken}
                editingContract={editingContract}
                onInsuranceContractCreated={handleInsuranceContractCreated}
                onInsuranceContractUpdated={handleInsuranceContractUpdated}
                t={t}
                language={language}
            />

            <form 
                className="search-form"
                onSubmit={handleSearchSubmit}
            >
                <h2>{t.searchInsuranceContracts}</h2>

                <div className="form-grid">
                    <label>
                        {t.insuredPerson}
                        <input 
                            type="text"
                            name="insured_person"
                            value={searchData.insured_person}
                            onChange={handleSearchChange}
                            placeholder={t.insuredPersonPlaceholder}
                        />
                    </label>
                    <label>
                        {t.insuranceType}
                        <input
                            type="text"
                            name="insurance_type"
                            value={searchData.insurance_type}
                            onChange={handleSearchChange}
                            placeholder={t.insuranceTypePlaceholder}
                        />
                    </label>
                    <label>
                        {t.subject}
                        <input
                            type="text"
                            name="subject"
                            value={searchData.subject}
                            onChange={handleSearchChange}
                            placeholder={t.subjectPlaceholder}
                        />
                    </label>

                </div>
                <button type="submit">
                    {t.searchInsuranceContracts}
                </button>
                <button
                    type="button"
                    className="secondary-button"
                    onClick={handleClearSearch}
                >
                    {t.clearSearch}
                </button>
            </form>

            <h2>{t.insuranceContracts}</h2>

            {!isLoading && (
                <p className="result-count">
                    {t.showingInsuranceContracts(
                        insuranceContracts.length, totalCount
                    )}
                </p>
            )}

            {isLoading ? (
                <p className="loading-message">{t.loading}</p>
            ) : (
                <InsuranceContractList
                    insuranceContracts={insuranceContracts}
                    onInsuranceContractEdit={setEditingContract}
                    onInsuranceContractDelete={handleInsuranceContractDelete}
                    t={t}
                    language={language}
                />
            )}
            <div className="pagination-controls">
                <button
                    type="button"
                    onClick={() => handlePageChange(previousPage)}
                    disabled={!previousPage || isLoading}
                >
                    {t.previous}
                </button>
                <button 
                    type="button"
                    onClick={() => handlePageChange(nextPage)}
                    disabled={!nextPage || isLoading}
                >
                    {t.next}
                </button>
            </div>
        </section>
    );
}

export default InsuranceContractsPage;




