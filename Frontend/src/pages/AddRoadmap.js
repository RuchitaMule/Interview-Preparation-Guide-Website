import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRoadmap = () => {
    const [role, setRole] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState([{ title: "", subSteps: [{ text: "" }] }]);
    const [resources, setResources] = useState([""]);

    const navigate = useNavigate();

    const handleAddStep = () => {
        setSteps([...steps, { title: "", subSteps: [{ text: "" }] }]);
    };

    const handleStepChange = (index, value) => {
        const updatedSteps = [...steps];
        updatedSteps[index].title = value;
        setSteps(updatedSteps);
    };

    const handleSubStepChange = (stepIndex, subStepIndex, value) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].subSteps[subStepIndex].text = value;
        setSteps(updatedSteps);
    };

    const handleAddSubStep = (stepIndex) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].subSteps.push({ text: "" });
        setSteps(updatedSteps);
    };

    const handleAddResource = () => {
        setResources([...resources, ""]);
    };

    const handleResourceChange = (index, value) => {
        const updatedResources = [...resources];
        updatedResources[index] = value;
        setResources(updatedResources);
    };

    const handleSubmit = async () => {
        try {
            const roadmap = {
                role,
                title,
                description,
                steps: steps.map(step => ({
                    title: step.title,
                    subSteps: step.subSteps.map(sub => ({
                        text: sub.text,
                        completed: false
                    }))
                })),
                resources
            };

            await axios.post("http://localhost:5000/api/admin/roadmap", roadmap, { withCredentials: true });
            alert("Roadmap added successfully!");
            navigate("/admin/roadmaps");
        } catch (error) {
            console.error(error);
            alert("Failed to add roadmap.");
        }
    };

    return (
        <div>
            <h2>Add New Roadmap</h2>

            <label>Role:</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} /><br />

            <label>Title:</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} /><br />

            <label>Description:</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} /><br />

            <h4>Steps</h4>
            {steps.map((step, stepIndex) => (
                <div key={stepIndex}>
                    <input
                        type="text"
                        placeholder="Step Title"
                        value={step.title}
                        onChange={e => handleStepChange(stepIndex, e.target.value)}
                    />
                    <div>
                        {step.subSteps.map((subStep, subIndex) => (
                            <div key={subIndex}>
                                <input
                                    type="text"
                                    placeholder="Sub Step"
                                    value={subStep.text}
                                    onChange={e => handleSubStepChange(stepIndex, subIndex, e.target.value)}
                                />
                            </div>
                        ))}
                        <button onClick={() => handleAddSubStep(stepIndex)}>+ Add Sub Step</button>
                    </div>
                    <hr />
                </div>
            ))}
            <button onClick={handleAddStep}>+ Add Step</button>

            <h4>Resources</h4>
            {resources.map((resource, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Resource URL or Title"
                        value={resource}
                        onChange={e => handleResourceChange(index, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={handleAddResource}>+ Add Resource</button>

            <br /><br />
            <button onClick={handleSubmit}>Save Roadmap</button>
        </div>
    );
};

export default AddRoadmap;
