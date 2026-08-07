const allowedPasswordCharacters = /^[A-Za-z0-9_]{12,25}$/;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

function registerPasswordResetRoute(app) {
    // send email for user
    app.post("/auth/forgot-password", async (req, res) => {
        const emailValue = req.body.email;

        if (!emailValue) {
            res.status(400).json({ error: "Email is required" });
            return;
        }

        const redirectTo = process.env.FRONTEND_ORIGIN + "/resetPassword/reset_password.html";

        const supabaseResponse = await fetch(SUPABASE_URL + "/auth/v1/recover", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_ANON_KEY
            },
            body: JSON.stringify({
                email: emailValue,
                gotrue_meta_security: {},
                redirectTo: redirectTo
            }),
        });

        if (!supabaseResponse.ok) {
            const errorBody = await supabaseResponse.json();
            res.status(400).json({ error: errorBody.msg || errorBody.error_description || "Could not send password reset" });
            return;
        }

        res.status(200).json({ message: "Password reset email sent if the email exists" });
    });

    // user clicked link and submits new password
    app.post("/auth/reset-password", async (req, res) => {
        const accessToken = req.body.accessToken;
        const newPassword = req.body.newPassword;

        if (!accessToken) {
            res.status(400).json({ error: "Missing recovery token" });
            return;
        }

        if (!newPassword) {
            res.status(400).json({ error: "New password is required" });
            return;
        }

        if (!allowedPasswordCharacters.test(newPassword)) {
            res.status(400).json({ error: "Invalid password format" });
            return;
        }

        const supabaseResponse = await fetch(SUPABASE_URL + "/auth/v1/user", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": "Bearer " + accessToken,
            },
            body: JSON.stringify({
                password: newPassword
            }),
        });

        if (!supabaseResponse.ok) {
            const errorBody = await supabaseResponse.json();
            res.status(400).json({ error: errorBody.msg || errorBody.error_description || "Could not update password" });
            return;
        }

        res.status(200).json({ message: "Password updated successfully" });
    });
}

module.exports = registerPasswordResetRoute;