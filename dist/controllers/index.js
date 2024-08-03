"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const readCSVFile_1 = __importDefault(require("./uploads/readCSVFile"));
const router = express_1.default.Router();
//TODO move this to a seperate file
const routes = {
    '/uploads/readCSVFile': readCSVFile_1.default // base route
};
Object.entries(routes).map(([path, controllerFunction]) => {
    router.use(path, controllerFunction);
});
exports.default = router;
