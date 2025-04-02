import { Router, Request, Response } from "express";
import { db } from "../db";
import { vms } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * @route POST /api/vm/create
 * {
 *   "name": "vm-test-01",
 *   "ram": 4096,
 *   "vcpu": 2,
 *   "vswitch": "default-switch"
 * }
 */
router.post("/create", async (req: Request, res: Response) => {
	try {
		const { name, ram, vcpu, vswitch } = req.body;

		// Ici, on va faire un insert sur la table vms,
		// attention : on n’a pas stocké "vswitch" en string,
		// on a vswitchId. Il faudrait trouver l'ID en base du vSwitch correspondant.
		// A titre d'exemple, on suppose un vSwitch portant ce name existe déjà.

		// Récupérer l'ID du vSwitch
		const [theSwitch] = await db.query.vSwitch.findMany({
			where: (tbl, { eq }) => eq(tbl.name, vswitch),
		});
		if (!theSwitch) {
			return res.status(400).json({ error: "vSwitch not found" });
		}

		// Créer la VM
		const insertResult = await db.insert(vms).values({
			name,
			ram,
			vcpu,
			vswitchId: theSwitch.id,
		});

		return res.status(201).json({ message: "VM created", data: insertResult });
	} catch (error) {
		console.error("Error creating VM:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * @route GET /api/vm/list
 */
router.get("/list", async (_req: Request, res: Response) => {
	try {
		const allVMs = await db.select().from(vms);
		return res.json(allVMs);
	} catch (error) {
		console.error("Error retrieving VMs:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * @route GET /api/vm/details?id={vmId}
 */
router.get("/details", async (req: Request, res: Response) => {
	try {
		const { id } = req.query;
		if (!id) {
			return res.status(400).json({ error: "Missing VM id" });
		}
		const [vm] = await db
			.select()
			.from(vms)
			.where(eq(vms.id, Number(id)));
		if (!vm) {
			return res.status(404).json({ error: "VM not found" });
		}
		// Ici, on pourrait ajouter la RAM utilisée, stockage utilisé, etc.
		// Simplifié pour l'exemple
		return res.json(vm);
	} catch (error) {
		console.error("Error retrieving VM details:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * @route PUT /api/vm/update
 * {
 *    "id": "1",
 *    "ram": 8192,
 *    "vcpu": 4
 * }
 */
router.put("/update", async (req: Request, res: Response) => {
	try {
		const { id, ram, vcpu } = req.body;
		if (!id) {
			return res.status(400).json({ error: "Missing VM id" });
		}
		await db
			.update(vms)
			.set({ ram, vcpu })
			.where(eq(vms.id, Number(id)));
		return res.json({ message: "VM updated" });
	} catch (error) {
		console.error("Error updating VM:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * @route DELETE /api/vm/delete?id={vmId}
 */
router.delete("/delete", async (req: Request, res: Response) => {
	try {
		const { id } = req.query;
		if (!id) {
			return res.status(400).json({ error: "Missing VM id" });
		}
		await db.delete(vms).where(eq(vms.id, Number(id)));
		return res.json({ message: "VM deleted" });
	} catch (error) {
		console.error("Error deleting VM:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
