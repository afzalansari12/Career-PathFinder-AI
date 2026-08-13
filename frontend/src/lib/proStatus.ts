// frontend/src/lib/proStatus.ts

export function getProStatus(userId?: string | null): boolean {
  if (typeof window === "undefined") return false;
  if (!userId) {
    // Check if demo parameter is present in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "true") return true;
    return false;
  }
  return localStorage.getItem(`is_pro_user_${userId}`) === "true";
}

export function setProStatus(userId: string | null | undefined, status: boolean): void {
  if (typeof window === "undefined" || !userId) return;
  localStorage.setItem(`is_pro_user_${userId}`, status ? "true" : "false");
  window.dispatchEvent(new Event("pro_status_updated"));
}
