import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { DataVehicleFilter } from "../__generated__/LajitApi";
import { convertToZodSchema } from "../../src/helpers";
 