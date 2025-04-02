import { Router, Request, Response } from "express";
import { db } from "../db";
import { services, vmServices } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * @route POST /api/services/configure
 * @desc Configurer un service sur une VM (association)
 * @body { service: string, userId: number, vmId: number }
 */
router.post("/configure", async (req: Request, res: Response) => {
	try {
		const { service, userId, vmId } = req.body;

		if (!service || !userId || !vmId) {
			return res.status(400).json({ error: "Champs requis manquants" });
		}

		// Vérifier si le service existe
		let [existingService] = await db.select().from(services).where(eq(services.name, service));

		// Si le service n'existe pas, on le crée
		if (!existingService) {
			const result = await db.insert(services).values({ name: service }).returning();
			existingService = result[0];
		}

		// Créer l'association VM <-> Service
		await db.insert(vmServices).values({
			serviceId: existingService.id,
			userId,
			vmId,
		});

		return res.status(201).json({ message: `Service '${service}' configuré pour la VM.` });
	} catch (error) {
		console.error("Erreur lors de la configuration du service:", error);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * @route GET /api/services/list
 * @desc Lister tous les services configurés
 */
router.get("/list", async (_req: Request, res: Response) => {
	try {
		const allServices = await db.select().from(services);
		return res.json(allServices);
	} catch (error) {
		console.error("Erreur lors de la récupération des services:", error);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * @route GET /api/services/vm/:vmId
 * @desc Lister les services associés à une VM
 */
router.get("/vm/:vmId", async (req: Request, res: Response) => {
	try {
		const vmId = parseInt(req.params.vmId, 10);
		if (isNaN(vmId)) {
			return res.status(400).json({ error: "vmId invalide" });
		}

		const result = await db.query.vmServices.findMany({
			where: (vm) => eq(vm.vmId, vmId),
			with: {
				service: true, // nécessite définition relationnelle dans schema.ts si tu veux aller + loin
			},
		});

		return res.json(result);
	} catch (error) {
		console.error("Erreur lors de la récupération des services de la VM:", error);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

export default router;
