/**
 * Local store - Mock data persistent (localStorage)
 * Khi có API: thay bằng gọi API, cấu trúc dữ liệu giữ nguyên để dễ connect
 */

const KEY_PROFILES = 'bikeExchange_profiles'
const KEY_INSPECTIONS = 'bikeExchange_inspections'

/** Cấu trúc profile - trùng với API /users/me */
export function getProfiles() {
  try {
    return JSON.parse(localStorage.getItem(KEY_PROFILES) || '{}')
  } catch {
    return {}
  }
}

export function getProfile(userId) {
  const profiles = getProfiles()
  return profiles[String(userId)] || null
}

export function setProfile(userId, data) {
  const profiles = getProfiles()
  profiles[String(userId)] = { ...profiles[String(userId)], ...data }
  localStorage.setItem(KEY_PROFILES, JSON.stringify(profiles))
}

/** Cấu trúc inspection - trùng với API /inspections */
export function getInspections() {
  try {
    return JSON.parse(localStorage.getItem(KEY_INSPECTIONS) || '{}')
  } catch {
    return {}
  }
}

export function getInspection(listingId) {
  const inspections = getInspections()
  return inspections[String(listingId)] || null
}

export function setInspection(listingId, data) {
  const inspections = getInspections()
  inspections[String(listingId)] = {
    ...inspections[String(listingId)],
    ...data,
    inspectedAt: new Date().toISOString(),
  }
  localStorage.setItem(KEY_INSPECTIONS, JSON.stringify(inspections))
}
