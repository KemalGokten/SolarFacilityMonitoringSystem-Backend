"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facility = void 0;
const mongoose_1 = require("mongoose");
// Define the FacilityPerformance schema
const FacilityPerformanceSchema = new mongoose_1.Schema({
    timestamps: { type: [String], required: true },
    active_power_kWs: { type: [Number], required: true },
    energy_kWhs: { type: [Number], required: true }
});
// Define the Facility schema with embedded FacilityPerformance
const FacilitySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    nominalPower: { type: Number, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    facilityPerformance: FacilityPerformanceSchema // Embed FacilityPerformance
});
exports.Facility = (0, mongoose_1.model)("Facility", FacilitySchema);
