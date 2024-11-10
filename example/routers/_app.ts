import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// Schema Definitions
export const DataBulkEditRequestSchema = z.any();

export const DataErrorResponseSchema = z.any();

export const DataFilterOptionSchema = z.any();

export const DataVehicleFilterSchema = z.any();

export const DataVehicleListResponseSchema = z.any();

export const Export_excelResponseSchema = z.any();

export const FiberMapSchema = z.any();

export const GormDeletedAtSchema = z.any();

export const HandlerChangeRequestSchema = z.any();

export const HandlerLoginRequestSchema = z.any();

export const HandlerRegisterRequestSchema = z.any();

export const ModelAccessoriesSchema = z.any();

export const ModelCategorySchema = z.any();

export const ModelElectricEngineAndBatterySchema = z.any();

export const ModelEngineAndGearsSchema = z.any();

export const ModelFuelConsumptionSchema = z.any();

export const ModelImageObjectSchema = z.any();

export const ModelManufacturerSchema = z.any();

export const ModelPhysicalMeasuresSchema = z.any();

export const ModelSafetySchema = z.any();

export const ModelSessionSchema = z.any();

export const ModelTwoFaEntitySchema = z.any();

export const ModelUserSchema = z.any();

export const ModelVehicleTreatmentSchema = z.any();

export const ModelVehicleUpdateSchema = z.any();

export const VehicleSchema = z.any();

export const appRouter = router({
  changecreate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/auth/change', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /auth/change: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  logincreate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/auth/login', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /auth/login: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  loginverifycreate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/auth/login/verify', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /auth/login/verify: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  registercreate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/auth/register', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /auth/register: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  terminatecreate: protectedProcedure
    .input(z.array(z.number().int()))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/auth/terminate', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /auth/terminate: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  terminateallcreate: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/auth/terminate/all');
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /auth/terminate/all: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  categorieslist: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.api.get('/categories');
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Error during GET /categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  categoriescreate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/categories', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  categoriesupdate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.put('/categories/{id}', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during PUT /categories/{id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  processexcelcreate: protectedProcedure
    .input(z.object({
    file: z.string().describe("Excel file to upload")
  }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/export-excel/process-excel', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /export-excel/process-excel: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  uploadcreate: protectedProcedure
    .input(z.object({
    image: z.string().describe("Image file to upload")
  }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/images/upload', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /images/upload: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  manufacturerslist: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.api.get('/manufacturers');
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Error during GET /manufacturers: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  manufacturersupdate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.put('/manufacturers/{id}', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during PUT /manufacturers/{id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  bulkeditupdate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.put('/vehicles/bulk-edit', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during PUT /vehicles/bulk-edit: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  countlist: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.api.get('/vehicles/count');
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Error during GET /vehicles/count: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  createcreate: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/vehicles/create');
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /vehicles/create: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  listcreate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/vehicles/list', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /vehicles/list: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  treatmentscreate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/vehicles/treatments', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /vehicles/treatments: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  treatmentsdetail: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.api.get('/vehicles/treatments/{treatment_id}');
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Error during GET /vehicles/treatments/{treatment_id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  treatmentsdelete: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.delete('/vehicles/treatments/{treatment_id}');
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during DELETE /vehicles/treatments/{treatment_id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  vehiclesdetail: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.api.get('/vehicles/{id}');
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Error during GET /vehicles/{id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  vehiclesupdate: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.put('/vehicles/{id}');
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during PUT /vehicles/{id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  vehiclesdelete: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.delete('/vehicles/{id}');
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during DELETE /vehicles/{id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    }),

  getfieldoptionsoptionscreate: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.api.post('/vehiclesData/getFieldOptions/{field}/options', undefined, input);
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error during POST /vehiclesData/getFieldOptions/{field}/options: ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error
        });
      }
    })
});

export type AppRouter = typeof appRouter;