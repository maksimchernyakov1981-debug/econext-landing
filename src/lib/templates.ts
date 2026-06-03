export type TemplateContext = {
  partner_name?: string;
  store_name?: string;
  address?: string;
  landmark?: string;
  today_schedule?: string;
  work_status?: string;
  next_open_time?: string;
  close_time?: string;
};

export function replaceTemplateVars(
  text: string | null | undefined,
  ctx: TemplateContext
): string {
  if (!text) return "";
  let out = text;
  const map: Record<string, string | undefined> = {
    partner_name: ctx.partner_name,
    store_name: ctx.store_name,
    address: ctx.address,
    landmark: ctx.landmark,
    today_schedule: ctx.today_schedule,
    work_status: ctx.work_status,
    next_open_time: ctx.next_open_time,
    close_time: ctx.close_time,
  };
  for (const [key, val] of Object.entries(map)) {
    out = out.replaceAll(`[${key}]`, val ?? "");
  }
  return out;
}
