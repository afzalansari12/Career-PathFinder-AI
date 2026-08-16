// frontend/src/lib/proStatus.ts

export function getProStatus(userId?: string | null): boolean {
  if (typeof window === "undefined") return false;

  // Check user-specific key first
  if (userId) {
    const userVal = localStorage.getItem(`is_pro_user_${userId}`);
    if (userVal !== null) return userVal === "true";
  }

  // Check global demo key
  const globalVal = localStorage.getItem("is_pro_user");
  if (globalVal !== null) return globalVal === "true";

  // Default to Free (false) so upgrade banners and limits are active for testing
  return false;
}

export function setProStatus(userId: string | null | undefined, status: boolean): void {
  if (typeof window === "undefined") return;
  const statusStr = status ? "true" : "false";

  if (userId) {
    localStorage.setItem(`is_pro_user_${userId}`, statusStr);
  }
  localStorage.setItem("is_pro_user", statusStr);

  window.dispatchEvent(new Event("pro_status_updated"));
}
