# BNB Catalog Admin Setup

## Admin URLs

- Login: `https://bnb-catalog.vercel.app/admin/login`
- Dashboard: `https://bnb-catalog.vercel.app/admin/dashboard`
- Add product lot: `https://bnb-catalog.vercel.app/admin/products/new`
- Edit product lot: `https://bnb-catalog.vercel.app/admin/products/<product-id>`
- Settings and password change: `https://bnb-catalog.vercel.app/admin/settings`
- Password reset callback: `https://bnb-catalog.vercel.app/admin/update-password`

## How Admin Authentication Works

The admin panel uses Supabase Auth email/password users. The application does not store or ship hardcoded admin credentials.

Protected routes under `/admin/*` are checked by `middleware.ts`. Public admin auth routes are limited to:

- `/admin/login`
- `/admin/update-password`

All other admin pages require a valid Supabase session.

## Create The First Admin

1. Open your Supabase project dashboard.
2. Go to **Authentication**.
3. Open **Users**.
4. Click **Add user**.
5. Enter the admin email address.
6. Set a strong temporary password.
7. Confirm the user.
8. Share the login URL with the admin: `https://bnb-catalog.vercel.app/admin/login`.

## Add More Admins

Repeat the same Supabase Authentication user creation steps for each admin. Anyone with a valid Supabase Auth account can access the protected admin dashboard.

## Reset An Admin Password

1. Go to `https://bnb-catalog.vercel.app/admin/login`.
2. Tap **Forgot Password?**.
3. Enter the admin email address.
4. Open the Supabase reset email.
5. The reset link opens `/admin/update-password`.
6. Enter and confirm the new password.
7. After success, sign in again from `/admin/login`.

## Change Password While Signed In

1. Sign in to the admin dashboard.
2. Open `https://bnb-catalog.vercel.app/admin/settings`.
3. Use the **Change Password** section.
4. Enter the current password, new password, and confirmation.
5. Save the new password.

## Manage Admin Access

Use Supabase Authentication as the source of truth:

- Add admins in **Authentication > Users**.
- Remove access by deleting the user.
- Temporarily block access by banning or disabling the user in Supabase.
- Reset passwords from Supabase or through the app's forgot-password flow.

Do not create default public credentials in code. That would make the live admin panel unsafe.
