# 🎯 EventHub

A full-stack activity social platform where users can create, join, and manage events. Features real-time group chat, interactive maps, and fine-grained role-based access control.

🔗 **Live Demo**: https://events-activities.azurewebsites.net/

> **Test Account**
>
> `Test1@test.com` / `Test1@test.com`
>
> Or register a new account directly.

---

## Features

### Activity Management
- Browse all activities with pagination (6 per page)
- Filter by date (calendar picker), **All Activities**, **I'm Attending**, or **I'm Hosting**
- Create, edit, and delete activities
- Cancel and re-activate activities
- Host and non-host users see different UI controls on the same activity

### Real-Time Comments (SignalR)
- Live comment feed on each activity detail page
- Comments pushed instantly to all users viewing the same activity via SignalR Groups
- Comments displayed in reverse chronological order
- Any authenticated user can comment

### Interactive Map (Leaflet)
- Location autocomplete powered by LocationIQ API (up to 5,000 requests/day free tier)
- Latitude and longitude stored on the backend at creation time
- Show/Hide map toggle on activity detail page using react-leaflet

### User Profiles
- View your own profile: About, Activities (Future / Past / Hosting), and Statistics tabs
- Statistics tab shows total activities, hosting count, attending count, completed events, and a breakdown chart
- View other users' profiles (read-only, no Statistics tab)
- Edit profile: display name, bio, and avatar upload (Cloudinary)
- **Save button is disabled until the form detects an actual change**, preventing unnecessary API calls

### Authentication & Authorization
- JWT authentication with ASP.NET Identity
- Token expiry: 2 hours by default, 7 days with Remember Me
- Zustand persist stores login state in localStorage — survives page refresh
- Route guard (`RequireAuth`) blocks unauthenticated access to all feature pages
- Role-based UI: host controls, edit/delete buttons, and profile editing only visible to authorized users

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React | UI framework |
| Zustand + persist | Global auth state, persisted to localStorage |
| TanStack Query | Server state caching and data fetching |
| React Router | Client-side routing with route guards |
| MUI | Component library |
| SignalR JS Client | Real-time WebSocket connection |
| react-leaflet | Interactive maps |
| LocationIQ API | Address autocomplete |

### Backend
| Technology | Purpose |
|---|---|
| ASP.NET Core | REST API |
| ASP.NET Identity | User management and authentication |
| Entity Framework Core | ORM and database migrations |
| AutoMapper | DTO ↔ Entity mapping |
| JWT | Stateless authentication |
| SignalR | Real-time WebSocket hub |
| Cloudinary | Avatar image upload and storage |

### Infrastructure
| Technology | Purpose |
|---|---|
| Azure SQL Server | Production database |
| Azure App Service | Hosting (frontend served as static files via wwwroot) |
| GitHub Actions | CI/CD — auto-deploy on push to `main` |

---

## Architecture

### Backend Structure

```
Presentation Layer
│
├── Controllers
│   ├── BaseApiController.cs
│   ├── AuthController.cs
│   ├── ActivitiesController.cs
│   ├── CommentsController.cs
│   └── ProfilesController.cs
│
├── SignalR
│   └── CommentHub.cs
│
Application / Core Layer
│
├── core
│   ├── AppDbContext          → AppDbContext & database setup
│   ├── AutomapperConfig      → Object mapping profiles
│   ├── Dtos                  → Request / Response models
│   ├── Entities              → Domain models
│   └── Services
│         ├── CloudinaryService.cs
│         └── JwtTokenCreator.cs
│
Infrastructure Layer
│
├── Migrations                → EF Core schema history
├── Properties
├── wwwroot                   → Built frontend (React)
```

### Frontend Structure

| Layer | Responsibility |
|---|---|
| API layer (`http.js`) | Send requests, throw errors on failure |
| Hook layer (TanStack Query / custom hooks) | Call API, manage cache, invalidate on mutation |
| Component layer | Handle user interactions, display UI feedback |

### Authentication Flow

```
Login → JWT returned from API
      → stored in Zustand (localStorage via persist middleware)
      → decoded user info (id, displayName, imageUrl) also stored in Zustand

Page refresh → Zustand rehydrates from localStorage automatically

Logout → clear Zustand state → clear localStorage
```

---

## Design Decisions

### Create and Edit share the same component

`CreatePage.jsx` handles both creation (`/create-activity`) and editing (`/edit/:id`) by checking whether an `id` param exists. In edit mode, data is read from TanStack Query cache — no extra API call needed since the user just came from the detail page where the data was already fetched.

When navigating from an edit page back to Create Activity via the navbar, a `useEffect` monitors `isEditMode` and resets the form, avoiding stale data carrying over between routes.

### Save button disabled until form changes

On the Edit Profile page, the initial form values are stored as a snapshot on load. The Save button is only enabled when the current form state differs from the snapshot. This avoids sending a PUT request when nothing has actually changed.

### Pagination handled on the backend

Pagination and filtering (date, hosting, attending) are applied via LINQ before the database query executes, using `Skip` / `Take`. Only the requested page is fetched — not all records.

### SignalR Groups for scoped broadcasting

Each activity has its own SignalR group keyed by `activityId`. When a comment is posted, it is broadcast only to users currently viewing that activity's detail page, not to all connected clients.

---

## Database Design

### Entity Relationships

```
User            1──N  Activity        (via ActivityAttendee, IsHost flag)
User            1──N  Comment
Activity        1──N  Comment
ActivityAttendee → join table (UserId, ActivityId, IsHost)
User            1──01 Photo
```

### Key Design Decisions

**ActivityAttendee stores IsHost flag**
Rather than a separate Host field on Activity, host status is tracked via the `IsHost` boolean on the attendee record. This allows the same join table to represent both the host and all attendees, and makes filtering straightforward.

**JWT config in appsettings, not hardcoded**
JWT key, issuer, audience, and expiry settings are all read from `appsettings.json`. This follows the Open/Closed principle — deployment configuration can change without modifying controller or service code.

---

## Deployment

Deployed on **Azure App Service**. The React frontend is built into `backend/API/wwwroot` via `npm run build`, then packaged together with the .NET backend using `dotnet publish`. CI/CD is configured with **GitHub Actions** — every push to `main` triggers a build and deploy.

---

## Running Locally

1. Clone the repository
2. Copy `appsettings.sample.json` → `appsettings.json` and fill in your connection string, JWT secret, and Cloudinary credentials
3. Run database migrations: `dotnet ef database update`
4. Start the backend: `dotnet run`
5. Install frontend dependencies: `npm install`
6. Start the frontend: `npm run dev`
7. API docs available at: `http://localhost:5000/swagger`

---

## Future Improvements

- **httpOnly Cookie for JWT** — currently the token is stored in localStorage via Zustand, which is accessible to JavaScript; moving to a server-set httpOnly Cookie would prevent XSS token theft
- **Refresh token** — current JWT has a fixed expiry with no renewal mechanism; implementing refresh token rotation would improve session management
- **Delete comment scoped broadcast** — currently delete events are broadcast to `Clients.All`; should be scoped to the activity's SignalR group like comment creation
- **Optimistic updates** — join/leave activity could update the UI immediately before the server confirms, improving perceived performance
- **Image upload for activities** — currently activities use a category-based default image; allowing hosts to upload a custom image would improve personalization