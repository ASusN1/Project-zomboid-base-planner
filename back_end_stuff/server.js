require("dotenv").config();
const express = require("express");
// let front end connect with backend 
const cors = require('cors');
// multer is for read upload files (preview image + json)  
const multer = require("multer");
const { createClient } = require('@supabase/supabase-js');
// load rate limit pakge
const rateLimit = require("express-rate-limit");
const requireLoggedInUser = require("./requireLoggedInUser");

const registerSignupRoute = require("./signup_route");
const registerLoginRoute = require("./login_route");
const registerGetCurrentUserRoute = require("./get_current_user_route");
const registerSaveDesignRoute = require("./save_design_route");
const {registerListDesignsRoute, registerDeleteDesignsRoute, registerShareDesignRoutes} = require("./designs_list_delete_share_routes");
const registerListCommunityDesignsRoute = require("./list_community_designs_route");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

// read what port to run the server on, if not set default to 3000
const PORT = process.env.PORT || 3000; // testing for now 
console.log('Server will run on port ' + PORT);
const supabaseBase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

//builds a supabase client that acts as one specific logged in user
function buildSupabaseClientForUser(userAccessToken) {
    // create a new client that sends the user's login token on every request
    const clientForThisUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: 'Bearer ' + userAccessToken
            }
        }
    });
    return clientForThisUser;
}
const app = express();

//only accept call from front end
app.use(cors({ origin: FRONTEND_ORIGIN }));

//json file limit = 50 kb per upload (might change if needed) 
app.use(express.json({ limit: "50kb" }));
const upload = multer({ storage: multer.memoryStorage() });

// rate limit rule
const uploadRateLimiter = rateLimit({
    windowMs: 60 * 1000, // count requests inside a 1 minute window
    max: 20, // allow at most 20 requests per ip address inside that window
    message: { error: 'Too many requests, please slow down and try again in a minute' }
});

// apply the rate limit rule to every route in this app
app.use(uploadRateLimiter);

//check is server alive
app.get('/', (req, res) => {
    res.send('PZ Base Planner backend is running');
});

//handle upload preview iamge for base deisng --> return public url for that image
app.post('/upload-preview', requireLoggedInUser, upload.single('previewImage'), async (req, res) => {
    // grab the uploaded file from the request
    const uploadedFile = req.file;
    const projectId = req.body.projectId;
    const userId = req.verifiedUser.id;

    // check that all the required data was actually sent
    if (!uploadedFile || !projectId) {
        // missing data, tell the frontend it was a bad request
        res.status(400).json({ error: 'Missing uploadedFile or projectId' });
        return;
    }
    const supabaseForThisUser = buildSupabaseClientForUser(req.userAccessToken);
    const previewPath = userId + '/' + projectId + '.jpg';

    // upload the image buffer to the supabase storage bucket using the user scoped client
    const uploadResult = await supabaseForThisUser.storage
        .from('design-preview-card-picture')
        .upload(previewPath, uploadedFile.buffer, { upsert: true, contentType: 'image/jpeg' });

    // check if the upload failed -> send message
    if (uploadResult.error) {
        console.log('Upload error: ' + uploadResult.error.message);
        res.status(500).json({ error: uploadResult.error.message });
        return;
    }

    // get the public url for the uploaded image
    const publicUrlResult = supabaseForThisUser.storage
        .from('design-preview-card-picture')
        .getPublicUrl(previewPath);
    // build a cache busting timestamp so the browser always shows the newest image
    const timestampForCacheBust = Date.now();
    // combine the public url with the timestamp
    const finalPreviewUrl = publicUrlResult.data.publicUrl + '?t=' + timestampForCacheBust;
    // send the final url back to the frontend so it can save it in the designs table
    res.status(200).json({ previewUrl: finalPreviewUrl });
});

registerSignupRoute(app);
registerLoginRoute(app);
registerGetCurrentUserRoute(app);
registerSaveDesignRoute(app);
registerListDesignsRoute(app);
registerDeleteDesignsRoute(app);
registerShareDesignRoutes(app);
registerListCommunityDesignsRoute(app);

// start the server and listen for requests on the chosen port
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});