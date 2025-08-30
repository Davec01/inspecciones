export function getTelegramIdFallback(): string | null {
    const tg = (globalThis as any)?.Telegram?.WebApp;
    const idFromWebApp = tg?.initDataUnsafe?.user?.id
      ? String(tg.initDataUnsafe.user.id)
      : null;
    if (idFromWebApp) return idFromWebApp;
  
    if (typeof window !== "undefined") {
      const u = new URL(window.location.href);
      // aceptamos ?tg=... o ?telegram_id=...
      return u.searchParams.get("tg") ?? u.searchParams.get("telegram_id");
    }
    return null;
  }
  