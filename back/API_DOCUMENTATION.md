# Gacha Sim Backend API Documentation

This document provides an overview of the backend API endpoints that have been implemented to replace the functionality in the original `StorageService.ts` file.

## Authentication

All endpoints (except for user registration and login) require JWT authentication. Include the JWT token in the Authorization header as a Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

- `POST /auth/login` - Login with username and password
  - Request body: `{ "username": "string", "password": "string" }`
  - Response: `{ "access_token": "string", "user": { "id": "string", "username": "string", "email": "string" } }`

- `POST /users` - Register a new user
  - Request body: `{ "username": "string", "email": "string", "password": "string" }`
  - Response: User object

## Pity Management

The following endpoints replace the pity management functions in StorageService.ts:

| Original Function | Endpoint | Method | Description |
|-------------------|----------|--------|-------------|
| `getPity` | `/pity/:banner` | GET | Get pity count for a specific banner |
| `incrementPity` | `/pity/:banner/increment` | POST | Increment pity count for a banner |
| `resetPity` | `/pity/:banner/reset` | POST | Reset pity count for a banner |
| `savePity` | `/pity/history` | POST | Save pity history |
| `getPityHistory` | `/pity/history` | GET | Get pity history |
| `clearAllPities` | `/pity/clear` | DELETE | Clear all pity counters |

## Summons Management

The following endpoints replace the summons management functions in StorageService.ts:

| Original Function | Endpoint | Method | Description |
|-------------------|----------|--------|-------------|
| `loadAllSummons`, `getSummons` | `/summons` | GET | Get all summons |
| `saveSummon` | `/summons` | POST | Save a new summon |
| `clearSummons` | `/summons` | DELETE | Clear all summons |
| `getSummonCount` | `/summons/count` | GET | Get summon count |
| `setSummonCount` | `/summons/count` | PUT | Set summon count |
| `incrementSummonCount` | `/summons/count/increment` | POST | Increment summon count |
| `resetSummonCount` | `/summons/count/reset` | POST | Reset summon count |
| `getSSRStats` | `/summons/stats/ssr` | GET | Get SSR statistics |

## Teams Management

The following endpoints replace the teams management functions in StorageService.ts:

| Original Function | Endpoint | Method | Description |
|-------------------|----------|--------|-------------|
| `getTeamsFromCookies` | `/teams/data/all` | GET | Get all team data |
| `saveTeamsToCookies` | `/teams/data/all` | PUT | Save team data |

Additionally, the following endpoints provide more granular control over teams:

- `POST /teams` - Create a new team
- `GET /teams` - Get all teams
- `GET /teams/:id` - Get a specific team
- `PUT /teams/:id` - Update a team
- `DELETE /teams/:id` - Delete a team

## Data Models

### Pity
```typescript
{
  id: string;
  banner: string;
  count: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### PityHistory
```typescript
{
  id: string;
  banner: string;
  pulls: number;
  date: Date;
  userId: string;
  createdAt: Date;
}
```

### Summon
```typescript
{
  id: string;
  banner: string;
  pityType: 'soft pity' | 'hard pity' | 'no pity';
  pityCount: number;
  timestamp: Date;
  characterFilename: string;
  characterTitle: string;
  characterFolder: 'ml' | 'ssr' | 'sr' | 'r';
  userId: string;
  createdAt: Date;
}
```

### Team
```typescript
{
  id: string;
  name: string;
  characters: Array<TeamCharacter>;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### TeamData
```typescript
{
  id: string;
  data: Record<string, Array<TeamCharacter>>;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Migration Notes

1. All data is now stored in a PostgreSQL database instead of cookies or localStorage.
2. All endpoints require authentication, ensuring data is user-specific.
3. The backend provides more structured and type-safe data handling.
4. Error handling is improved with proper HTTP status codes and error messages.
