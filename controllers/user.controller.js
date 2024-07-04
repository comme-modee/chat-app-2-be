const userController = {};
const User = require('../models/User')

userController.saveUser = async (userName, sid) => {
    try {
        let user = await User.findOne({ name: userName })
        if(!user) {
            user = new User({
                name: userName,
                token: sid,
                online: true
            })
        }
        user.token = sid;
        user.online = true;

        await user.save()
        return user;
    } catch (error) {
        console.log('error', error)
    }
}

userController.checkUser = async (sid) => {
    const user = await User.findOne({ token: sid })
    if(!user) throw new Error('User not found')
    return user;
}

module.exports = userController