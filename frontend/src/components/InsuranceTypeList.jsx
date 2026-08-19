import { getInsuranceTypeName } from '../translations';

function InsuranceTypeList({
    insuranceTypes,
    onInsuranceTypeEdit,
    onInsuranceTypeDelete,
    t,
    language,
}) {
    if (insuranceTypes.length === 0) {
        return <p>{t.noInsuranceTypes}</p>;
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>{t.name}</th>
                    <th>{t.defaultAmount}</th>
                    <th>{t.actions}</th>
                </tr>
            </thead>
            <tbody>
                {insuranceTypes.map((insuranceType) => (
                    <tr key={insuranceType.id}>
                        <td>{getInsuranceTypeName(insuranceType, language)}</td>
                        <td>{insuranceType.default_amount}</td>
                        <td className="actions-cell">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => onInsuranceTypeEdit(insuranceType)}
                            >
                                {t.edit}
                            </button>
                            <button
                                type="button"
                                className="danger-button"
                                onClick={() =>
                                    onInsuranceTypeDelete(insuranceType.id)
                                }
                            >
                                {t.delete}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default InsuranceTypeList;
