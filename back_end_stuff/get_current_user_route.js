const requireLoggedINUser = require("./requireLoggedInUser");
const {buildSupabaseCleintForUser} = require("./supabaseHelpers");

function registerGetCurrentUserRoute(app) {
    app.get("auth/me", requireLoggedINUser, async (req, res) => {
        const user = req.vertifiedUser;
        const supabaseForThisUser = buildSupabaseCleintForUser(req.userAccessToken);

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