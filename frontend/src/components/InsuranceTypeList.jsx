function InsuranceTypeList({ insuranceTypes, onInsuranceTypeDelete }) { 
        if (insuranceTypes.lenght === 0) {
        return <p>No insurance types found.</p>;
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Default amount</th>
                    <th>Subject</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {insuranceTypes.map((insuranceType) => (
                    <tr key={insuranceType.id}>
                        <td>{insuranceType.name}</td>
                        <td>{insuranceType.default_amount}</td>
                        <td>{insuranceType.subject}</td>
                        <td className="actions-cell">
                            <button 
                                type="button"
                                className="danger-button"
                                onClick={() => 
                                    onInsuranceTypeDelete(insuranceType.id)
                                }
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default InsuranceTypeList;