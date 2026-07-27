const { createClient } = require("./Supabasehelpers");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

//checks that the request has a valid logged in user before letting it continue
async function requireLoggedInUser(req, res, next) {
    // read the Authorization header sent from the frontend, example: "Bearer abc123"
    const authHeader = req.headers.authorization;
    // check if the header is missing
    if (!authHeader) {
        // no header at all, reject the request
        res.status(401).json({ error: 'Missing Authorization header' });
        return;
    }
    const headerParts = authHeader.split(' ');
    // check that the header is formatted correctly
    if (headerParts.length !== 2 || headerParts[0] !== "Bearer") {
        // header exists but is formatted wrong, reject the request
        res.status(401).json({ error: 'Invalid Authorization header format' });
        return;
    }
    const userToken = headerParts[1];
    // ask supabase who this token belongs to
    const userResult = await supabasePublic.auth.getUser(userToken);
    const user = userResult.data.user;
    const error = userResult.error;

    // check if the token was invalid or expired
    if (error || !user) {
        // token did not match a real logged in user, reject the request
        res.status(401).json({ error: 'Invalid or expired login token' });
        return;
    }
    // attach the verified user onto the request object so later routes can use it
    req.verifiedUser = user;
    // attach the raw token so routes can use it to act as this exact user
    req.userAccessToken = userToken;
    // let the request continue on to the actual route
    next();
}
module.exports = requireLoggedInUser;