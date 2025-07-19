import bcrypt from 'bcrypt';

export const hashService = {
    createHash: async (password:string) => await bcrypt.hash(password, 10),
    comparePassword: async (password:string, hashPassword:string) => await bcrypt.compare(password, hashPassword)
}