import { router } from '../trpc';
  import { changeCreateRouter } from './changeCreate';
import { loginCreateRouter } from './loginCreate';
import { loginVerifyCreateRouter } from './loginVerifyCreate';
import { registerCreateRouter } from './registerCreate';
import { terminateCreateRouter } from './terminateCreate';
import { terminateAllCreateRouter } from './terminateAllCreate';
import { categoriesListRouter } from './categoriesList';
import { categoriesCreateRouter } from './categoriesCreate';
import { categoriesUpdateRouter } from './categoriesUpdate';
import { processExcelCreateRouter } from './processExcelCreate';
import { uploadCreateRouter } from './uploadCreate';
import { manufacturersListRouter } from './manufacturersList';
import { manufacturersUpdateRouter } from './manufacturersUpdate';
import { bulkEditUpdateRouter } from './bulkEditUpdate';
import { countListRouter } from './countList';
import { createCreateRouter } from './createCreate';
import { listCreateRouter } from './listCreate';
import { treatmentsCreateRouter } from './treatmentsCreate';
import { treatmentsDetailRouter } from './treatmentsDetail';
import { treatmentsDeleteRouter } from './treatmentsDelete';
import { vehiclesDetailRouter } from './vehiclesDetail';
import { vehiclesUpdateRouter } from './vehiclesUpdate';
import { vehiclesDeleteRouter } from './vehiclesDelete';
import { getFieldOptionsOptionsCreateRouter } from './getFieldOptionsOptionsCreate';

  export const appRouter = router({
    changeCreate: changeCreateRouter,
  loginCreate: loginCreateRouter,
  loginVerifyCreate: loginVerifyCreateRouter,
  registerCreate: registerCreateRouter,
  terminateCreate: terminateCreateRouter,
  terminateAllCreate: terminateAllCreateRouter,
  categoriesList: categoriesListRouter,
  categoriesCreate: categoriesCreateRouter,
  categoriesUpdate: categoriesUpdateRouter,
  processExcelCreate: processExcelCreateRouter,
  uploadCreate: uploadCreateRouter,
  manufacturersList: manufacturersListRouter,
  manufacturersUpdate: manufacturersUpdateRouter,
  bulkEditUpdate: bulkEditUpdateRouter,
  countList: countListRouter,
  createCreate: createCreateRouter,
  listCreate: listCreateRouter,
  treatmentsCreate: treatmentsCreateRouter,
  treatmentsDetail: treatmentsDetailRouter,
  treatmentsDelete: treatmentsDeleteRouter,
  vehiclesDetail: vehiclesDetailRouter,
  vehiclesUpdate: vehiclesUpdateRouter,
  vehiclesDelete: vehiclesDeleteRouter,
  getFieldOptionsOptionsCreate: getFieldOptionsOptionsCreateRouter,
  });

  export type AppRouter = typeof appRouter;