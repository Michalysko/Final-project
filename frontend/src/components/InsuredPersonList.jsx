function InsuredPersonList({
    insuredPeople,
    onPersonSelect,
    onPersonEdit,
    onPersonDelete,
}) {
    if (insuredPeople.lenght === 0) {
        return <p>No insured people found.</p>;
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Age</th>
                    <th>Phone number</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {insuredPeople.map((person) => (
                    <tr key={person.id}
                        onClick={() => onPersonSelect(person)}
                        className="clickable-row"
                    >
                        <td>{person.first_name}</td>
                        <td>{person.last_name}</td>
                        <td>{person.age}</td>
                        <td>{person.phone_number}</td>
                        <td className="actions-cell">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onPersonEdit(person);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="danger-button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onPersonDelete(person.id)
                                }}
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

export default InsuredPersonList;