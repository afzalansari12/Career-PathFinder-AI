// frontend/src/lib/authTracking.ts

export function markUserSignedUp() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("pathfinder_has_signed_up", "true");
      document.cookie = "has_signed_up=true; path=/; max-age=31536000; SameSite=Lax";
    } catch (e) {
      console.warn("Failed to set signup tracking:", e);
    }
  }
}

export function isUserSignedUp(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const hasLocal = localStorage.getItem("pathfinder_has_signed_up") === "true";
    const hasCookie = document.cookie.includes("has_signed_up=true");
    return hasLocal || hasCookie;
  } catch (e) {
    return false;
  }
}
