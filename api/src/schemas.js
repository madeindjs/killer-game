/**
 * OpenAPI documentation schemas for the Killer Game API.
 *
 * These schemas are intentionally permissive. Fastify compiles response
 * schemas into serializers via fast-json-stringify, so any `format` or
 * `required` constraint that does not exactly match runtime data will throw
 * a 500 error. We keep the schemas for Swagger documentation only by using
 * loose types (`additionalProperties: true`, no `required`, no `format`).
 */

/** @typedef {import("fastify").FastifySchema} FastifySchema */

const exampleUuid = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
const exampleSmallUuid = "abc123";
const exampleDate = "2026-06-29T12:00:00.000Z";

const nullableString = { anyOf: [{ type: "string" }, { type: "null" }] };

/**
 * @param {string} name
 * @returns {object}
 */
function dataResponse(name) {
  return {
    type: "object",
    additionalProperties: true,
    properties: {
      data: { $ref: `${name}#` },
    },
  };
}

/**
 * @param {string} name
 * @returns {object}
 */
function listDataResponse(name) {
  return {
    type: "object",
    additionalProperties: true,
    properties: {
      data: {
        type: "array",
        items: { $ref: `${name}#` },
      },
    },
  };
}

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const GameRecord = {
  $id: "GameRecord",
  title: "GameRecord",
  type: "object",
  description: "Full game record returned to administrators. The private_token is sensitive.",
  additionalProperties: true,
  properties: {
    id: { type: "string", example: exampleUuid },
    name: { type: "string", example: "Birthday Killer Party" },
    slug: { type: "string", example: "birthday-killer-party" },
    private_token: { type: "string", example: exampleUuid },
    started_at: nullableString,
    finished_at: nullableString,
    organizer_email: nullableString,
    created_at: nullableString,
    updated_at: nullableString,
  },
  example: {
    id: exampleUuid,
    name: "Birthday Killer Party",
    slug: "birthday-killer-party",
    private_token: exampleUuid,
    started_at: exampleDate,
    finished_at: null,
    organizer_email: "organizer@example.com",
    created_at: exampleDate,
    updated_at: exampleDate,
  },
};

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const GameRecordSanitized = {
  $id: "GameRecordSanitized",
  title: "GameRecordSanitized",
  type: "object",
  description: "Public game record without the private token.",
  additionalProperties: true,
  properties: {
    id: { type: "string", example: exampleUuid },
    name: { type: "string", example: "Birthday Killer Party" },
    slug: { type: "string", example: "birthday-killer-party" },
    started_at: nullableString,
    finished_at: nullableString,
  },
  example: {
    id: exampleUuid,
    name: "Birthday Killer Party",
    slug: "birthday-killer-party",
    started_at: exampleDate,
    finished_at: null,
  },
};

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const PlayerRecord = {
  $id: "PlayerRecord",
  title: "PlayerRecord",
  type: "object",
  description: "Full player record returned to administrators or the player themself. Contains sensitive tokens.",
  additionalProperties: true,
  properties: {
    id: { type: "string", example: exampleSmallUuid },
    name: { type: "string", example: "John Doe" },
    private_token: { type: "string", example: exampleSmallUuid },
    game_id: { type: "string", example: exampleUuid },
    action: { type: "string", example: "Make them sing the national anthem" },
    order: { type: "integer", example: 0 },
    killed_at: nullableString,
    killed_by: nullableString,
    kill_token: { type: "integer", example: 42 },
    avatar: { anyOf: [{ type: "string" }, { type: "object" }, { type: "null" }], description: "Avatar config (JSON object or serialized JSON string) or null" },
    avatar_image: { anyOf: [{ type: "null" }, { type: "object" }, { type: "boolean" }], description: "Processed avatar Buffer, null, or a boolean flag in sanitized records" },
    created_at: nullableString,
    updated_at: nullableString,
  },
  example: {
    id: exampleSmallUuid,
    name: "John Doe",
    private_token: exampleSmallUuid,
    game_id: exampleUuid,
    action: "Make them sing the national anthem",
    order: 0,
    killed_at: null,
    killed_by: null,
    kill_token: 42,
    avatar: { sex: "man", faceColor: "#F9C9B6", hairStyle: "mohawk" },
    avatar_image: null,
    created_at: exampleDate,
    updated_at: exampleDate,
  },
};

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const PlayerRecordSanitized = {
  $id: "PlayerRecordSanitized",
  title: "PlayerRecordSanitized",
  type: "object",
  description: "Public player record with sensitive fields removed. avatar_image is a boolean flag.",
  additionalProperties: true,
  properties: {
    id: { type: "string", example: exampleSmallUuid },
    name: { type: "string", example: "John Doe" },
    game_id: { type: "string", example: exampleUuid },
    avatar: { anyOf: [{ type: "string" }, { type: "object" }, { type: "null" }], description: "Avatar config (JSON object or serialized JSON string) or null" },
    avatar_image: { type: "boolean", example: false },
  },
  example: {
    id: exampleSmallUuid,
    name: "John Doe",
    game_id: exampleUuid,
    avatar: { sex: "man", faceColor: "#F9C9B6", hairStyle: "mohawk" },
    avatar_image: false,
  },
};

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const PlayerStatus = {
  $id: "PlayerStatus",
  title: "PlayerStatus",
  type: "object",
  description: "Current target and list of players eliminated by the authenticated player.",
  additionalProperties: true,
  properties: {
    current: {
      type: "object",
      additionalProperties: true,
      properties: {
        player: { anyOf: [{ $ref: "PlayerRecordSanitized#" }, { type: "null" }] },
        action: nullableString,
      },
    },
    kills: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
        properties: {
          player: { $ref: "PlayerRecordSanitized#" },
          action: { type: "string", example: "Make them sing the national anthem" },
        },
      },
    },
  },
  example: {
    current: {
      player: {
        id: "def456",
        name: "Jane Doe",
        game_id: exampleUuid,
        avatar: null,
        avatar_image: false,
      },
      action: "Make them wink three times",
    },
    kills: [
      {
        player: {
          id: "ghi789",
          name: "Bob Smith",
          game_id: exampleUuid,
          avatar: null,
          avatar_image: false,
        },
        action: "Make them sing the national anthem",
      },
    ],
  },
};

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const GamePlayersTable = {
  $id: "GamePlayersTable",
  title: "GamePlayersTable",
  type: "object",
  description: "A single row mapping a player to their target and assigned action.",
  additionalProperties: true,
  properties: {
    player: { $ref: "PlayerRecord#" },
    target: { $ref: "PlayerRecord#" },
    action: { type: "string", example: "Make them sing the national anthem" },
  },
  example: {
    player: PlayerRecord.example,
    target: {
      ...PlayerRecord.example,
      id: "def456",
      name: "Jane Doe",
      order: 1,
    },
    action: "Make them sing the national anthem",
  },
};

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const GameDashboard = {
  $id: "GameDashboard",
  title: "GameDashboard",
  type: "object",
  description: "Podium of kills and timeline of elimination events.",
  additionalProperties: true,
  properties: {
    podium: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
        properties: {
          player: { $ref: "PlayerRecord#" },
          kills: { type: "array", items: { $ref: "PlayerRecord#" } },
        },
      },
    },
    events: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
        properties: {
          player: { $ref: "PlayerRecord#" },
          target: { $ref: "PlayerRecord#" },
          action: { type: "string", example: "Make them sing the national anthem" },
          at: nullableString,
        },
      },
    },
  },
  example: {
    podium: [
      {
        player: PlayerRecord.example,
        kills: [],
      },
    ],
    events: [
      {
        player: PlayerRecord.example,
        target: {
          ...PlayerRecord.example,
          id: "def456",
          name: "Jane Doe",
          killed_at: exampleDate,
          killed_by: exampleSmallUuid,
        },
        action: "Make them sing the national anthem",
        at: exampleDate,
      },
    ],
  },
};

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const ApplicationStats = {
  $id: "ApplicationStats",
  title: "ApplicationStats",
  type: "object",
  description: "Application-wide statistics and backend version.",
  additionalProperties: true,
  properties: {
    counts: {
      type: "object",
      additionalProperties: true,
      properties: {
        games_created: { type: "integer", example: 128 },
        games_started: { type: "integer", example: 96 },
        games_finished: { type: "integer", example: 84 },
        players_eliminated: { type: "integer", example: 512 },
        players_eliminated_last_6_months: { type: "integer", example: 64 },
      },
    },
    version: { type: "string", example: "4.5.4" },
  },
  example: {
    counts: {
      games_created: 128,
      games_started: 96,
      games_finished: 84,
      players_eliminated: 512,
      players_eliminated_last_6_months: 64,
    },
    version: "4.5.4",
  },
};

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const ErrorResponse = {
  $id: "ErrorResponse",
  title: "ErrorResponse",
  type: "object",
  description: "Generic error response. The error field may be a string or a keyed object.",
  additionalProperties: true,
  properties: {
    error: {
      anyOf: [
        { type: "string", example: "game not found" },
        { type: "object", additionalProperties: true },
      ],
    },
  },
  example: { error: "game not found" },
};

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const SuccessResponse = {
  $id: "SuccessResponse",
  title: "SuccessResponse",
  type: "object",
  additionalProperties: true,
  properties: {
    success: { type: "boolean", example: true },
  },
  example: { success: true },
};

/** @type {import('fastify').FastifySchema & {$id: string}} */
export const StatusSuccessResponse = {
  $id: "StatusSuccessResponse",
  title: "StatusSuccessResponse",
  type: "object",
  additionalProperties: true,
  properties: {
    status: { type: "string", example: "success" },
  },
  example: { status: "success" },
};

export const GameResponse = {
  200: { ...dataResponse("GameRecord"), description: "Game record (full for admins, sanitized for public users)" },
};

export const GamesCreateResponse = {
  200: { ...dataResponse("GameRecord"), description: "Created game record" },
};

export const GamesUpdateResponse = {
  200: { ...dataResponse("GameRecord"), description: "Updated game record" },
};

export const GamesRemoveResponse = {
  200: { ...StatusSuccessResponse, description: "Game deleted successfully" },
};

export const PlayersListResponse = {
  200: { ...listDataResponse("PlayerRecord"), description: "List of players (full for admins, sanitized for public users)" },
};

export const PlayerCreateResponse = {
  200: { ...dataResponse("PlayerRecord"), description: "Created player record" },
};

export const PlayerUpdateResponse = {
  200: { ...dataResponse("PlayerRecord"), description: "Updated player record" },
};

export const PlayerRemoveResponse = {
  202: { type: "null", description: "Player removed successfully" },
};

export const PlayerResponse = {
  200: { ...dataResponse("PlayerRecord"), description: "Player record (full for the player/admin, sanitized for others)" },
};

export const PlayerStatusResponse = {
  200: { ...dataResponse("PlayerStatus"), description: "Current target and kill history" },
};

export const PlayerKillResponse = {
  200: { ...SuccessResponse, description: "Target eliminated successfully" },
};

export const PlayersTableResponse = {
  200: { ...listDataResponse("GamePlayersTable"), description: "Assignment table of alive players" },
};

export const DashboardResponse = {
  200: { ...dataResponse("GameDashboard"), description: "Game dashboard with podium and events" },
};

export const StatsResponse = {
  200: { ...dataResponse("ApplicationStats"), description: "Application statistics" },
};

export const AvatarImageResponse = {
  200: { type: "string", format: "binary", description: "Avatar image as WebP" },
  404: { ...ErrorResponse, description: "Player or avatar image not found" },
};

export const AvatarUploadResponse = {
  200: { ...dataResponse("PlayerRecordSanitized"), description: "Updated player with avatar flag" },
  400: { ...ErrorResponse, description: "Missing or invalid image" },
  403: { ...ErrorResponse, description: "Invalid token" },
  404: { ...ErrorResponse, description: "Player or game not found" },
  500: { ...ErrorResponse, description: "Unexpected server error" },
};
