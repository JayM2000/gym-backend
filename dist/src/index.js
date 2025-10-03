"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("@clerk/express");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = __importDefault(require("express"));
const userAuthentication_1 = __importDefault(require("./routes/userAuth/userAuthentication"));
dotenv_1.default.config();
const app = (0, express_2.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({ origin: true }));
app.use(express_2.default.json());
app.use(express_2.default.urlencoded({ extended: true }));
app.use((0, express_1.clerkMiddleware)({ debug: true }));
app.get("/", (req, res) => {
    res.send("Server started...");
});
app.use("/api", userAuthentication_1.default);
// app.get("/hm", legacyRequireAuth, (req: Request, res: Response) => {
//   console.log('inside get req');
//   const { userId } = getAuth(req);
//   const userInfo = clerkClient.users.getUser(userId ?? "");
//   return res.json({ userInfo });
// });
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
