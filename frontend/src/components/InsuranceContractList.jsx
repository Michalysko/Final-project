function InsuranceContractList({
    insuranceContracts, onInsuranceContractDelete,
}) {
    const canDelete = Boolean(onInsuranceContractDelete);

    if (insuranceContracts.lenght === 0) {
        return <p>No insurance contracts found.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Insured person</th>
                    <th>Insurance type</th>
                    <th>Subject</th>
                    <th>Amount</th>
                    <th>Contract date</th>
                    <th>Valid until</th>
                    {canDelete && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {insuranceContracts.map((contract) => (
                    <tr key={contract.id}>
                        <td>{contract.insured_person_name}</td>
                        <td>{contract.insurance_type_name}</td>
                        <td>{contract.insurance_type_subject}</td>
                        <td>{contract.amount}</td>
                        <td>{contract.contract_date}</td>
                        <td>{contract.valid_until}</td>
                        {canDelete && (
                            <td className="actions-cell">
                                <button
                                    type="button"
                                    className="danger-button"
                                    onClick={() =>
                                        onInsuranceContractDelete(contract.id)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        )}    
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default InsuranceContractList;