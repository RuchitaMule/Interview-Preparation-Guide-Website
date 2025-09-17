import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ReviewQuizPage = () => {
    const { attemptId } = useParams();
    const [quizData, setQuizData] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/quiz/review-quiz/${attemptId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setQuizData(res.data);
            } catch (error) {
                console.error("Error fetching quiz review", error);
            }
        };

        fetchQuiz();
    }, [attemptId]);

    if (!quizData) return <p>Loading...</p>;

    return (
        <div>
            <h2>Review: {quizData.selectedOption}</h2>
            {quizData.questions.map((q, index) => (
                <div key={index} className="review-question">
                    <p><strong>Q{index + 1}:</strong> {q.questionText}</p>
                    <ul>
                        {q.options.map((option, i) => (
                            <li key={i} style={{ color: option === q.correctAnswer ? 'green' : option === q.selectedAnswer ? 'red' : 'black' }}>
                                {option}
                            </li>
                        ))}
                    </ul>
                    <p><strong>Your Answer:</strong> {q.selectedAnswer}</p>
                    <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                    <p><em>{q.explanation}</em></p>
                </div>
            ))}
        </div>
    );
};

export default ReviewQuizPage;
