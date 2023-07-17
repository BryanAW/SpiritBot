// Unused as of now but implementation is planned for daily command. Database is causing confusion (need to learn more in detail)

const User = require('./models/User');

async function updateStreak(userId) {
    try {
        const user = await User.findOneAndUpdate(
            { userId },
            { $setOnInsert: { userId } },
            { upsert: true, new: true }
        );

        const currentDate = new Date().toLocaleDateString();

        if (user.lastRunDate && user.lastRunDate.toISOString().split('T')[0] === currentDate) {
            user.streak += 1;
        } else {
            user.streak = 1;
        }
        user.lastRunDate = new Date();

        await user.save();

        return user.streak;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to update streak.');
    }
}

module.exports = { updateStreak };
