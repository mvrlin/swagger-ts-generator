/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Vehicle {
  ID?: number;
  accessories?: ModelAccessories;
  category?: ModelCategory;
  categoryID?: number;
  chassis?: string;
  doorsNumber?: number;
  electricEngineAndBattery?: ModelElectricEngineAndBattery;
  engineAndGears?: ModelEngineAndGears;
  fuelConsumption?: ModelFuelConsumption;
  imageLink?: string;
  licensingGroup?: string;
  manufacturer?: ModelManufacturer;
  /**
   * gorm.Model
   * IsDraft        bool         `gorm:"type:bool;not null;default:true" json:"isDraft"`
   */
  manufacturerID?: number;
  /** Updated foreign key constraints */
  modelImage?: ModelImageObject;
  /** Made nullable */
  modelImageID?: string;
  modelLaunchYear?: string;
  modelName?: string;
  physicalMeasures?: ModelPhysicalMeasures;
  safety?: ModelSafety;
  seatsNumber?: number;
  subModel?: string;
  subModelURL?: string;
  url?: string;
  vehicleTreatments?: ModelVehicleTreatment[];
  yearGroupURL?: string;
  yearbook?: string;
}

export interface DataBulkEditRequest {
  data?: ModelVehicleUpdate;
  filters?: DataVehicleFilter;
}

export interface DataErrorResponse {
  code?: number;
  error?: string;
}

export interface DataFilterOption {
  image_blurhash?: string;
  image_id?: string;
  name?: string;
}

export interface DataVehicleFilter {
  acceleration?: number[];
  batteryCapacity?: number[];
  categories?: string[];
  chassis?: string[];
  cruiseControl?: string[];
  dcCharging?: boolean;
  doorsNumber?: number[];
  /** Fields from EngineAndGearsFilter */
  engineCapacity?: number[];
  engineType?: string[];
  fitForTransportingToddlers?: boolean;
  fuelConsumptionEfficiency?: string[];
  /** Fields from FuelConsumptionFilter */
  fuelType?: string[];
  gearBox?: string[];
  isEconomicalFuelConsumption?: boolean;
  manufacturerNames?: string[];
  maxPower?: number[];
  modelNames?: string[];
  numberOfCylinders?: number[];
  rearTrunkVolume?: number[];
  searchText?: string;
  seatCoverType?: string[];
  seatsNumber?: number[];
  sortBy?: DataVehicleFilterSortByEnum;
  sortDirection?: string;
  subModels?: string[];
  /** Fields from AccessoriesFilter */
  sunroof?: string[];
  /** Fields from PhysicalMeasuresFilter */
  vehicleWeight?: number[];
  wheelDriveConfig?: string[];
  /** Fields from ElectricEngineAndBatteryFilter */
  wltpBatteryRange?: number[];
  yearbook?: number[];
}

export interface DataVehicleListResponse {
  count?: number;
  data?: Vehicle[];
}

export interface ExportExcelResponse {
  processing_time?: string;
  submodels?: Vehicle[];
  total_submodels?: number;
}

export type FiberMap = Record<string, any>;

export interface GormDeletedAt {
  time?: string;
  /** Valid is true if Time is not NULL */
  valid?: boolean;
}

export interface HandlerChangeRequest {
  password?: string;
  password2?: string;
}

export interface HandlerLoginRequest {
  email?: string;
  password?: string;
}

export interface HandlerRegisterRequest {
  email?: string;
  password?: string;
}

export interface ModelAccessories {
  airConditioning?: string;
  androidAuto?: boolean;
  appleCarPlay?: boolean;
  autonomousParking?: boolean;
  bluetooth?: boolean;
  cdChanger?: boolean;
  cruiseControl?: string;
  digitalDashboard?: boolean;
  electricArmbrake?: boolean;
  electricSeatAdjustment?: string;
  electricTrunkDoor?: boolean;
  electricWindows?: number;
  frontFogLights?: boolean;
  headlightSensors?: boolean;
  headlightsType?: string;
  keyLessEntryIgnition?: string;
  magnesiumRims?: boolean;
  multimediaScreen?: string;
  parkingCamera?: string;
  parkingSensors?: string;
  passangerVibeLights?: boolean;
  rainSensors?: boolean;
  seatCoverType?: string;
  seatHeating?: string;
  seatVentilation?: string;
  stopStartSystem?: boolean;
  sunroof?: string;
  wirelessChargingPad?: boolean;
}

export interface ModelCategory {
  ID?: number;
  enName?: string;
  heName?: string;
  logo?: ModelImageObject;
  logoID?: string;
}

export interface ModelElectricEngineAndBattery {
  batteryCapacity?: number;
  dcCharging?: boolean;
  /** Electric Consumption (Watt-hour/km) */
  electricConsumption?: number;
  /** Fast Charging Time */
  fastChargingTime?: string;
  fullChargingCost?: number;
  /** Home Charging Time */
  homeChargingTime?: string;
  wltpBatteryRange?: number;
}

export interface ModelEngineAndGears {
  acceleration?: string;
  engineCapacity?: number;
  engineType?: string;
  gearBox?: string;
  maxPower?: number;
  maxTorque?: number;
  numberOfCylinders?: number;
  numberOfGears?: number;
  topSpeed?: number;
  wheelDriveConfig?: string;
}

export interface ModelFuelConsumption {
  averageFuelConsumption?: number;
  fuelConsumptionEfficiency?: string;
  fuelType?: string;
  intercityFuelConsumption?: number;
  manufacturerCombinedFuelConsumption?: string;
  urbanFuelConsumption?: number;
}

export interface ModelImageObject {
  ID?: string;
  blurhash?: string;
}

export interface ModelManufacturer {
  ID?: number;
  country?: string;
  enName?: string;
  heName?: string;
  logo?: ModelImageObject;
  logoId?: string;
  logoUrl?: string;
  url?: string;
}

export interface ModelPhysicalMeasures {
  frontTiersDimensions?: string;
  fuelTankVolume?: number;
  height?: number;
  length?: number;
  rearTiersDimensions?: string;
  rearTrunkVolume?: number;
  vehicleWeight?: number;
  wheelBase?: number;
  width?: number;
}

export interface ModelSafety {
  abs?: boolean;
  airbagsNumber?: number;
  automaticHighBeamDimming?: boolean;
  autonomousEmergencyBraking?: boolean;
  bas?: boolean;
  crashTestStars?: string;
  deadZonesMonitoring?: string;
  driverFatigueMonitoring?: boolean;
  ebd?: boolean;
  esp?: boolean;
  fitForTransportingTodlers?: boolean;
  frontAutonomousEmergencyBraking?: boolean;
  frontPassengerAirbag?: boolean;
  frontPassengerAirbagCancellation?: boolean;
  headUpDisplay?: boolean;
  hillDescentControl?: boolean;
  isofix?: boolean;
  laneDeviationControl?: string;
  rearAutonomousEmergencyBraking?: boolean;
  tirePressureSensors?: boolean;
  trafficSignRecognition?: boolean;
  uphillJumpAssist?: boolean;
}

export interface ModelSession {
  createdAt?: string;
  deletedAt?: string;
  expires_at?: string;
  id?: number;
  key?: string;
  provider?: string;
  updatedAt?: string;
  user_agent?: string;
  user_id?: number;
}

export interface ModelTwoFaEntity {
  code?: string;
  createdAt?: string;
  deletedAt?: GormDeletedAt;
  id?: number;
  name?: string;
  updatedAt?: string;
}

export interface ModelUser {
  "2_fa_enabled"?: boolean;
  ID?: number;
  createdAt?: string;
  deletedAt?: GormDeletedAt;
  email?: string;
  first_name?: string;
  id?: number;
  last_name?: string;
  password?: string;
  role?: string;
  updatedAt?: string;
}

export interface ModelVehicleTreatment {
  ID?: number;
  description?: string;
  price?: number;
  title?: string;
  vehicleId?: number;
}

export interface ModelVehicleUpdate {
  accessories?: ModelAccessories;
  categoryID?: number;
  chassis?: string;
  doorsNumber?: number;
  electricEngineAndBattery?: ModelElectricEngineAndBattery;
  engineAndGears?: ModelEngineAndGears;
  fuelConsumption?: ModelFuelConsumption;
  manufacturerID?: number;
  /** ModelImageID             *uuid.UUID                `json:"modelImageID,omitempty"` */
  modelImage?: ModelImageObject;
  modelName?: string;
  physicalMeasures?: ModelPhysicalMeasures;
  price?: number;
  safety?: ModelSafety;
  seatsNumber?: number;
  subModel?: string;
  treatments?: ModelVehicleTreatment[];
  yearbook?: string;
}

export enum DataVehicleFilterSortByEnum {
  Acceleration = "acceleration",
  Yearbook = "yearbook",
  CombinedFuelConsumption = "combinedFuelConsumption",
}

export type TerminateCreatePayload = number[];

export interface CategoriesListParams {
  /**
   * Offset for pagination
   * @default 0
   */
  offset?: number;
  /**
   * Limit for pagination
   * @default 10
   */
  limit?: number;
}

export interface ProcessExcelCreatePayload {
  /**
   * Excel file to upload
   * @format binary
   */
  file: File;
}

export interface UploadCreatePayload {
  /**
   * Image file to upload
   * @format binary
   */
  image: File;
}

export interface ManufacturersListParams {
  /**
   * Offset for pagination
   * @default 0
   */
  offset?: number;
  /**
   * Limit for pagination
   * @default 100
   */
  limit?: number;
}

export interface ListCreateParams {
  /** Limit */
  limit?: number;
  /** Offset */
  offset?: number;
}

export interface GetFieldOptionsOptionsCreateParams {
  /** An optional search string to filter the field options. */
  search?: string;
  /** The field name for which options are retrieved (e.g., 'manufacturer', 'category', 'engineAndGears.engineCapacity'). */
  field: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data.data;
    });
  };
}

/**
 * @title Lajit Backend API
 * @version pre-alpha
 * @license Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0.html)
 * @termsOfService http://swagger.io/terms/
 * @contact API Support <fiber@swagger.io>
 *
 * This is a sample swagger for Fiber
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description Change password with old and new password
     *
     * @tags auth
     * @name ChangeCreate
     * @summary Change password
     * @request POST:/auth/change
     */
    changeCreate: (changeRequest: HandlerChangeRequest, params: RequestParams = {}) =>
      this.request<ModelUser, DataErrorResponse>({
        path: `/auth/change`,
        method: "POST",
        body: changeRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Login with email and password
     *
     * @tags auth
     * @name LoginCreate
     * @summary Login
     * @request POST:/auth/login
     */
    loginCreate: (loginRequest: HandlerLoginRequest, params: RequestParams = {}) =>
      this.request<ModelUser, DataErrorResponse>({
        path: `/auth/login`,
        method: "POST",
        body: loginRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Verify the login code
     *
     * @tags auth
     * @name LoginVerifyCreate
     * @summary Login verification
     * @request POST:/auth/login/verify
     */
    loginVerifyCreate: (entity: ModelTwoFaEntity, params: RequestParams = {}) =>
      this.request<ModelUser, DataErrorResponse>({
        path: `/auth/login/verify`,
        method: "POST",
        body: entity,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Register with email and password
     *
     * @tags auth
     * @name RegisterCreate
     * @summary Register
     * @request POST:/auth/register
     */
    registerCreate: (registerRequest: HandlerRegisterRequest, params: RequestParams = {}) =>
      this.request<ModelUser, DataErrorResponse>({
        path: `/auth/register`,
        method: "POST",
        body: registerRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Terminate sessions by IDs
     *
     * @tags auth
     * @name TerminateCreate
     * @summary Terminate sessions
     * @request POST:/auth/terminate
     */
    terminateCreate: (ids: TerminateCreatePayload, params: RequestParams = {}) =>
      this.request<ModelSession, DataErrorResponse>({
        path: `/auth/terminate`,
        method: "POST",
        body: ids,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Terminate all sessions
     *
     * @tags auth
     * @name TerminateAllCreate
     * @summary Terminate all sessions
     * @request POST:/auth/terminate/all
     */
    terminateAllCreate: (params: RequestParams = {}) =>
      this.request<ModelSession, DataErrorResponse>({
        path: `/auth/terminate/all`,
        method: "POST",
        ...params,
      }),
  };
  categories = {
    /**
     * @description Get a list of all vehicle categories with pagination
     *
     * @tags Vehicle Categories
     * @name CategoriesList
     * @summary List all vehicle categories
     * @request GET:/categories
     */
    categoriesList: (query: CategoriesListParams, params: RequestParams = {}) =>
      this.request<ModelCategory[], FiberMap>({
        path: `/categories`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Create a new vehicle category
     *
     * @tags Vehicle Categories
     * @name CategoriesCreate
     * @summary Create a new vehicle category
     * @request POST:/categories
     */
    categoriesCreate: (category: ModelCategory, params: RequestParams = {}) =>
      this.request<ModelCategory, FiberMap>({
        path: `/categories`,
        method: "POST",
        body: category,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a vehicle category
     *
     * @tags Vehicle Categories
     * @name CategoriesUpdate
     * @summary Update a vehicle category
     * @request PUT:/categories/{id}
     */
    categoriesUpdate: (id: number, category: ModelCategory, params: RequestParams = {}) =>
      this.request<ModelCategory, FiberMap>({
        path: `/categories/${id}`,
        method: "PUT",
        body: category,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  exportExcel = {
    /**
     * @description Uploads an Excel file, processes the data, and posts the submodels
     *
     * @tags excel
     * @name ProcessExcelCreate
     * @summary Process an Excel file
     * @request POST:/export-excel/process-excel
     */
    processExcelCreate: (data: ProcessExcelCreatePayload, params: RequestParams = {}) =>
      this.request<ExportExcelResponse, string>({
        path: `/export-excel/process-excel`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  images = {
    /**
     * @description Upload an image
     *
     * @tags Images
     * @name UploadCreate
     * @summary Upload an image
     * @request POST:/images/upload
     */
    uploadCreate: (data: UploadCreatePayload, params: RequestParams = {}) =>
      this.request<ModelImageObject, FiberMap>({
        path: `/images/upload`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  manufacturers = {
    /**
     * @description Get a list of all manufacturers with pagination
     *
     * @tags manufacturers
     * @name ManufacturersList
     * @summary List all manufacturers
     * @request GET:/manufacturers
     */
    manufacturersList: (query: ManufacturersListParams, params: RequestParams = {}) =>
      this.request<ModelManufacturer[], FiberMap>({
        path: `/manufacturers`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update the details of a manufacturer by ID
     *
     * @tags manufacturers
     * @name ManufacturersUpdate
     * @summary Update an existing manufacturer
     * @request PUT:/manufacturers/{id}
     */
    manufacturersUpdate: (id: number, manufacturer: ModelManufacturer, params: RequestParams = {}) =>
      this.request<ModelManufacturer, Record<string, string>>({
        path: `/manufacturers/${id}`,
        method: "PUT",
        body: manufacturer,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  vehicles = {
    /**
     * @description Bulk edit vehicles
     *
     * @tags vehicles
     * @name BulkEditUpdate
     * @summary Bulk edit vehicles
     * @request PUT:/vehicles/bulk-edit
     */
    bulkEditUpdate: (request: DataBulkEditRequest, params: RequestParams = {}) =>
      this.request<Vehicle, DataErrorResponse>({
        path: `/vehicles/bulk-edit`,
        method: "PUT",
        body: request,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Count total vehicles
     *
     * @tags vehicles
     * @name CountList
     * @summary Count total vehicles
     * @request GET:/vehicles/count
     */
    countList: (params: RequestParams = {}) =>
      this.request<FiberMap, DataErrorResponse>({
        path: `/vehicles/count`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Create a new vehicle with the provided data
     *
     * @tags vehicle
     * @name CreateCreate
     * @summary Create a new vehicle
     * @request POST:/vehicles/create
     */
    createCreate: (vehicle: Vehicle, params: RequestParams = {}) =>
      this.request<Vehicle, DataErrorResponse>({
        path: `/vehicles/create`,
        method: "POST",
        body: vehicle,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get all vehicles with optional filters
     *
     * @tags vehicles
     * @name ListCreate
     * @summary List all vehicles
     * @request POST:/vehicles/list
     */
    listCreate: (query: ListCreateParams, filters: DataVehicleFilter, params: RequestParams = {}) =>
      this.request<DataVehicleListResponse, DataErrorResponse>({
        path: `/vehicles/list`,
        method: "POST",
        query: query,
        body: filters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Add a vehicle treatment
     *
     * @tags treatments
     * @name TreatmentsCreate
     * @summary Add a vehicle treatment
     * @request POST:/vehicles/treatments
     */
    treatmentsCreate: (treatment: ModelVehicleTreatment, params: RequestParams = {}) =>
      this.request<ModelVehicleTreatment, DataErrorResponse>({
        path: `/vehicles/treatments`,
        method: "POST",
        body: treatment,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get a vehicle treatment
     *
     * @tags treatments
     * @name TreatmentsDetail
     * @summary Get a vehicle treatment
     * @request GET:/vehicles/treatments/{treatment_id}
     */
    treatmentsDetail: (treatmentId: number, params: RequestParams = {}) =>
      this.request<ModelVehicleTreatment, DataErrorResponse>({
        path: `/vehicles/treatments/${treatmentId}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Remove a vehicle treatment
     *
     * @tags treatments
     * @name TreatmentsDelete
     * @summary Remove a vehicle treatment
     * @request DELETE:/vehicles/treatments/{treatment_id}
     */
    treatmentsDelete: (treatmentId: number, params: RequestParams = {}) =>
      this.request<void, DataErrorResponse>({
        path: `/vehicles/treatments/${treatmentId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Get a vehicle by ID
     *
     * @tags vehicles
     * @name VehiclesDetail
     * @summary Get a vehicle by ID
     * @request GET:/vehicles/{id}
     */
    vehiclesDetail: (id: number, params: RequestParams = {}) =>
      this.request<Vehicle, DataErrorResponse>({
        path: `/vehicles/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Update a vehicle with the provided data
     *
     * @tags vehicles
     * @name VehiclesUpdate
     * @summary Update a vehicle
     * @request PUT:/vehicles/{id}
     */
    vehiclesUpdate: (id: number, vehicle: Vehicle, params: RequestParams = {}) =>
      this.request<Vehicle, DataErrorResponse>({
        path: `/vehicles/${id}`,
        method: "PUT",
        body: vehicle,
        ...params,
      }),

    /**
     * @description Delete a vehicle by ID
     *
     * @tags vehicles
     * @name VehiclesDelete
     * @summary Delete a vehicle by ID
     * @request DELETE:/vehicles/{id}
     */
    vehiclesDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, DataErrorResponse>({
        path: `/vehicles/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  vehiclesData = {
    /**
     * @description Retrieve distinct values of a specified field from the vehicle database, after applying filters and an optional search query.
     *
     * @tags vehiclesData
     * @name GetFieldOptionsOptionsCreate
     * @summary Get field options for a vehicle
     * @request POST:/vehiclesData/getFieldOptions/{field}/options
     */
    getFieldOptionsOptionsCreate: (
      { field, ...query }: GetFieldOptionsOptionsCreateParams,
      filters: DataVehicleFilter,
      params: RequestParams = {},
    ) =>
      this.request<DataFilterOption[], DataErrorResponse>({
        path: `/vehiclesData/getFieldOptions/${field}/options`,
        method: "POST",
        query: query,
        body: filters,
        type: ContentType.Json,
        ...params,
      }),
  };
}
