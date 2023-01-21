/**
 * @param {Game} entityId
 * @returns {Promise<Game[]>}
 */
export async function createEntity(entityName, entityId) {
  const response = await fetch(`/api/${entityName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entityId),
  });

  return response.json();
}

/**
 * @returns {Promise<Game[]>}
 */
export async function fetchEntities(entityName, query = {}) {
  const params = new URLSearchParams(query);
  const response = await fetch(`/api/${entityName}?${params.toString()}`, { method: "GET" });
  return response.json();
}

/**
 * @param {number} entityId
 * @returns {Promise<Game>}
 */
export async function fetchEntity(entityName, entityId) {
  const response = await fetch(`/api/${entityName}/${entityId}`);
  return response.json();
}

/**
 * @param {number} entityId
 */
export function destroyEntity(entityName, entityId) {
  return fetch(`/api/${entityName}/${entityId}`, { method: "DELETE" });
}
