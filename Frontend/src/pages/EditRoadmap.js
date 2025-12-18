

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditRoadmap.css";

const EditRoadmap = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState([]);
    const [resources, setResources] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const fetchRoadmap = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/roadmap/${id}`);
            setTitle(res.data.title);
            setRole(res.data.role);
            setDescription(res.data.description);
            setSteps(res.data.steps);
            setResources(res.data.resources);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStepChange = (index, event) => {
        const updatedSteps = [...steps];
        updatedSteps[index].title = event.target.value;
        setSteps(updatedSteps);
    };

    const handleSubStepChange = (stepIndex, subStepIndex, event) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].subSteps[subStepIndex].text = event.target.value;
        setSteps(updatedSteps);
    };

    const handleAddStep = () => {
        setSteps([...steps, { title: "", subSteps: [{ text: "", completed: false }] }]);
    };

    const handleAddSubStep = (index) => {
        const updatedSteps = [...steps];
        updatedSteps[index].subSteps.push({ text: "", completed: false });
        setSteps(updatedSteps);
    };

    const handleRemoveStep = (index) => {
        const updatedSteps = steps.filter((_, i) => i !== index);
        setSteps(updatedSteps);
    };

    const handleRemoveSubStep = (stepIndex, subStepIndex) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].subSteps = updatedSteps[stepIndex].subSteps.filter((_, i) => i !== subStepIndex);
        setSteps(updatedSteps);
    };

    const handleAddResource = () => {
        setResources([...resources, ""]);
    };

    const handleRemoveResource = (index) => {
        const updatedResources = resources.filter((_, i) => i !== index);
        setResources(updatedResources);
    };

    const handleResourceChange = (index, event) => {
        const updatedResources = [...resources];
        updatedResources[index] = event.target.value;
        setResources(updatedResources);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/admin/roadmap/${id}`, {
                title,
                role,
                description,
                steps,
                resources,
            });
            navigate("/admin/roadmaps");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="edit-roadmap-wrapper">
            <div className="edit-roadmap-container">
                <h2>Edit Roadmap</h2>
                <form className="roadmap-form" onSubmit={handleUpdate}>
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                    <label>Role</label>
                    <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required />

                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

                    <div className="section">
                        <h3>Steps</h3>
                        {steps.map((step, index) => (
                            <div className="step-block" key={index}>
                                <input
                                    type="text"
                                    value={step.title}
                                    onChange={(e) => handleStepChange(index, e)}
                                    placeholder="Step Title"
                                />
                                <button type="button" className="remove-btn" onClick={() => handleRemoveStep(index)}>
                                    Remove Step
                                </button>
                                <div className="substeps">
                                    {step.subSteps.map((subStep, subIndex) => (
                                        <div className="substep-block" key={subIndex}>
                                            <input
                                                type="text"
                                                value={subStep.text}
                                                onChange={(e) => handleSubStepChange(index, subIndex, e)}
                                                placeholder="Sub-step"
                                            />
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => handleRemoveSubStep(index, subIndex)}
                                            >
                                                Remove Sub-step
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={() => handleAddSubStep(index)}>
                                    + Add Sub-step
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddStep}>
                            + Add Step
                        </button>
                    </div>

                    <div className="section">
                        <h3>Resources</h3>
                        {resources.map((resource, index) => (
                            <div className="resource-block" key={index}>
                                <input
                                    type="text"
                                    value={resource}
                                    onChange={(e) => handleResourceChange(index, e)}
                                    placeholder="Resource Link"
                                />
                                <button type="button" className="remove" onClick={() => handleRemoveResource(index)}>
                                    Remove Resource
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddResource}>
                            + Add Resource
                        </button>
                    </div>

                    <button className="submit-btn" type="submit">Update Roadmap</button>
                </form>
            </div>
        </div>
    );
};

export default EditRoadmap;
