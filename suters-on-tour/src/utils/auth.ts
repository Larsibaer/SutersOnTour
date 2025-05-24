export function getUserRole(): "mnms" | "friend" | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("role") as "mnms" | "friend" | null
}

export function isDoorOpen(week: number): boolean {
  if (typeof window === "undefined") return false
  const opened = JSON.parse(localStorage.getItem("openedDoors") || "[]")
  return opened.includes(week)
}

export function openDoor(week: number) {
  if (typeof window === "undefined") return
  const opened = JSON.parse(localStorage.getItem("openedDoors") || "[]")
  if (!opened.includes(week)) {
    localStorage.setItem("openedDoors", JSON.stringify([...opened, week]))
  }
}
