function InsuranceContractList({
    insuranceContracts,
    onInsuranceContractEdit,
    onInsuranceContractDelete,
}) {
    const canEdit = Boolean(onInsuranceContractEdit);
    const canDelete = Boolean(onInsuranceContractDelete);
    const hasActions = canEdit || canDelete;

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
                    {hasActions && <th>Actions</th>}
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
                        {hasActions && (
                            <td className="actions-cell">
                                {canEdit && (
                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() => onInsuranceContractEdit(contract)}
                                    >
                                        Edit
                                    </button>
                                )}
                                {canDelete && (
                                    <button
                                        type="button"
                                        className="danger-button"
                                        onClick={() =>
                                            onInsuranceContractDelete(contract.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default InsuranceContractList;