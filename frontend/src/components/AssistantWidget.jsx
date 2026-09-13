import { useState } from "react";

const assistantTopics = [
    {
        id: 'admin',
        questionKey: 'assistantAdminQuestion',
        answerKey: 'assistantAdminAnswer',
    },
    {
        id: 'client',
        questionKey: 'assistantClientQuestion',
        answerKey: 'assistantClientAnswer',
    },
    {
        id: 'insuredPeople',
        questionKey: 'assistantInsuredPeopleQuestion',
        answerKey: 'assistantInsuredPeopleAnswer',
    },
    {
        id: 'contracts',
        questionKey: 'assistantContractsQuestion',
        answerKey: 'assistantContractsAnswer',
    },
    {
        id: 'technologies',
        questionKey: 'assistantTechnologiesQuestion',
        answerKey: 'assistantTechnologiesAnswer',
    },
    {
        id: 'author',
        questionKey: 'assistantAuthorQuestion',
        answerKey: 'assistantAuthorAnswer',
    },
];

function AssistantWidget({ t }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(assistantTopics[0]);

    return (
        <aside className={isOpen ? 'assistant-widget open' : 'assistant-widget'}>
            {isOpen && (
                <div className="assistant-panel">
                    <div className="assistant-header">
                        <div>
                            <p className="assistant-label">{t.assistantLabel}</p>
                            <h2>{t.assistantTitle}</h2>
                        </div>

                        <button
                            type="button"
                            className="assistant-close-button"
                            onClick={() => setIsOpen(false)}
                        >
                            x
                        </button>
                    </div>

                    <p className="assistant-intro">{t.assistantIntro}</p>

                    <div className="assistant-topics">
                        {assistantTopics.map((topic) => (
                            <button 
                                key={topic.id}
                                type="button"
                                className={
                                    selectedTopic.id === topic.id
                                        ? 'assistant-topic-button active'
                                        : 'assistant-topic-button'
                                }
                                onClick={() => setSelectedTopic(topic)}
                            >
                                {t[topic.questionKey]}
                            </button>
                        ))}
                    </div>

                    <div className="assistant-answer">
                        <p>{t[selectedTopic.answerKey]}</p>

                        {selectedTopic.id === 'author' && (
                            <div className="assistant-links">
                                <a 
                                    href="https://michalwebdeveloper.cz"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {t.portfolio}
                                </a>
                                <a 
                                    href="https://github.com/Michalysko"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    GitHub
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!isOpen && (
                <button
                    type="button"
                    className="assistant-toggle-button"
                    onClick={() => setIsOpen(true)}
                >
                    {t.assistantButton}
                </button>
            )}
        </aside>
    );
}

export default AssistantWidget;