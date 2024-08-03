import { Schema, Model, model, Document } from "mongoose";

// Define the FacilityPerformance interface
export interface IFacilityPerformance {
  timestamps: string[];
  active_power_kWs: number[];
  energy_kWhs: number[];
}

// Extend the IFacility interface with optional facilityPerformance
export interface IFacility extends Document {
  name: string;
  nominalPower: number;
  userId: Schema.Types.ObjectId;
  facilityPerformance?: IFacilityPerformance; // Make it optional
}

// Define the FacilityPerformance schema
const FacilityPerformanceSchema: Schema = new Schema({
  timestamps: { type: [String], required: true },
  active_power_kWs: { type: [Number], required: true },
  energy_kWhs: { type: [Number], required: true }
});

// Define the Facility schema with embedded FacilityPerformance
const FacilitySchema: Schema = new Schema({
  name: { type: String, required: true },
  nominalPower: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  facilityPerformance: FacilityPerformanceSchema // Embed FacilityPerformance
});

export const Facility: Model<IFacility> = model<IFacility>(
  "Facility",
  FacilitySchema
);
