const CAP = {
  Admin: ["posts:create","posts:read","posts:update","posts:delete","users:role:update"],
  Editor: ["posts:create","posts:read","posts:update_own","posts:delete_own"],
  Viewer: ["posts:read"]
};

export function can(action) {
  return (req, res, next) => {
    const role = req.user?.role;
    const allowed = CAP[role]?.includes(action);
    if (!allowed) return res.status(403).json({ error: "Forbidden: " + action });
    next();
  };
}

export function owns(getOwnerId) {
  return (req, res, next) => {
    const ownerId = getOwnerId(req);
    if (!ownerId || ownerId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: ownership required" });
    }
    next();
  };
}
