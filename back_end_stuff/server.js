require("dotenv").config();
const express = require("express");
const cors = require('cors');// let front end connect with backend 
const multer = require("multer");// multer is for read upload files (preview image + json)  
const { createClient } = require('@supabase/supabase-js');

const {supabaseBase, buildSupabaseClientForUSer} = require("./Supabasehelpers");

const registerSignupRoute = require("./SignUp_route");
const registerLoginRoute = require("./Login_route");
const registerGetCurrentUserRoute = require("./get_current_user_route");
const registerSaveDesignRoute = require("./save_design_route");
const {registerListDesignsRoute, registerDeleteDesignsRoute, registerShareDesignRoutes} = require("./Designs_list_delete_share_routes");
const registerListCommunityDesignsRoute = require("./List_community_designs_route");

// read what port to run the server on, if not set default to 3000
const PORT = process.env.PORT || 3000; // testing for now 
console.log('Server will run on port ' + PORT);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const app = express();
const rateLimit = require("express-rate-limit");

app.use(cors({origin: FRONTEND_ORIGIN, credentials: true})); // allow front end to connect with backend
app.use(express.json({limit: "50kb"})); // allow json body in requests, limit to 50kb

const uploadRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: "Too many requests from this IP, please try again later."
});

app.use(uploadRateLimiter); // apply rate limiting to all requests

app.get("/", (req, res) => {
    res.send("PZ base planner running");
});

registerSignupRoute(app);
registerLoginRoute(app);
registerGetCurrentUserRoute(app);
registerSaveDesignRoute(app);
registerListDesignsRoute(app);
registerDeleteDesignsRoute(app);
registerShareDesignRoutes(app);
registerListCommunityDesignsRoute(app);

app.listen(PORT, () => {
    console.log("sever is runing on port " + PORT);;
})