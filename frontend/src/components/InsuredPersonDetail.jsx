function InsuredPersonDetail({ person }) {
    if (!person) {
        return null
    }
    const insuranceContracts = person.insurance_contracts || [];

    return (
        <section className="person-detail">
            <h2>Insured person detail</h2>

            <dl>
                <div>
                    <dt>First name</dt>
                    <dd>{person.first_name}</dd>
                </div>
                <div>
                    <dt>Last name</dt>
                    <dd>{person.last_name}</dd>
                </div>
                <div>
                    <dt>Age</dt>
                    <dd>{person.age}</dd>
                </div>
                <div>
                    <dt>Address</dt>
                    <dd>{person.address}</dd>
                </div>
                <div>
                    <dt>Phone number</dt>
                    <dd>{person.phone_number}</dd>
                </div>
            </dl>

            <h3>Insurance Contracts</h3>

            {insuranceContracts.length === 0 ? (
                <p>No insurance contract found for this person.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Insurance type</th>
                            <th>Subject</th>
                            <th>Amount</th>
                            <th>Contract date</th>
                            <th>Valid until</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insuranceContracts.map((contract) => (
                                <tr key={contract.id}>
                                <td>{contract.insurance_type_name}</td>
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