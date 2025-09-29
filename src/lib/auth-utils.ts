import { UserRole } from "@prisma/client"

export function isEmployeeOrAdmin(role: UserRole | undefined): boolean {
  return role === UserRole.EMPLOYEE || role === UserRole.ADMIN
}

export function isAdmin(role: UserRole | undefined): boolean {
  return role === UserRole.ADMIN
}
