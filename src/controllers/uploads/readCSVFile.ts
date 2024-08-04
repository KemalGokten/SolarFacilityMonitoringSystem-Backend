import express, { Request, Response } from "express";

import path from "path";
import fs from "fs";
import multer from "multer";
import csvParser from "csv-parser";

import { Facility } from "../../model/facility";

const router = express.Router();

const upload = multer({ dest: path.join(__dirname, "uploads") });

router.post(
  "/",
  upload.single("csvFile"),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).send("No file uploaded");

    const [, extension] = req.file.originalname.split(".") || "";
    if (extension !== "csv") {
      console.error("Invalid file type");
      return res.status(400).send("Invalid file type");
    }

    const filePath = path.join(__dirname, "uploads", req.file.filename);
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => {
        results.push(data);
      })
      .on("error", (error) => {
        console.error("Error reading the file:", error);
        res.status(500).send("Error reading the file");
      })
      .on("end", async () => {
        try {
          const timestamps: string[] = [];
          const active_power_kWs: number[] = [];
          const energy_kWhs: number[] = [];
          const facilityId = req.body.facilityId;

          results.forEach((row) => {
            timestamps.push(new Date(row.timestamp).toISOString());
            active_power_kWs.push(parseFloat(row.active_power_kW));
            energy_kWhs.push(parseFloat(row.energy_kWh));
          });

          // Find the facility and update with new performance data
          const facility = await Facility.findById(facilityId);
          if (!facility) {
            return res.status(404).send("Facility not found");
          }

          facility.facilityPerformance = {
            timestamps,
            active_power_kWs,
            energy_kWhs,
          };

          await facility.save();

          res.status(200).json({ message: "Data successfully updated" });
        } catch (err) {
          console.error("Error updating data in database:", err);
          res.status(500).send("Error updating data in database");
        } finally {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting the file:", err);
          });
        }
      });
  }
);

export default router;
