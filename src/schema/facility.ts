import { buildSchema } from "graphql";

export const facilitiesGQLSchema = buildSchema(`
    type Facility {
        id: String!
        name: String!
        nominalPower : Int!
        userId: String!
        facilityPerformance: FacilityPerformance
    }

    type FacilityPerformance {
        timestamps: [String!]!
        active_power_kWs: [Float!]!
        energy_kWhs: [Float!]!
      }

    type Query {
        facilities(userId: String!): facilitiesInfoResponse!
        facility(id: String!): Facility!
    }

    type facilitiesInfoResponse {
        success: Boolean!
        total: Int!
        facilities: [Facility!]!
    }

    type Mutation {
        createFacility(name: String!, nominalPower : Int!, userId: String!): Facility!
        updateFacility(id: String!, name: String, nominalPower : Int, userId: String): Facility!
        deleteFacility(id: String!): deleteResponse!
    }

    type deleteResponse {
        success: Boolean!
        message: String!
        id: String!
    }
`)
