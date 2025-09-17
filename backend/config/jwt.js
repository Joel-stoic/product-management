import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
    try {
        const token = jwt.sign(
            { userId },                  
            process.env.JWT_SECRET,      
            { expiresIn: "7d" }          
        )

        return token  // ✅ returns the token

    } catch (error) {
        console.log("Error in generateToken", error)
    }
}
