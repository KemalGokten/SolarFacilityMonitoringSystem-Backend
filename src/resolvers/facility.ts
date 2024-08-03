import {Facility} from '../model/facility';

interface Args {
  id: string;
  name: string;
  nominalPower: number;
  userId: string;
}

export const FacilityResolver = {
  Query: {
    // Fetch all facilities for a specific user
    facilities: async (_: any, { userId }: { userId: string }) => {
      try {
        if (!userId) throw new Error('No userId provided');
        const facilities = await Facility.find({ userId });
        if (!facilities) throw new Error('No facilities found');
        return {
          success: true,
          total: facilities.length,
          facilities,
        };
      } catch (error) {
        throw error;
      }
    },

    // Fetch a specific facility by id
    facility: async (_: any, { id }: { id: string }) => {
      try {
        if (!id) throw new Error('No id provided');
        const facility = await Facility.findById(id);
        if (!facility) throw new Error('No facility found');
        return facility;
      } catch (error) {
        throw error;
      }
    },
  },

  Mutation: {
    // Create a new facility
    createFacility: async (_: any, { name, nominalPower, userId }: Args) => {
      try {
        const newFacility = new Facility({
          name,
          nominalPower,
          userId,
          facilityPerformanceExist: false,
        });
        return await newFacility.save();
      } catch (error) {
        throw error;
      }
    },

    // Update an existing facility
    updateFacility: async (_: any, { id, name, nominalPower }: { id: string; name?: string; nominalPower?: number }) => {
      try {
        if (!id) throw new Error('No id provided');
        const facility = await Facility.findById(id);
        if (!facility) throw new Error('No facility found');
        const updatedFacility = await Facility.findByIdAndUpdate(
          id,
          { name, nominalPower },
          { new: true, runValidators: true }
        );
        return updatedFacility;
      } catch (error) {
        throw error;
      }
    },

    // Delete a facility
    deleteFacility: async (_: any, { id }: { id: string }) => {
      try {
        if (!id) throw new Error('No id provided');
        const facility = await Facility.findById(id);
        if (!facility) throw new Error('No facility found');
        const deletedFacility = await Facility.findByIdAndDelete(id);
        return {
          success: true,
          message: 'Facility deleted successfully',
          id: deletedFacility?._id,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

export default FacilityResolver;
