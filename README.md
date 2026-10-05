# FreshFold

Laundry marketplace MVP with customer orders, direct bank transfers, admin payment verification, and vendor wallets.

## Backend Setup

From `Backend/`, install packages with `npm install` and create `.env` using `.env-example` as a reference. Set `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PAYMENT_BANK_NAME`, `PAYMENT_ACCOUNT_NAME`, `PAYMENT_ACCOUNT_NUMBER`, `PLATFORM_FEE_PERCENT`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. The seed email is `carochristopher2004@gmail.com`; choose a strong password and keep it only in `Backend/.env`. Run `npm run create-admin` once to create or update the account, then `npm run dev` to start the API. The password is hashed before it is saved in MongoDB. Payment verification uses conditional, retryable state changes, and each wallet adjustment is atomic and idempotent, so standalone MongoDB works without multi-document transactions.

The API listens on `PORT` (default `5000`) and exposes `/api/health`. All application endpoints use the `/api` prefix. Customers transfer directly to the configured FreshFold bank account and include the generated payment reference as the transfer narration. An admin checks the bank alert and verifies the payment in the control room; only then is the order scheduled and the vendor's net earnings credited to their wallet. Vendor withdrawals reserve the requested amount and remain pending until an admin has made the bank transfer and marks the request paid. Marking a request failed refunds the reserved amount to the vendor wallet.

When a vendor marks an order ready for delivery, the customer receives an in-app notification and can choose a future delivery date and time from the order detail page. The vendor can mark the order delivered only after a time has been chosen.

Public registration is limited to customers and laundry vendors. Admin accounts are seeded from the backend `.env`; the admin signs in through the regular login page and is sent to the admin dashboard based on the account role.

Vendors save their per-cloth `washing`, `ironing`, and `dryCleaning` rates plus a flat `pickupDelivery` fee through `PATCH /api/vendor/pricing`. Customers can view vendors and their rates through `GET /api/vendor/directory`, then select one when creating an order. Each order snapshots its line items so later vendor price changes do not change an existing quote.

`PLATFORM_FEE_PERCENT` defaults to 10 and applies independently to the service subtotal: the customer pays the subtotal plus a 10% app fee, while the vendor's earnings are the subtotal less a separate 10% vendor fee. For a ₦5,000 subtotal, checkout is ₦5,500 and vendor earnings are ₦4,500. The minimum withdrawal is NGN 1,000.

## API Endpoints

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`
- `PATCH /api/orders/:id/delivery-schedule`
- `POST /api/payments/initialize`
- `GET /api/vendor/directory`, `GET /api/vendor/pricing`, `PATCH /api/vendor/pricing`
- `GET /api/vendor/orders/available`, `PATCH /api/vendor/orders/:id/receive`
- `GET /api/vendor/orders`, `PATCH /api/vendor/orders/:id/status`, `PATCH /api/vendor/bank-details`
- `GET /api/wallet`, `POST /api/wallet/withdraw`, `GET /api/wallet/withdrawals`
- `GET /api/admin/payments`, `POST /api/admin/payments/:id/verify`
- `GET /api/admin/withdrawals`, `PATCH /api/admin/withdrawals/:id`
