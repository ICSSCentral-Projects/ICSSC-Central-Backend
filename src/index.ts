// Trigger restart for Strapi to remove schemas
import type { Core } from '@strapi/strapi';

const UST_EMAIL_DOMAIN = '@ust.edu.ph';
const MAX_SUPER_ADMINS = 2;
const SUPER_ADMIN_CODE = 'strapi-super-admin';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ------------------------------------------------------------------ //
    //  Super Admin integrity audit                                         //
    //  Runs on every startup to catch any accounts that bypassed the       //
    //  service-layer guards (e.g. direct DB manipulation).                 //
    // ------------------------------------------------------------------ //
    try {
      const superAdminRole = await strapi.query('admin::role').findOne({
        where: { code: SUPER_ADMIN_CODE },
      });

      if (superAdminRole) {
        const superAdmins = await strapi.query('admin::user').findMany({
          where: { roles: { id: superAdminRole.id } },
          populate: ['roles'],
        });

        // --- Rule 1: All Super Admin emails must be @ust.edu.ph ----------
        const invalidEmailAdmins = superAdmins.filter(
          (u: any) =>
            !u.email?.toLowerCase().endsWith(UST_EMAIL_DOMAIN)
        );
        if (invalidEmailAdmins.length > 0) {
          strapi.log.warn(
            `[SuperAdmin Audit] ${invalidEmailAdmins.length} Super Admin account(s) ` +
              `do NOT use a ${UST_EMAIL_DOMAIN} email: ` +
              invalidEmailAdmins.map((u: any) => u.email).join(', ') +
              '. These accounts should be corrected or removed.'
          );
        }

        // --- Rule 2: Max 2 Super Admins -----------------------------------
        if (superAdmins.length > MAX_SUPER_ADMINS) {
          strapi.log.warn(
            `[SuperAdmin Audit] ${superAdmins.length} Super Admin accounts found — ` +
              `maximum allowed is ${MAX_SUPER_ADMINS}. ` +
              'Please remove the excess accounts via the Admin Panel.'
          );
        }

        // --- Rule 3: Unique emails among Super Admins ---------------------
        const emails = superAdmins.map((u: any) => u.email?.toLowerCase());
        const duplicates = emails.filter(
          (e: string, i: number) => emails.indexOf(e) !== i
        );
        if (duplicates.length > 0) {
          strapi.log.warn(
            `[SuperAdmin Audit] Duplicate Super Admin email(s) detected: ${[...new Set(duplicates)].join(', ')}. ` +
              'Each Super Admin must have a unique email address.'
          );
        }

        if (
          invalidEmailAdmins.length === 0 &&
          superAdmins.length <= MAX_SUPER_ADMINS &&
          duplicates.length === 0
        ) {
          strapi.log.info(
            `[SuperAdmin Audit] OK — ${superAdmins.length}/${MAX_SUPER_ADMINS} Super Admin account(s), all ${UST_EMAIL_DOMAIN}.`
          );
        }
      }
    } catch (err) {
      strapi.log.error('[SuperAdmin Audit] Failed to run integrity check:', err);
    }
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      if (publicRole) {
        const actions = [
          'api::foi-request.foi-request.find',
          'api::foi-request.foi-request.findOne'
        ];
        
        for (const action of actions) {
          const existing = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { role: publicRole.id, action }
          });
          if (!existing) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action, role: publicRole.id }
            });
            strapi.log.info(`Granted public permission: ${action}`);
          }
        }
      }

      // Automatically create a test Author user
      const authorRole = await strapi.query('admin::role').findOne({ where: { code: 'strapi-author' } });
      if (authorRole) {
        const existingAuthor = await strapi.query('admin::user').findOne({ where: { email: 'author@test.com' } });
        if (!existingAuthor) {
          try {
            const adminAuthService = strapi.service('admin::auth');
            const hashedPassword = await adminAuthService.hashPassword('Author123!');
            
            await strapi.query('admin::user').create({
              data: {
                email: 'author@test.com',
                firstname: 'Test',
                lastname: 'Author',
                password: hashedPassword,
                roles: [authorRole.id],
                isActive: true,
                blocked: false,
                preferedLanguage: 'en',
              }
            });
            strapi.log.info('Successfully created dummy Author user: author@test.com');
          } catch (e) {
            strapi.log.error('Failed to create dummy Author user:', e);
          }
        }
      }

      // Production Migration: Convert old timestamp dates to YYYY-MM-DD in events
      try {
        const events = await strapi.db.query('api::event.event').findMany();
        for (const event of events) {
          if (event.date && !String(event.date).includes('-')) {
            const parsed = new Date(Number(event.date));
            if (!isNaN(parsed.getTime())) {
              const formattedDate = parsed.toISOString().split('T')[0];
              await strapi.db.query('api::event.event').update({
                where: { id: event.id },
                data: { date: formattedDate }
              });
              strapi.log.info(`Migrated event ${event.id} date to ${formattedDate}`);
            }
          }
        }
      } catch (err) {
        strapi.log.error('Failed to migrate dates:', err);
      }
    } catch (err) {
      strapi.log.error('Failed to bootstrap permissions:', err);
    }
  },
};
