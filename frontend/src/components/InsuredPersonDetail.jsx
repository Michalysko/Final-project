import { translateInsuranceTypeName } from '../translations';

function InsuredPersonDetail({ person, t }) {
    if (!person) {
        return null
    }
    const insuranceContracts = person.insurance_contracts || [];

    return (
        <section className="person-detail">
            <h2>{t.insuredPersonDetail}</h2>

            <dl>
                <div>
                    <dt>{t.firstName}</dt>
                    <dd>{person.first_name}</dd>
                </div>
                <div>
                    <dt>{t.lastName}</dt>
                    <dd>{person.last_name}</dd>
                </div>
                <div>
                    <dt>{t.age}</dt>
                    <dd>{person.age}</dd>
                </div>
                <div>
                    <dt>{t.address}</dt>
                    <dd>{person.address}</dd>
                </div>
                <div>
                    <dt>{t.phoneNumber}</dt>
                    <dd>{person.phone_number}</dd>
                </div>
            </dl>

            <h3>{t.insuranceContracts}</h3>

            {insuranceContracts.length === 0 ? (
                <p>{t.noPersonContracts}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>{t.insuranceType}</th>
                            <th>{t.subject}</th>
                            <th>{t.amount}</th>
                            <th>{t.contractDate}</th>
                            <th className="nowrap">{t.validUntil}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insuranceContracts.map((contract) => (
                            <tr key={contract.id}>
                                <td>{translateInsuranceTypeName(contract.insurance_type_name, t)}</td>
                                <td>{contract.insurance_type_subject}</td>
                                <td>{contract.amount}</td>
                                <td>{contract.contract_date}</td>
                                <td>{contract.valid_until}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}

export default InsuredPersonDetail;


