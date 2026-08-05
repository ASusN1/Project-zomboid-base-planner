const {supabaseBase} = require("./Supabasehelpers");

function registerLoginRoute(app) {
    app.post('/auth/login', async (req, res) => {
        const emailValue = req.body.email;
        const passwordValue = req.body.password;

        const loginResult = await supabaseBase.auth.signInWithPassword({email: emailValue, password: passwordValue });

        if (loginResult.error) {
            res.status(400).json({ error: loginResult.error.message });
            return;
        }

        const session = loginResult.data.session;
        const user = loginResult.data.user;

        res.status(200).json({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            user: { 
                id: user.id, 
                email: user.email }
        });
    });
}

module.exports = registerLoginRoute;