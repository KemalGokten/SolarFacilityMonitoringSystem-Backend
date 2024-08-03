"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityResolver = void 0;
const facility_1 = require("../model/facility");
exports.FacilityResolver = {
    Query: {
        // Fetch all facilities for a specific user
        facilities: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { userId }) {
            try {
                if (!userId)
                    throw new Error('No userId provided');
                const facilities = yield facility_1.Facility.find({ userId });
                if (!facilities)
                    throw new Error('No facilities found');
                return {
                    success: true,
                    total: facilities.length,
                    facilities,
                };
            }
            catch (error) {
                throw error;
            }
        }),
        // Fetch a specific facility by id
        facility: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            try {
                if (!id)
                    throw new Error('No id provided');
                const facility = yield facility_1.Facility.findById(id);
                if (!facility)
                    throw new Error('No facility found');
                return facility;
            }
            catch (error) {
                throw error;
            }
        }),
    },
    Mutation: {
        // Create a new facility
        createFacility: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name, nominalPower, userId }) {
            try {
                const newFacility = new facility_1.Facility({
                    name,
                    nominalPower,
                    userId,
                    facilityPerformanceExist: false,
                });
                return yield newFacility.save();
            }
            catch (error) {
                throw error;
            }
        }),
        // Update an existing facility
        updateFacility: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id, name, nominalPower }) {
            try {
                if (!id)
                    throw new Error('No id provided');
                const facility = yield facility_1.Facility.findById(id);
                if (!facility)
                    throw new Error('No facility found');
                const updatedFacility = yield facility_1.Facility.findByIdAndUpdate(id, { name, nominalPower }, { new: true, runValidators: true });
                return updatedFacility;
            }
            catch (error) {
                throw error;
            }
        }),
        // Delete a facility
        deleteFacility: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            try {
                if (!id)
                    throw new Error('No id provided');
                const facility = yield facility_1.Facility.findById(id);
                if (!facility)
                    throw new Error('No facility found');
                const deletedFacility = yield facility_1.Facility.findByIdAndDelete(id);
                return {
                    success: true,
                    message: 'Facility deleted successfully',
                    id: deletedFacility === null || deletedFacility === void 0 ? void 0 : deletedFacility._id,
                };
            }
            catch (error) {
                throw error;
            }
        }),
    },
};
exports.default = exports.FacilityResolver;
