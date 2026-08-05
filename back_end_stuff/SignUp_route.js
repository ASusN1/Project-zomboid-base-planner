const { supabaseBase } = require('./supabaseHelpers');
 
const allowedUsernameCharacters = /^[A-Za-z0-9_]{3,20}$/;
const allowedPasswordCharacters = /^[A-Za-z0-9_]{12,25}$/;
function registerSignupRoute(app) {
    app.post("/auth/signup", async (req, res) => {
        const emailValue = req.body.email;
        const passwordValue = req.body.password;
        const usernameValue = req.body.username;
 
        if (!usernameValue) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }
        if (!allowedUsernameCharacters.test(usernameValue)) {
            res.status(400).json({ error: "Invalid username. Use only letters, numbers, and underscores, 3-20 characters long." });
            return;
        }
        if (!passwordValue){
            res.status(400).json({ error: "password is required" });
            return;
        }
        if (!allowedPasswordCharacters.test(passwordValue)) {
            res.status(400).json({ error: "Invalid password. Use only letters, numbers, and underscores, 12-25 characters long." });
            return;
        }
 
        const signUpResult = await supabaseBase.auth.signUp({ email: emailValue, password: passwordValue, options: { data: { username: usernameValue } } });
 
        if (signUpResult.error) {
            res.status(400).json({ error: signUpResult.error.message });
            return;
        }
 
        const newUser = signUpResult.data.user;
        if (newUser) {
            const profileInsertResult = await supabaseBase
                .from('profiles')
                .insert({ id: newUser.id, username: usernameValue });
 
            if (profileInsertResult.error) {
                res.status(400).json({ error: profileInsertResult.error.message });
                return;
            }
        }
 
        res.status(200).json({ message: 'Account created successfully. Please check your email to confirm your account.' });
    });
}

module.exports = registerSignupRoute;