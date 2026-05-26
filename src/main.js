import { UsersService } from './services/UsersService.js';
import { AdminsService } from './services/AdminsService.js';
import { SuperAdminService } from './services/SuperAdminService.js';
import { Database } from './db/db.js';

import { UsersRepository } from './repositories/UsersRepository.js';
import { AdminRepository } from './repositories/AdminRepository.js';
import { SuperAdminRepository } from './repositories/SuperAdminRepository.js';

async function run() {
    const db = Database.getInstance();
    
    try {
        await db.clearTables(); 
        
        const usersRepo = new UsersRepository();
        const adminsRepo = new AdminRepository();
        const superAdminsRepo = new SuperAdminRepository();

        const usersService = new UsersService(usersRepo, adminsRepo, superAdminsRepo);
        const adminsService = new AdminsService(adminsRepo);
        const superAdminService = new SuperAdminService(superAdminsRepo);
        await db.createTables();

        const u1 = await usersService.createUser({ name: "Alex Doe", email: "alex@mail.com" });
        console.log("[БД] Успішно збережено користувача:", u1);

        const u2 = await usersService.createUser({ name: "Jane Doe", email: "jane@mail.com" });
        console.log("[БД] Успішно збережено користувача:", u2);

        const u3 = await usersService.createUser({ name: "Ivan Doe", email: "ivan@mail.com" });
        console.log("[БД] Успішно збережено користувача:", u3);

        const a1 = await adminsService.createAdmin({ user_id: u1.id });
        console.log("\n[БД] Надано права ADMIN для User ID:", u1.id, a1);

        const sa1 = await superAdminService.createSuperAdmin({ user_id: u2.id });
        console.log("[БД] Надано права SUPER_ADMIN для User ID:", u2.id, sa1);

        console.log("\n--- ПРАВА ДОСТУПУ ---");
        console.log(`Чи є Alex (ID: ${u1.id}) адміном? ->`, await usersService.isAdmin(u1.id));
        console.log(`Чи є Jane (ID: ${u2.id}) супер-адміном? ->`, await usersService.isSuperAdmin(u2.id));
        console.log(`Чи є Ivan (ID: ${u3.id}) адміном? ->`, await usersService.isAdmin(u3.id));

        console.log("\n--- ЗМІНА ДАНИХ ---");
        const updated = await usersService.updateUser(u3.id, { name: "Ivan Real Postgres", email: "ivan.real@postgres.com" });
        console.log("[БД] Оновлено профіль Івана:", updated);

        const deletedAdmin = await adminsService.deleteAdmin(u1.id);
        console.log("[БД] Знято повноваження адміна з User ID:", u1.id, deletedAdmin);

        console.log(`Чи є Alex (ID: ${u1.id}) все ще адміном? ->`, await usersService.isAdmin(u1.id));

    } catch (error) {
        console.error("Критична помилка під час виконання SQL-запитів:", error.message);
    } finally {
        await db.close();
    }
}

run();