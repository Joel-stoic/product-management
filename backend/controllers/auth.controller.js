import bcrypt from "bcryptjs"
import { User } from "../models/user.model.js"
import { generateToken } from "../config/jwt.js"

export const login = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" })
        }

        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        return res.status(200).json({
            _id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })

    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ message: "Server error" })
    }
}

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, profileImageUrl, adminInviteToken } = req.body
        profileImageUrl
        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        // Default role
        let role = "member"
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin"
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" })
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create the new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role,
            profileImageUrl
        })

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            }
        })

    } catch (error) {
        console.error("Signup error:", error)
        res.status(500).json({ message: "Server error" })
    }
}

export const logout = async (req, res) => {

}

export const getUserProfile = async (req, res) => {
    try {
        const users = await User.findById(req.user.id).select("-password")
        if (!users) {
            return res.status(400).json({ message: "User not found" })
        }
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Ensure req.user is set by auth middleware

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10); // Add await here!
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
       return res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });

    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
}
};



