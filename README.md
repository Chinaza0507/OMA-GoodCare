# ỌMA — Good Care

A hospital queue booking web app. Patients book a slot and follow their live place in the queue; staff manage the queue; admins manage departments and doctors.

## Status
Early development. Tech stack decided, scaffolding next.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL (hosted on Neon or Supabase) |
| Live updates | Socket.IO |
| Auth | JWT + bcrypt, role-based (patient / staff / admin) |
| Validation | Zod |
| Testing | Vitest (frontend), Jest + Supertest (backend) |
| Notifications | Email / SMS (later phase) |

## Roles and features

- **Patient:** register and log in, book a slot by department, see live queue position, cancel a booking.
- **Staff:** view today's queue, call the next patient, mark done or no-show.
- **Admin:** manage departments, doctors and opening hours.

## Planned structure

```
OMA-Goodcare/
├── client/     # React app
├── server/     # Express API
└── docs/       # Notes and decisions
```

## Roadmap

1. Project setup (client, server, database connection)
2. Database schema and authentication
3. Booking flow
4. Live queue (Socket.IO)
5. Staff dashboard
6. Admin tools
7. Notifications, testing and deployment

## Security and privacy

This handles patient data, so:
- Never commit secrets. Copy `.env.example` to `.env` and fill it in locally.
- Hash all passwords, validate all input, and enforce roles on the server.
- Collect only the patient data the queue needs.

## Getting started

Setup steps will be added once the scaffolding is in place.
