const requireLoggedINUser = require("./requireLoggedInUser");
const {buildSupabaseClientForUser} = require("./Supabasehelpers");

function registerGetCurrentUserRoute(app) {
    app.get("/auth/me", requireLoggedINUser, async (req, res) => {
        const user = req.verifiedUser;
        const supabaseForThisUser = buildSupabaseClientForUser(req.userAccessToken);

        const profileResult = await supabaseForThisUser
            .from("profiles")
            .select("avatar_url")
            .eq("id", user.id)
            .single();
        
        let avatarUrl = null;
        if (profileResult.data && profileResult.data.avatar_url) {
            avatarUrl = profileResult.data.avatar_url;
        }

        res.status(200).json({
            id: user.id,
            email: user.email,
            avatar_url: avatarUrl
        });
    });
}

module.exports = registerGetCurrentUserRoute;