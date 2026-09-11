import { getContractInsuranceTypeName } from '../translations';

function InsuranceContractList({
    insuranceContracts,
    onInsuranceContractEdit,
    onInsuranceContractDelete,
    t,
    language,
}) {
    const contracts = Array.isArray(insuranceContracts) ? insuranceContracts : [];
    const canEdit = Boolean(onInsuranceContractEdit);
    const canDelete = Boolean(onInsuranceContractDelete);
    const hasActions = canEdit || canDelete;

    if (contracts.length === 0) {
        return <p>{t.noInsuranceContracts}</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>{t.insuredPerson}</th>
                    <th>{t.insuranceType}</th>
                    <th>{t.subject}</th>
                    <th>{t.amount}</th>
                    <th>{t.contractDate}</th>
                    <th className="nowrap">{t.validUntil}</th>
                    {hasActions && <th>{t.actions}</th>}
                </tr>
            </thead>
            <tbody>
                {contracts.map((contract) => (
                    <tr key={contract.id}>
                        <td data-label={t.insuredPerson}>{contract.insured_person_name}</td>
                        <td data-label={t.insuranceType}>
                            {getContractInsuranceTypeName(contract, language)}
                        </td>
                        <td data-label={t.subject}>{contract.subject}</td>
                        <td data-label={t.amount}>{contract.amount}</td>
                        <td data-label={t.contractDate} className="nowrap">
                            {contract.contract_date}
                        </td>
                        <td data-label={t.validUntil} className='nowrap'>
                            {contract.valid_until}
                        </td>
                        {hasActions && (
                            <td data-label={t.actions} className="actions-cell">
                                {canEdit && (
                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() => onInsuranceContractEdit(contract)}
                                    >
                                        {t.edit}
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
                                        {t.delete}
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

