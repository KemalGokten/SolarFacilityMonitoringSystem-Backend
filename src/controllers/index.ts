import express from "express";

import readCSVFileController from "./uploads/readCSVFile";

const router = express.Router();

interface IRoutes {
  [index: string]: express.Router;
}

//TODO move this to a seperate file
const routes: IRoutes = {
  "/uploads/readCSVFile": readCSVFileController, // base route
};

Object.entries(routes).map(
  ([path, controllerFunction]: [string, express.Router]) => {
    router.use(path, controllerFunction);
  }
);

export default router;
