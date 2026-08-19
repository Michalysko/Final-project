import { Link } from "react-router-dom";

function InsuredPersonList({
    insuredPeople,
    onPersonEdit,
    onPersonDelete,
    t,
}) {
    if (insuredPeople.length === 0) {
        return <p>{t.noInsuredPeople}</p>;
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>{t.firstName}</th>
                    <th>{t.lastName}</th>
                    <th>{t.age}</th>
                    <th>{t.phoneNumber}</th>
                    <th>{t.actions}</th>
                </tr>
            </thead>
            <tbody>
                {insuredPeople.map((person) => (
                    <tr key={person.id}>
                        <td>{person.first_name}</td>
                        <td>{person.last_name}</td>
                        <td>{person.age}</td>
                        <td>{person.phone_number}</td>
                        <td className="actions-cell">
                            <Link
                                className="secondary-button action-link"
                                to={`/insured-people/${person.id}`}
                            >
                                {t.detail}
                            </Link>
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => onPersonEdit(person)}
                            >
                                {t.edit}
                            </button>
                            <button
                                type="button"
                                className="danger-button"
                                onClick={() => onPersonDelete(person.id)}
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

export default InsuredPersonList;
