
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AptitudeStart = () => {
    const navigate = useNavigate();

    const handleStart = (difficulty) => {
        navigate(`/aptitude/quiz/${difficulty}`);
    };

    const levels = [
        {
            label: "Easy",
            value: "easy",
            color: "green",
            description: "Basic level aptitude questions to get started."
        },
        {
            label: "Medium",
            value: "medium",
            color: "yellow",
            description: "Challenge yourself with medium difficulty questions."
        },
        {
            label: "Hard",
            value: "hard",
            color: "red",
            description: "Test your skills with hard aptitude questions."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex flex-col items-center py-14 px-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center flex items-center gap-2">
                <span role="img" aria-label="target">🎯</span> Practice Aptitude Questions
            </h1>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl">
                {levels.map((level, index) => (
                    <div
                        key={index}
                        className={`p-6 rounded-2xl shadow-md border-2 border-${level.color}-300 bg-${level.color}-50 text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1`}
                    >
                        <h2 className={`text-2xl font-semibold text-${level.color}-700 mb-3`}>
                            {level.label}
                        </h2>
                        <p className="text-gray-700 mb-6">{level.description}</p>
                        <button
                            onClick={() => handleStart(level.value)}
                            className={`bg-${level.color}-500 hover:bg-${level.color}-600 text-white py-2 px-6 rounded-full transition duration-300`}
                        >
                            Start {level.label}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AptitudeStart;
