import { cookies } from 'next/headers';

export type SessionUser = {
  userId: string;
  name: string;
  email: string;
  companySlug: string;
  companyName: string;
  role: 'owner' | 'member';
};

const USER_COOKIE = 'uc_user';
const EMAIL_COOKIE = 'uc_email';
const NAME_COOKIE = 'uc_name';
const COMPANY_SLUG_COOKIE = 'uc_company_slug';
const COMPANY_NAME_COOKIE = 'uc_company_name';
const ROLE_COOKIE = 'uc_role';

export function getSessionUser(): SessionUser | null {
  const cookieStore = cookies();
  const userId = cookieStore.get(USER_COOKIE)?.value;
  const email = cookieStore.get(EMAIL_COOKIE)?.value;
  const name = cookieStore.get(NAME_COOKIE)?.value;
  const companySlug = cookieStore.get(COMPANY_SLUG_COOKIE)?.value;
  const companyName = cookieStore.get(COMPANY_NAME_COOKIE)?.value;
  const role = cookieStore.get(ROLE_COOKIE)?.value as SessionUser['role'] | undefined;

  if (!userId || !email || !name || !companySlug || !companyName) {
    return null;
  }

  return {
    userId,
    email,
    name,
    companySlug,
    companyName,
    role: role === 'member' ? 'member' : 'owner',
  };
}

export function hasSessionCookie(): boolean {
  return cookies().has(USER_COOKIE);
}

export function getAuthCookieNames() {
  return {
    userId: USER_COOKIE,
    email: EMAIL_COOKIE,
    name: NAME_COOKIE,
    companySlug: COMPANY_SLUG_COOKIE,
    companyName: COMPANY_NAME_COOKIE,
    role: ROLE_COOKIE,
  } as const;
}
