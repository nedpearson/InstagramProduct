import { prisma } from '@/lib/prisma';

export type Action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';
export type Resource = 'Workspace' | 'Billing' | 'InstagramAccount' | 'Campaign' | 'Agent' | 'Data';

export const ADMIN_ROLES = ['superadmin', 'admin'];

export class PermissionManager {
  /**
   * Checks if a user has sufficient global system role.
   */
  static isSystemAdmin(systemRole: string) {
    return ADMIN_ROLES.includes(systemRole);
  }

  /**
   * Validates workspace-level access and retrieves precise RBAC capabilities.
   */
  static async checkWorkspaceAccess(userId: string, workspaceId: string, requiredAction: Action, resource: Resource): Promise<boolean> {
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        }
      },
      include: {
        user: true,
      }
    });

    if (!member) return false;
    
    // System Admins inherently have bypass via backdoors, but usually we restrict them unless they are part of the workspace or using a global override.
    if (this.isSystemAdmin(member.user.systemRole)) return true;

    // Workspace Owners/Admins have all capabilities.
    if (member.role === 'admin' || member.role === 'owner') return true;

    // Viewers cannot execute anything except READ.
    if (member.role === 'viewer') {
      return requiredAction === 'READ';
    }

    // Typical member
    if (member.role === 'member') {
      if (resource === 'Billing' || resource === 'Workspace') return false; // restricted
      if (requiredAction === 'MANAGE') return false;
      return true;
    }

    return false;
  }
}
