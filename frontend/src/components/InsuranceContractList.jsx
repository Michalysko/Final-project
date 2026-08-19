import { translateInsuranceTypeName } from '../translations';

function InsuranceContractList({
    insuranceContracts,
    onInsuranceContractEdit,
    onInsuranceContractDelete,
    t,
}) {
    const canEdit = Boolean(onInsuranceContractEdit);
    const canDelete = Boolean(onInsuranceContractDelete);
    const hasActions = canEdit || canDelete;

    if (insuranceContracts.length === 0) {
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
                {insuranceContracts.map((contract) => (
                    <tr key={contract.id}>
                        <td>{contract.insured_person_name}</td>
                        <td>{translateInsuranceTypeName(contract.insurance_type_name, t)}</td>
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


