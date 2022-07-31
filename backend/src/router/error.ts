import express,{Request, Response} from "express";

const router = express.Router();

router.use("*", (req, res) => {
    res.status(404).json({
      success: "false",
      message: "Page not found",
      error: {
        statusCode: 404,
        message: "You reached a route that is not defined on this server",
      },
    });
});

export { router as ErrorRoute}
