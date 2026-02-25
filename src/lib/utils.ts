export function formatCurrency(amount: number, currency: string = "INR"): string { return new Intl.NumberFormat("en-IN", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount) }
export function formatDate(date: string | Date): string { return new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) }
export function formatDateTime(date: string | Date): string { return new Date(date).toLocaleString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) }
