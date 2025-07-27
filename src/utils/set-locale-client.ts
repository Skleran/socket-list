"use client";

export function setLocaleClient(locale: string) {
  // 1. Set cookie
  document.cookie = `NEXT_LOCALE=${locale}; path=/`;

  // 2. Set localStorage (optional)
  localStorage.setItem("locale", locale);

  // 3. Optionally reload the page to apply
  window.location.reload();
}
