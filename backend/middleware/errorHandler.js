const errorHandler = (err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: "An unexpected error occurred" });
  };
  
  module.exports = errorHandler;
  