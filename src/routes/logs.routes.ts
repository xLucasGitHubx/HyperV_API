import { Router, Request, Response } from "express";
import { db } from "../db";
import { vmLogs } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * @route POST /api/logs/add
 * @desc Ajouter un log pour une VM
 * @body { message: string, userId: number, vmId: number }
 */
router.post("/add", async (req: Request, res: Response) => {
	try {
		const { message, userId, vmId } = req.body;

		if (!message || !userId || !vmId) {
			return res.status(400).json({ error: "Champs requis manquants" });
		}

		await db.insert(vmLogs).values({
			message,
			userId,
			vmId,
		});

		return res.status(201).json({ message: "Log ajouté avec succès" });
	} catch (error) {
		console.error("Erreur lors de l'ajout du log:", error);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * @route GET /api/logs/vm/:vmId
 * @desc Récupérer tous les logs d'une VM
 */
router.get("/vm/:vmId", async (req: Request, res: Response) => {
	try {
		const vmId = parseInt(req.params.vmId, 10);
		if (isNaN(vmId)) {
			return res.status(400).json({ error: "vmId invalide" });
		}

		const logs = await db.select().from(vmLogs).where(eq(vmLogs.vmId, vmId)).orderBy(vmLogs.id);

		return res.json(logs);
	} catch (error) {
		console.error("Erreur lors de la récupération des logs:", error);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * @route GET /api/logs/system
 * @desc Récupérer les derniers logs système (tous logs, max 100)
 */
router.get("/system", async (_req: Request, res: Response) => {
	try {
		const logs = await db.select().from(vmLogs).orderBy(vmLogs.id).limit(100);

		return res.json(logs);
	} catch (error) {
		console.error("Erreur lors de la récupération des logs système:", error);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

export default router;
