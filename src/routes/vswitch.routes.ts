import { Router, Request, Response } from "express";
import { db } from "../db";
import { vSwitch } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * @route POST /api/vswitch/create
 * @desc Créer un vSwitch
 * @body { name: string, userId?: number }
 */
router.post("/create", async (req: Request, res: Response) => {
	try {
		const { name, userId } = req.body;

		if (!name) {
			return res.status(400).json({ error: "Le nom du vSwitch est requis." });
		}

		// Vérifie si un vSwitch du même nom existe déjà
		const [existing] = await db.select().from(vSwitch).where(eq(vSwitch.name, name));

		if (existing) {
			return res.status(400).json({ error: "Ce vSwitch existe déjà." });
		}

		await db.insert(vSwitch).values({
			name,
			userId,
		});

		return res.status(201).json({ message: `vSwitch '${name}' créé.` });
	} catch (error) {
		console.error("Erreur lors de la création du vSwitch:", error);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * @route GET /api/vswitch/list
 * @desc Lister tous les vSwitch
 */
router.get("/list", async (_req: Request, res: Response) => {
	try {
		const all = await db.select().from(vSwitch);
		return res.json(all);
	} catch (error) {
		console.error("Erreur lors de la récupération des vSwitch:", error);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * @route DELETE /api/vswitch/delete?name=xxx
 * @desc Supprimer un vSwitch par nom
 */
router.delete("/delete", async (req: Request, res: Response) => {
	try {
		const { name } = req.query;

		if (!name || typeof name !== "string") {
			return res.status(400).json({ error: "Nom de vSwitch manquant." });
		}

		const deleted = await db.delete(vSwitch).where(eq(vSwitch.name, name));
		return res.json({ message: `vSwitch '${name}' supprimé.` });
	} catch (error) {
		console.error("Erreur lors de la suppression du vSwitch:", error);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

export default router;
