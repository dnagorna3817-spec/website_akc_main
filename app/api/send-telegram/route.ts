import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 4096;
const TELEGRAM_TIMEOUT_MS = 10000;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ ok: false, message: "Очікується JSON." }, { status: 415 });
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ ok: false, message: "Недозволене джерело запиту." }, { status: 403 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json({ ok: false, message: "Надсилання заявок тимчасово недоступне." }, { status: 503 });
  }

  let data: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, message: "Завеликий запит." }, { status: 413 });
    }
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid JSON");
    data = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Некоректні дані заявки." }, { status: 400 });
  }

  // Honeypot for basic automated submissions; it is not displayed to real visitors.
  if (clean(data.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const phone = clean(data.phone, 24);
  const eventTitle = clean(data.eventTitle, 180);
  const isLead = data.requestType === "lead";
  const phoneDigits = phone.replace(/\D/g, "");

  if (!name || !email || !phone || !eventTitle || data.consent !== true) {
    return NextResponse.json({ ok: false, message: "Заповніть обов'язкові поля та підтвердьте згоду." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "Введіть коректний email." }, { status: 400 });
  }
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    return NextResponse.json({ ok: false, message: "Введіть коректний номер телефону." }, { status: 400 });
  }

  const text = [
    isLead ? "🔔 Нове звернення — сайт АКЦ" : "🔔 Нова заявка на захід — сайт АКЦ",
    "",
    `${isLead ? "Джерело звернення" : "Захід"}: ${eventTitle}`,
    `Ім'я та прізвище: ${name}`,
    `Телефон: ${phone}`,
    `Email: ${email}`,
    "Згода на обробку персональних даних: Так",
    isLead ? "Джерело: сайт АКЦ / Форма зворотного зв’язку" : "Джерело: сайт АКЦ / План заходів",
    `Час: ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`,
  ].join("\n");

  try {
    const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      cache: "no-store",
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
    });
    if (!telegram.ok) {
      return NextResponse.json({ ok: false, message: "Не вдалося надіслати заявку. Спробуйте ще раз." }, { status: 502 });
    }
    const result: unknown = await telegram.json();
    if (!result || typeof result !== "object" || !("ok" in result) || (result as { ok?: unknown }).ok !== true) {
      return NextResponse.json({ ok: false, message: "Telegram не підтвердив надсилання." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Не вдалося надіслати заявку. Спробуйте ще раз." }, { status: 502 });
  }
}
