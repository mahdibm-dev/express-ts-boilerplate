import User from "@/models/user.model"
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  sendResetEmail,
  verifyResetToken
} from "@/services/auth"
import {
  createUser,
  deleteUser as deleteUserService,
  fetchUserByEmail,
  fetchUserById,
  updatePassword,
  updateUser as updateUserService,
  updateUserStatus
} from "@/services/user"
import bcrypt from "bcrypt"
import { Request, Response } from "express"

// all users
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json("email and password are required")
    }
    const user = await fetchUserByEmail(email)
    if (!user) {
      return res.status(404).json("User not found")
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json("wrong credentials")
    }
    if (user.role === "affiliate") {
      if (user.status === "waiting list" || user.status === "") {
        return res.status(403).json("You are still in the waiting list")
      }
      if (user.status === "denied") {
        return res
          .status(403)
          .json("Your request has been denied. Please contact the administrator for more information.")
      }
    }
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    return res.status(200).json({ success: true, message: "Login successful", accessToken, refreshToken })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body
    console.log("Received email:", email)
    if (!email) {
      console.log("Email is required")
      return res.status(400).json({ success: false, message: "Email is required" })
    }
    const user = await fetchUserByEmail(email)
    if (!user) {
      console.log("User not found")
      return res.status(404).json({ success: false, message: "User not found" })
    }
    const resetToken = generateResetToken(user)
    await sendResetEmail(user, resetToken)
    return res.status(200).json({ success: true, message: "Password reset instructions sent to your email" })
  } catch (error) {
    console.error("Error during password reset:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { resetToken, newPassword } = req.body
    if (!resetToken || !newPassword) {
      return res.status(400).json("Reset token and new password are required")
    }
    const decodedToken = verifyResetToken(resetToken)
    if (typeof decodedToken === "string" || !decodedToken) {
      return res.status(403).json({ message: "Invalid reset token" })
    }
    await updatePassword(decodedToken.id, newPassword)
    return res.status(200).json({ success: true, message: "Password reset successful" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

// super users
export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll()
    return res.status(200).send({ success: true, data: users })
  } catch (error) {
    return res.status(500).send({
      message: error.message || "Some error occurred while retrieving users."
    })
  }
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
  try {
    const userId = parseInt(req.params.id)
    const { email, password, role } = req.body
    if (!userId) {
      return res.status(400).json("userId is required")
    }

    const existingUser = await fetchUserById(userId)
    if (!existingUser) {
      return res.status(404).json("User not found")
    }
    let hashedPassword
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }
    const userData: { email?: string; password?: string; role?: string } = {}
    if (email) userData.email = email
    if (hashedPassword) userData.password = hashedPassword
    if (role) userData.role = role
    await updateUserService(userId, userData)
    return res.status(200).json({ success: true, message: "User updated successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
  try {
    const userId = parseInt(req.params.id)
    console.log("userId", userId)

    if (!userId) {
      return res.status(400).json("userId is required")
    }
    const existingUser = await User.findByPk(userId)
    if (!existingUser) {
      return res.status(404).json("User not found")
    }
    await deleteUserService(userId)
    return res.status(200).json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

export async function registerUserByRole(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body
    if (!email || !password || !role) {
      return res.status(400).json("missing credentials")
    }
    const existingUser = await fetchUserByEmail(email)
    if (existingUser) {
      return res.status(409).json("Email is already in use")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await createUser({ email, password: hashedPassword, role })
    return res.status(201).json({ success: true, message: "You have been registered as a " + role + " successfully." })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

export async function approveRegistration(req: Request, res: Response) {
  try {
    const { affiliatesIds }: { affiliatesIds: number[] } = req.body
    if (!affiliatesIds || !Array.isArray(affiliatesIds)) {
      return res.status(400).json("affiliatesIds must be provided as an array")
    }
    await Promise.all(affiliatesIds.map((userId) => updateUserStatus([userId], "approved")))
    return res.status(200).json({ success: true, message: "Affiliates approved successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}
export async function denyRegistration(req: Request, res: Response) {
  try {
    const { affiliatesIds }: { affiliatesIds: number[] } = req.body
    if (!affiliatesIds || !Array.isArray(affiliatesIds)) {
      return res.status(400).json("affiliatesIds must be provided as an array")
    }
    await Promise.all(affiliatesIds.map((userId) => updateUserStatus([userId], "denied")))
    return res.status(200).json({ success: true, message: "Affiliates denied successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}
// affiliates

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json("email and password are required")
    }
    const existingUser = await fetchUserByEmail(email)
    if (existingUser) {
      return res.status(409).json("Email is already in use")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await createUser({ email, password: hashedPassword, role: "affiliate", status: "waiting list" })
    return res
      .status(201)
      .json({ success: true, message: "You have been registered successfully. You are now on the waiting list." })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}
