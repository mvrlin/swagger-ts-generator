import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// Schema Definitions
const ModelAccessoriesSchemaSchema = z.lazy(() => model.AccessoriesSchema);

const ModelCategorySchemaSchema = z.lazy(() => model.CategorySchema);

const ModelElectricEngineAndBatterySchemaSchema = z.lazy(() => model.ElectricEngineAndBatterySchema);

const ModelEngineAndGearsSchemaSchema = z.lazy(() => model.EngineAndGearsSchema);

const ModelFuelConsumptionSchemaSchema = z.lazy(() => model.FuelConsumptionSchema);

const ModelManufacturerSchemaSchema = z.lazy(() => model.ManufacturerSchema);

const ModelImageObjectSchemaSchema = z.lazy(() => model.ImageObjectSchema);

const ModelPhysicalMeasuresSchemaSchema = z.lazy(() => model.PhysicalMeasuresSchema);

const ModelSafetySchemaSchema = z.lazy(() => model.SafetySchema);

const ModelVehicleTreatmentSchemaSchema = z.lazy(() => model.VehicleTreatmentSchema);

const VehicleSchemaSchema = z.lazy(() => VehicleSchema);

const ModelVehicleUpdateSchemaSchema = z.lazy(() => model.VehicleUpdateSchema);

const DataVehicleFilterSchemaSchema = z.lazy(() => data.VehicleFilterSchema);

const data_BulkEditRequestSchemaSchema = z.object({
    data: z.lazy(() => model.VehicleUpdateSchema).optional(),
    filters: z.lazy(() => data.VehicleFilterSchema).optional()
  });

const data_ErrorResponseSchemaSchema = z.object({
    code: z.any().optional(),
    error: z.string().optional()
  });

const data_FilterOptionSchemaSchema = z.object({
    image_blurhash: z.string().optional(),
    image_id: z.string().optional(),
    name: z.string().optional()
  });

const data_VehicleFilterSchemaSchema = z.object({
    acceleration: z.array(z.number()).optional(),
    batteryCapacity: z.array(z.any()).optional(),
    categories: z.array(z.string()).optional(),
    chassis: z.array(z.string()).optional(),
    cruiseControl: z.array(z.string()).optional(),
    dcCharging: z.boolean().optional(),
    doorsNumber: z.array(z.any()).optional(),
    engineCapacity: z.array(z.any()).optional(),
    engineType: z.array(z.string()).optional(),
    fitForTransportingToddlers: z.boolean().optional(),
    fuelConsumptionEfficiency: z.array(z.string()).optional(),
    fuelType: z.array(z.string()).optional(),
    gearBox: z.array(z.string()).optional(),
    isEconomicalFuelConsumption: z.boolean().optional(),
    manufacturerNames: z.array(z.string()).optional(),
    maxPower: z.array(z.any()).optional(),
    modelNames: z.array(z.string()).optional(),
    numberOfCylinders: z.array(z.any()).optional(),
    rearTrunkVolume: z.array(z.any()).optional(),
    searchText: z.string().optional(),
    seatCoverType: z.array(z.string()).optional(),
    seatsNumber: z.array(z.any()).optional(),
    sortBy: z.string().optional(),
    sortDirection: z.string().optional(),
    subModels: z.array(z.string()).optional(),
    sunroof: z.array(z.string()).optional(),
    vehicleWeight: z.array(z.any()).optional(),
    wheelDriveConfig: z.array(z.string()).optional(),
    wltpBatteryRange: z.array(z.any()).optional(),
    yearbook: z.array(z.any()).optional()
  });

const data_VehicleListResponseSchemaSchema = z.object({
    count: z.any().optional(),
    data: z.array(z.lazy(() => VehicleSchema)).optional()
  });

const export_excel_ResponseSchemaSchema = z.object({
    processing_time: z.string().optional(),
    submodels: z.array(z.lazy(() => VehicleSchema)).optional(),
    total_submodels: z.any().optional()
  });

const fiber_MapSchemaSchema = z.any();

const gorm_DeletedAtSchemaSchema = z.object({
    time: z.string().optional(),
    valid: z.boolean().optional()
  });

const handler_changeRequestSchemaSchema = z.object({
    password: z.string().optional(),
    password2: z.string().optional()
  });

const handler_loginRequestSchemaSchema = z.object({
    email: z.string().optional(),
    password: z.string().optional()
  });

const handler_registerRequestSchemaSchema = z.object({
    email: z.string().optional(),
    password: z.string().optional()
  });

const model_AccessoriesSchemaSchema = z.object({
    airConditioning: z.string().optional(),
    androidAuto: z.boolean().optional(),
    appleCarPlay: z.boolean().optional(),
    autonomousParking: z.boolean().optional(),
    bluetooth: z.boolean().optional(),
    cdChanger: z.boolean().optional(),
    cruiseControl: z.string().optional(),
    digitalDashboard: z.boolean().optional(),
    electricArmbrake: z.boolean().optional(),
    electricSeatAdjustment: z.string().optional(),
    electricTrunkDoor: z.boolean().optional(),
    electricWindows: z.any().optional(),
    frontFogLights: z.boolean().optional(),
    headlightSensors: z.boolean().optional(),
    headlightsType: z.string().optional(),
    keyLessEntryIgnition: z.string().optional(),
    magnesiumRims: z.boolean().optional(),
    multimediaScreen: z.string().optional(),
    parkingCamera: z.string().optional(),
    parkingSensors: z.string().optional(),
    passangerVibeLights: z.boolean().optional(),
    rainSensors: z.boolean().optional(),
    seatCoverType: z.string().optional(),
    seatHeating: z.string().optional(),
    seatVentilation: z.string().optional(),
    stopStartSystem: z.boolean().optional(),
    sunroof: z.string().optional(),
    wirelessChargingPad: z.boolean().optional()
  });

const model_CategorySchemaSchema = z.object({
    ID: z.any().optional(),
    enName: z.string().optional(),
    heName: z.string().optional(),
    logo: z.lazy(() => model.ImageObjectSchema).optional(),
    logoID: z.string().optional()
  });

const model_ElectricEngineAndBatterySchemaSchema = z.object({
    batteryCapacity: z.number().optional(),
    dcCharging: z.boolean().optional(),
    electricConsumption: z.number().optional(),
    fastChargingTime: z.string().optional(),
    fullChargingCost: z.number().optional(),
    homeChargingTime: z.string().optional(),
    wltpBatteryRange: z.any().optional()
  });

const model_EngineAndGearsSchemaSchema = z.object({
    acceleration: z.string().optional(),
    engineCapacity: z.any().optional(),
    engineType: z.string().optional(),
    gearBox: z.string().optional(),
    maxPower: z.any().optional(),
    maxTorque: z.number().optional(),
    numberOfCylinders: z.any().optional(),
    numberOfGears: z.any().optional(),
    topSpeed: z.any().optional(),
    wheelDriveConfig: z.string().optional()
  });

const model_FuelConsumptionSchemaSchema = z.object({
    averageFuelConsumption: z.number().optional(),
    fuelConsumptionEfficiency: z.string().optional(),
    fuelType: z.string().optional(),
    intercityFuelConsumption: z.number().optional(),
    manufacturerCombinedFuelConsumption: z.string().optional(),
    urbanFuelConsumption: z.number().optional()
  });

const model_ImageObjectSchemaSchema = z.object({
    ID: z.string().optional(),
    blurhash: z.string().optional()
  });

const model_ManufacturerSchemaSchema = z.object({
    ID: z.any().optional(),
    country: z.string().optional(),
    enName: z.string().optional(),
    heName: z.string().optional(),
    logo: z.lazy(() => model.ImageObjectSchema).optional(),
    logoId: z.string().optional(),
    logoUrl: z.string().optional(),
    url: z.string().optional()
  });

const model_PhysicalMeasuresSchemaSchema = z.object({
    frontTiersDimensions: z.string().optional(),
    fuelTankVolume: z.any().optional(),
    height: z.number().optional(),
    length: z.number().optional(),
    rearTiersDimensions: z.string().optional(),
    rearTrunkVolume: z.any().optional(),
    vehicleWeight: z.any().optional(),
    wheelBase: z.number().optional(),
    width: z.number().optional()
  });

const model_SafetySchemaSchema = z.object({
    abs: z.boolean().optional(),
    airbagsNumber: z.any().optional(),
    automaticHighBeamDimming: z.boolean().optional(),
    autonomousEmergencyBraking: z.boolean().optional(),
    bas: z.boolean().optional(),
    crashTestStars: z.string().optional(),
    deadZonesMonitoring: z.string().optional(),
    driverFatigueMonitoring: z.boolean().optional(),
    ebd: z.boolean().optional(),
    esp: z.boolean().optional(),
    fitForTransportingTodlers: z.boolean().optional(),
    frontAutonomousEmergencyBraking: z.boolean().optional(),
    frontPassengerAirbag: z.boolean().optional(),
    frontPassengerAirbagCancellation: z.boolean().optional(),
    headUpDisplay: z.boolean().optional(),
    hillDescentControl: z.boolean().optional(),
    isofix: z.boolean().optional(),
    laneDeviationControl: z.string().optional(),
    rearAutonomousEmergencyBraking: z.boolean().optional(),
    tirePressureSensors: z.boolean().optional(),
    trafficSignRecognition: z.boolean().optional(),
    uphillJumpAssist: z.boolean().optional()
  });

const model_SessionSchemaSchema = z.object({
    createdAt: z.string().optional(),
    deletedAt: z.string().optional(),
    expires_at: z.string().optional(),
    id: z.any().optional(),
    key: z.string().optional(),
    provider: z.string().optional(),
    updatedAt: z.string().optional(),
    user_agent: z.string().optional(),
    user_id: z.any().optional()
  });

const GormDeletedAtSchemaSchema = z.lazy(() => gorm.DeletedAtSchema);

const model_TwoFaEntitySchemaSchema = z.object({
    code: z.string().optional(),
    createdAt: z.string().optional(),
    deletedAt: z.lazy(() => gorm.DeletedAtSchema).optional(),
    id: z.any().optional(),
    name: z.string().optional(),
    updatedAt: z.string().optional()
  });

const model_UserSchemaSchema = z.object({
    2_fa_enabled: z.boolean().optional(),
    ID: z.any().optional(),
    createdAt: z.string().optional(),
    deletedAt: z.lazy(() => gorm.DeletedAtSchema).optional(),
    email: z.string().optional(),
    first_name: z.string().optional(),
    id: z.any().optional(),
    last_name: z.string().optional(),
    password: z.string().optional(),
    role: z.string().optional(),
    updatedAt: z.string().optional()
  });

const model_VehicleTreatmentSchemaSchema = z.object({
    ID: z.any().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    title: z.string().optional(),
    vehicleId: z.any().optional()
  });

const model_VehicleUpdateSchemaSchema = z.object({
    accessories: z.lazy(() => model.AccessoriesSchema).optional(),
    categoryID: z.any().optional(),
    chassis: z.string().optional(),
    doorsNumber: z.any().optional(),
    electricEngineAndBattery: z.lazy(() => model.ElectricEngineAndBatterySchema).optional(),
    engineAndGears: z.lazy(() => model.EngineAndGearsSchema).optional(),
    fuelConsumption: z.lazy(() => model.FuelConsumptionSchema).optional(),
    manufacturerID: z.any().optional(),
    modelImage: z.any().optional(),
    modelName: z.string().optional(),
    physicalMeasures: z.lazy(() => model.PhysicalMeasuresSchema).optional(),
    price: z.number().optional(),
    safety: z.lazy(() => model.SafetySchema).optional(),
    seatsNumber: z.any().optional(),
    subModel: z.string().optional(),
    treatments: z.array(z.lazy(() => model.VehicleTreatmentSchema)).optional(),
    yearbook: z.string().optional()
  });

const ModelUserSchemaSchema = z.lazy(() => model.UserSchema);

const DataErrorResponseSchemaSchema = z.lazy(() => data.ErrorResponseSchema);

const HandlerChangeRequestSchemaSchema = z.lazy(() => handler.changeRequestSchema);

const HandlerLoginRequestSchemaSchema = z.lazy(() => handler.loginRequestSchema);

const ModelTwoFaEntitySchemaSchema = z.lazy(() => model.TwoFaEntitySchema);

const HandlerRegisterRequestSchemaSchema = z.lazy(() => handler.registerRequestSchema);

const ModelSessionSchemaSchema = z.lazy(() => model.SessionSchema);

const FiberMapSchemaSchema = z.lazy(() => fiber.MapSchema);

const ExportExcelResponseSchemaSchema = z.lazy(() => export_excel.ResponseSchema);

const DataBulkEditRequestSchemaSchema = z.lazy(() => data.BulkEditRequestSchema);

export const vehicleRouter = router({

  rb2iecqwym6a: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.rb2iecqwym6a();
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to process rb2iecqwym6a',
        });
      }
    }),
});
