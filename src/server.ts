import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import vmRoutes from "./routes/vm.routes";
import vswitchRoutes from "./routes/vswitch.routes";
import servicesRoutes from "./routes/services.routes";
import logsRoutes from "./routes/logs.routes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/vm", vmRoutes);
app.use("/api/vswitch", vswitchRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/logs", logsRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`HyperV_API running on port ${PORT}`);
});
