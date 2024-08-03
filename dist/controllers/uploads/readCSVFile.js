"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const facility_1 = require("../../model/facility");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: path_1.default.join(__dirname, "uploads") });
router.post("/", upload.single("csvFile"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).send("No file uploaded");
    const [, extension] = req.file.originalname.split(".") || "";
    if (extension !== "csv") {
        console.error("Invalid file type");
        return res.status(400).send("Invalid file type");
    }
    const filePath = path_1.default.join(__dirname, "uploads", req.file.filename);
    const results = [];
    fs_1.default.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)())
        .on("data", (data) => {
        results.push(data);
    })
        .on("error", (error) => {
        console.error("Error reading the file:", error);
        res.status(500).send("Error reading the file");
    })
        .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const timestamps = [];
            const active_power_kWs = [];
            const energy_kWhs = [];
            const facilityId = req.body.facilityId;
            results.forEach((row) => {
                timestamps.push(new Date(row.timestamp).toISOString());
                active_power_kWs.push(parseFloat(row.active_power_kW));
                energy_kWhs.push(parseFloat(row.energy_kWh));
            });
            // Find the facility and update with new performance data
            const facility = yield facility_1.Facility.findById(facilityId);
            if (!facility) {
                return res.status(404).send("Facility not found");
            }
            facility.facilityPerformance = {
                timestamps,
                active_power_kWs,
                energy_kWhs,
            };
            yield facility.save();
            res.status(200).json({ message: "Data successfully updated" });
        }
        catch (err) {
            console.error("Error updating data in database:", err);
            res.status(500).send("Error updating data in database");
        }
        finally {
            fs_1.default.unlink(filePath, (err) => {
                if (err)
                    console.error("Error deleting the file:", err);
            });
        }
    }));
}));
exports.default = router;
