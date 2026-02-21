const { InvalidRequestException, NotFoundException } = require("../utils/Exception");
const MessageConstant = require("../constant/MessageConstant");
const bcrypt = require("bcrypt");
const UserRepository = require("../repository/UserRepository");

class UserService {
    // Create User
    async addUser(data) {
        const { email, name, password } = data;
        // const email = data.email
        // const name = data.name
        // const password = data.password
        // Validation
        if (!email || !name || !password) {
            throw new InvalidRequestException(MessageConstant.INVALID_REQUEST);
        }
        // convert password in becrypt
        data.password = await bcrypt.hash(password, 10);
        // store data into and return it
        return await UserRepository.addUser(data);
    }

    // Get all users
    async getAllUsers() {
        return await UserRepository.getAllUsers();
    }

    // Login User
    async loginUser(data) {
        const { email, password, role } = data;
        // Validation
        if (!email || !password || !role) {
            throw new InvalidRequestException(MessageConstant.INVALID_REQUEST);
        }
        // Get user by email
        const user = await UserRepository.loginUser(email);
        if (!user) {
            throw new InvalidRequestException(MessageConstant.USER_DOES_NOT_EXIST_WITH_THIS_EMAIL);
        }
        // Role mismatch
        if (user.role !== role) {
            throw new InvalidRequestException(MessageConstant.ROLE_MISMATCH);
        }
        // Password check (plain text in your DB)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new InvalidRequestException(MessageConstant.INCORRECT_PASSWORD);
        }
        // Success return — do NOT return success:true (controller handles success)
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }

    // Get user by ID
    async getUserById(id) {
        if (!id)
            throw new InvalidRequestException(
                MessageConstant.INVALID_REQUEST,
            );
        const user = await UserRepository.getUserById(id);
        if (!user) {
            throw new NotFoundException(MessageConstant.NO_DATA_FOUND);
        }
        return user;
    }

    // Update User
    async updateUserById(id, data) {
        if (!id || !data)
            throw new InvalidRequestException(
                MessageConstant.INVALID_REQUEST,
            );
        if (data?.password) {
            // convert password in becrypt
            data.password = await bcrypt.hash(data?.password, 10);
        }
        const updated = await UserRepository.updateUserById(id, data);
        // Sequelize update returns: [count, [updatedObject]]
        return updated[1]?.[0] || null;
    }

    // Soft Delete User
    async deleteUserById(id) {
        if (!id)
            throw new InvalidRequestException(
                MessageConstant.INVALID_REQUEST,
            );
        const user = await UserRepository.deleteUserById(id);
        if (!user?.[0]) {
            throw new NotFoundException(MessageConstant.NO_DATA_FOUND);
        }
    }
}

module.exports = new UserService();