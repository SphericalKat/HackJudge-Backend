const mongoose = require('mongoose');
const {EventsSchema:eventsSchema} = require('../models/events');

const viewReviewSchema = mongoose.Schema({
    qualifiedTeams: {type: Number, required: true},
    evaluatedTeams: {type: Number, required: true} 
});

module.exports = mongoose.model("V_R",viewReviewSchema);
