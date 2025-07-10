// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GitHubStrategy = require('passport-github2').Strategy;
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL,
// },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             let user = await User.findOne({ googleId: profile.id });
//             if (!user) {
//                 user = await User.create({
//                     googleId: profile.id,
//                     username: profile.displayName,
//                     email: profile.emails[0].value,
//                     avatar: profile.photos[0].value,
//                 });
//             }
//             return done(null, user);
//         } catch (err) {
//             return done(err, null);
//         }
//     }
// ));

// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: '/api/auth/github/callback'
// },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             let user = await User.findOne({ githubId: profile.id });
//             if (!user) {
//                 user = await User.create({
//                     githubId: profile.id,
//                     username: profile.username,
//                     email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
//                     avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
//                 });
//             }
//             return done(null, user);
//         } catch (err) {
//             return done(err, null);
//         }
//     }
// ));

// // Serialize/deserialize (không dùng session, chỉ để Passport không báo lỗi)
// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser((id, done) => done(null, id));

// module.exports = passport;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const avatar = profile.photos?.[0]?.value;
        const username = profile.displayName;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                username,
                email,
                avatar,
                googleId,
                password: 'oauth_google' // optional placeholder
            });
        } else if (!user.googleId) {
            // ✅ Ghi nhận googleId nếu user đã tồn tại nhưng chưa gắn Google
            user.googleId = googleId;
            user.avatar = user.avatar || avatar;
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));

module.exports = passport;

