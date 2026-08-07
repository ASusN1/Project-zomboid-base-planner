require("dotenv").config();
const express = require("express");
const cors = require('cors');// let front end connect with backend 
const { createClient } = require('@supabase/supabase-js');

const { supabaseBase } = require("./Supabasehelpers");

const registerSignupRoute = require("./SignUp_route");
const registerLoginRoute = require("./Login_route");
const registerGetCurrentUserRoute = require("./get_current_user_route");
const registerSaveDesignRoute = require("./save_design_route");
const {registerListDesignsRoute, registerDeleteDesignsRoute, registerShareDesignRoutes} = require("./Designs_list_delete_share_routes");
const registerListCommunityDesignsRoute = require("./List_community_designs_route");

const registerPasswordResetRoute = require("./PasswordReset_route");

const PORT = process.env.PORT || 3000; 
console.log('Server will run on port ' + PORT);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const app = express();
const rateLimit = require("express-rate-limit");

app.use(cors({origin: FRONTEND_ORIGIN, credentials: true})); // allow front end to connect with backend
app.use(express.json({limit: "50kb"})); // allow json body in requests, limit to 50kb

const uploadRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,// 20 req /ip
    message: "Too many requests from this IP, please try again later."
});

const loginRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,// 5 req /ip
    message: "Too many login attempts from this IP, please try again later."
});


app.use(uploadRateLimiter); // apply rate limiting to all requests

app.get("/", (req, res) => {
    res.send("PZ base planner running");
});

registerSignupRoute(app);
app.use("/auth/login", loginRateLimiter);
registerLoginRoute(app);
registerGetCurrentUserRoute(app);
registerSaveDesignRoute(app);
registerListDesignsRoute(app);
registerDeleteDesignsRoute(app);
registerShareDesignRoutes(app);
registerListCommunityDesignsRoute(app);
registerPasswordResetRoute(app);

app.listen(PORT, () => {
    console.log("sever is runing on port " + PORT);;
})