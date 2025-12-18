import React from 'react';
import '../styles/RoadmapModal.css'; // Optional external CSS for styling

const RoadmapModal = ({ roadmap, onClose }) => {
    if (!roadmap) return null;

    return (
        <div className="roadmap-modal-overlay">
            <div className="roadmap-modal-content">
                <button className="roadmap-close-button" onClick={onClose}>✖</button>
                <h2>{roadmap.title}</h2>
                <p><strong>Role:</strong> {roadmap.role}</p>
                <p>{roadmap.description}</p>

                <h3>Steps:</h3>
                {roadmap.steps.map((step, i) => (
                    <div key={i}>
                        <h4>{step.title}</h4>
                        <ul>
                            {step.subSteps.map((sub, j) => (
                                <li key={j}>{sub.text}</li>
                            ))}
                        </ul>
                    </div>
                ))}

                {roadmap.resources.length > 0 && (
                    <>
                        <h3>Resources:</h3>
                        <ul>
                            {roadmap.resources.map((res, i) => (
                                <li key={i}>
                                    <a href={res} target="_blank" rel="noopener noreferrer">{res}</a>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default RoadmapModal;
