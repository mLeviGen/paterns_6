import { AdminRepository } from '../repositories/AdminRepository.js';

export class AdminsService {
    constructor(adminRepository) { this.adminRepository = adminRepository; }
    async createAdmin(admin) { return await this.adminRepository.insert(admin); }
    async getAllAdmins() { return await this.adminRepository.findAll(); }
    async deleteAdmin(userId) { return await this.adminRepository.delete(userId); }
}