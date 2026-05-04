import { Response, NextFunction } from "express";
import env from "src/util/validateEnv";
import { AuthenticatedRequest } from "src/validators/authUserMiddleware";

/**
 * Emails that can have their own "My Organization" profile and manage merch.
 * Only these users can create/edit their org and add/edit/delete merch.
 * Leave empty [] to use STUDENT_ORG_ALLOWED_EMAILS from .env instead.
 *
 * Add allowed emails here, e.g.:
 *   "mik127@ucsd.edu",
 *   "another-org@ucsd.edu",
 */
const ALLOWED_ORGANIZATION_EMAILS: string[] = [
  // Leave empty to use STUDENT_ORG_ALLOWED_EMAILS from .env
];

function allowedEmailsSet(): Set<string> {
  const fromCode = ALLOWED_ORGANIZATION_EMAILS.map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (fromCode.length > 0) {
    return new Set(fromCode);
  }
  const raw = env.STUDENT_ORG_ALLOWED_EMAILS || "";
  if (!raw.trim()) return new Set();
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

/** Returns whether the given email can have "My Organization" access. */
export function hasStudentOrgAccess(email: string): boolean {
  const normalized = (email || "").trim().toLowerCase();
  const allowed = allowedEmailsSet();
  return allowed.size > 0 && allowed.has(normalized);
}

/**
 * Middleware that restricts "My Organization" to allowed emails only.
 * Allowed list: ALLOWED_ORGANIZATION_EMAILS in this file (if non-empty),
 * otherwise STUDENT_ORG_ALLOWED_EMAILS in .env. Use after authenticateUser.
 */
export const requireStudentOrgAccess = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }
  const email = (req.user.userEmail || "").trim().toLowerCase();
  const allowed = allowedEmailsSet();
  if (!allowed.size) {
    return res.status(403).json({
      message: "Student organization access is not enabled for any accounts.",
    });
  }
  if (!allowed.has(email)) {
    return res.status(403).json({
      message: "You do not have access to student organization features.",
    });
  }
  next();
};
