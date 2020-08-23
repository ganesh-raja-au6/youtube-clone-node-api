const [path, _] = [require('path'), require('lodash')]
const User = require(path.join(__dirname, '..', 'models', 'User'))

exports.getUserById = async (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) return res.status(500).json({success: false, error: `No valid user found.`})
        req.profile = user
        next()
    })
}

exports.getAllUsers = async (req, res) => {
    User.find((err, users) => {
        if(err) return res.status(500).json({success: false, error : err.message})
        return res.json({users})
    }).select('_id name email createdAt updatedAt')
}

exports.getSingleUser = async (req, res) => {
    const user = req.profile
    if(!user) return res.status(400).json({success: false, error: `No valid user found with id ${req.params.userId}`})
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.json({user})
}

exports.updateUser = async (req, res) => {
    let user = req.profile
    if(!user) return res.status(400).json({success: false, error: `No valid user found with id ${req.params.userId}`})
    user = _.extend(user, req.body)
    user.save((err) => {
        if(err) return res.status(500).json({success: false, error : err.message})
        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json({success: true, user})
    })
}

exports.deleteUser= async (req, res) => {
    const user = req.profile
    if(!user) return res.status(400).json({success: false, error: `No valid user found with id ${req.params.userId}`})
    user.remove((err) => {
        if(err) return res.status(500).json({success: false, error : err.message})
        return res.json({success: true, message: `User removed successfully.`})
    })
}