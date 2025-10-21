export const validateBody = (dto) => (req,res,next) =>{
    const {error} = dto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details});
    next();
};

export const validateParams = (dto) => (req, res, next) => {
  const { error } = dto.validate(req.params);
  if (error) return res.status(400).json({ error: error.details });
  next();
};

export const validateQuery = (dto) => (req, res, next) => {
  const { error } = dto.validate(req.query);
  if (error) return res.status(400).json({ error: error.details });
  next();
};