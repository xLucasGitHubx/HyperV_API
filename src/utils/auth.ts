import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Génère un token JWT pour un utilisateur
 */
export function generateToken(userId: number): string {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "2h" });
}

/**
 * Middleware Express : vérifie l’authentification
 * Le token doit être dans le header Authorization : "Bearer <token>"
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Token manquant ou invalide" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
		// Attache userId au req pour les handlers
		(req as any).userId = decoded.userId;
		next();
	} catch (err) {
		return res.status(401).json({ error: "Token invalide ou expiré" });
	}
}

/**
 * Helper pour récupérer l’ID de l’utilisateur depuis la requête
 */
export function getUserId(req: Request): number | undefined {
	return (req as any).userId;
}
