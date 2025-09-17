const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    steps: [
        {
            title: { type: String, required: true },
            subSteps: [{
                text: { type: String, required: true },
                completed: { type: Boolean, default: false } // Checkbox tracking
            }],
        },
    ],
    resources: [{ type: String }],
});

// module.exports = mongoose.model("Roadmap", roadmapSchema, "roadmaps");
module.exports = mongoose.models.Roadmap || mongoose.model("Roadmap", roadmapSchema, "roadmaps");
