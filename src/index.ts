// Trigger restart for Strapi to remove schemas
// import type { Core } from '@strapi/strapi';

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
  async bootstrap({ strapi }) {
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
      strapi.log.error('Failed to bootstrap permissions:', err);
    }
  },
};
