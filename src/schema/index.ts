import {mergeTypeDefs} from "@graphql-tools/merge"

import { usersGQLSchema } from "./user"
import { facilitiesGQLSchema } from "./facility"

export const mergedGQLSchema = mergeTypeDefs([usersGQLSchema, facilitiesGQLSchema])
