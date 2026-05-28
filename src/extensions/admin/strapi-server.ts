/**
 * Admin extension — Super Admin constraints
 *
 * Rules enforced:
 *  1. Only @ust.edu.ph email addresses may hold the Super Admin role.
 *  2. A maximum of 2 Super Admin accounts may exist at any time.
 *  3. Each Super Admin must have a unique email (1 email per Super Admin slot).
 *
 * Works by wrapping the admin::user create / update services so every
 * code-path that touches admin users (UI, REST API, CLI) goes through
 * the same checks.
 */

const UST_EMAIL_DOMAIN = '@ust.edu.ph';
const MAX_SUPER_ADMINS = 2;
const SUPER_ADMIN_CODE = 'strapi-super-admin';

/**
 * Resolve the numeric role id for "Super Admin" at runtime.
 */
async function getSuperAdminRoleId(strapi: any): Promise<number | null> {
  const role = await strapi.query('admin::role').findOne({
    where: { code: SUPER_ADMIN_CODE },
  });
  return role?.id ?? null;
}

/**
 * Return true when the given role-id array includes the Super Admin role.
 */
function includesSuperAdmin(roleIds: number[], superAdminId: number): boolean {
  return roleIds.map(Number).includes(Number(superAdminId));
}

/**
 * Validate that an email is a @ust.edu.ph address.
 */
function assertUstEmail(email: string): void {
  if (!email.toLowerCase().endsWith(UST_EMAIL_DOMAIN)) {
    throw new Error(
      `Super Admin accounts must use a ${UST_EMAIL_DOMAIN} email address.`
    );
  }
}

/**
 * Validate that the current Super Admin count + delta does not exceed the cap.
 * Pass delta=1 when creating, delta=0 when updating an existing Super Admin.
 */
async function assertSuperAdminCap(
  strapi: any,
  superAdminRoleId: number,
  delta: number,
  excludeUserId?: number
): Promise<void> {
  // Count users that already have the Super Admin role
  const existing = await strapi.query('admin::user').findMany({
    where: { roles: { id: superAdminRoleId } },
  });

  const currentCount = excludeUserId
    ? existing.filter((u: any) => u.id !== excludeUserId).length
    : existing.length;

  if (currentCount + delta > MAX_SUPER_ADMINS) {
    throw new Error(
      `A maximum of ${MAX_SUPER_ADMINS} Super Admin accounts are allowed. ` +
        `There ${currentCount === 1 ? 'is' : 'are'} already ${currentCount} Super Admin${currentCount !== 1 ? 's' : ''}.`
    );
  }
}

export default {
  bootstrap({ strapi }: { strapi: any }) {
    // ------------------------------------------------------------------ //
    //  Wrap admin::user create                                             //
    // ------------------------------------------------------------------ //
    const originalUserService = strapi.service('admin::user');

    const originalCreate = originalUserService.create.bind(originalUserService);
    originalUserService.create = async function (
      attributes: Record<string, any>
    ) {
      const superAdminRoleId = await getSuperAdminRoleId(strapi);

      if (superAdminRoleId !== null) {
        const roleIds: number[] = (attributes.roles ?? []).map(Number);

        if (includesSuperAdmin(roleIds, superAdminRoleId)) {
          // Validate email domain
          assertUstEmail(attributes.email ?? '');

          // Validate cap (adding 1 new Super Admin)
          await assertSuperAdminCap(strapi, superAdminRoleId, 1);
        }
      }

      return originalCreate(attributes);
    };

    // ------------------------------------------------------------------ //
    //  Wrap admin::user update                                             //
    // ------------------------------------------------------------------ //
    const originalUpdate = originalUserService.updateById.bind(originalUserService);
    originalUserService.updateById = async function (
      id: number,
      attributes: Record<string, any>
    ) {
      const superAdminRoleId = await getSuperAdminRoleId(strapi);

      if (superAdminRoleId !== null && attributes.roles !== undefined) {
        const newRoleIds: number[] = (attributes.roles ?? []).map(Number);
        const isBecomingSuperAdmin = includesSuperAdmin(newRoleIds, superAdminRoleId);

        // Fetch the current user to see their existing roles
        const currentUser = await strapi.query('admin::user').findOne({
          where: { id },
          populate: ['roles'],
        });

        const wasAlreadySuperAdmin =
          currentUser?.roles?.some(
            (r: any) => Number(r.id) === Number(superAdminRoleId)
          ) ?? false;

        if (isBecomingSuperAdmin) {
          // Validate email (use updated email if provided, otherwise current)
          const email = attributes.email ?? currentUser?.email ?? '';
          assertUstEmail(email);

          if (!wasAlreadySuperAdmin) {
            // A new user is being promoted: check cap, excluding themselves
            await assertSuperAdminCap(strapi, superAdminRoleId, 1, id);
          }
        }

        // If an existing Super Admin is having their email changed, re-validate
        if (wasAlreadySuperAdmin && attributes.email) {
          assertUstEmail(attributes.email);
        }
      }

      return originalUpdate(id, attributes);
    };

    strapi.log.info(
      '[Admin Extension] Super Admin constraints active — ' +
        `max ${MAX_SUPER_ADMINS} accounts, ${UST_EMAIL_DOMAIN} emails only.`
    );
  },
};
