// tests/services/userService.test.js
const userService = require('../../services/userService');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
jest.mock('../../models/User');
jest.mock('bcrypt');

describe('userService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return users without passwords', async () => {
            const fakeUsers = [
                { _id: '1', username: 'Alice', email: 'a@example.com' },
                { _id: '2', username: 'Bob', email: 'b@example.com' }
            ];
            User.find.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUsers) });

            const users = await userService.getAllUsers();
            expect(users).toEqual(fakeUsers);
            expect(User.find).toHaveBeenCalled();
        });
    });

    describe('createUser', () => {
        it('should hash password and create user', async () => {
            const input = {
                username: 'test',
                email: 'test@example.com',
                password: '123456',
                role: 'user'
            };

            const hashed = 'hashedpassword';
            const savedUser = { ...input, password: hashed };

            bcrypt.hash.mockResolvedValue(hashed);
            User.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(savedUser)
            }));

            const result = await userService.createUser(input);
            expect(result).toEqual(savedUser);
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
        });
    });

    describe('updateUser', () => {
        it('should update and return user without password', async () => {
            const userId = 'abc123';
            const newData = { username: 'newname' };
            const updatedUser = { _id: userId, ...newData };

            User.findByIdAndUpdate.mockReturnValue({
                select: jest.fn().mockResolvedValue(updatedUser)
            });

            const result = await userService.updateUser(userId, newData);
            expect(result).toEqual(updatedUser);
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, newData, { new: true });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by ID', async () => {
            const userId = 'abc123';
            User.findByIdAndDelete.mockResolvedValue({ _id: userId });

            const result = await userService.deleteUser(userId);
            expect(result).toEqual({ _id: userId });
            expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
        });
    });

});
