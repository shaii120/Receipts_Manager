import { apiFetch } from './api';

import type { UserPublic } from '@receipts/shared-schemas/auth';

export function searchUsers(email: string): Promise<UserPublic[]> {
    return apiFetch<UserPublic[]>(`/api/users/search?email=${encodeURIComponent(email)}`);
}