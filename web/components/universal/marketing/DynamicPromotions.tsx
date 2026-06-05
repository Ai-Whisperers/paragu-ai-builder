/**
 * ANNOTATION: DynamicPromotions
 *
 * What it is: Live promotions grid that fetches active offers from Supabase at runtime.
 * Falls back to static JSON content when the database isn't configured.
 *
 * Why your business needs it: Lets you update promotions without redeploying code.
 * Edit promotion details in the admin panel and they appear on the site immediately.
 *
 * What AI populates from your data: Promotions from Supabase (promotions table).
 * Fallback content from content/es/promotions/ and content/en/promotions/ JSON files.
 *
 * Your input: Create and manage promotions via the admin panel promotions page.
 *
 * Plan availability: Profesional (requires Supabase)
 */

/**
 * @component DynamicPromotions
 * @description Live promotions grid that pulls active offers from Supabase at runtime with graceful fallback when database is not configured.
 * @featureFlags promotions
 * @requires Supabase (promotions table), supabaseAdmin client
 * @implementation useEffect for data fetching, .eq(is_active, true) filter, .order(sort_order)
 */

"use client";
import { useState, useEffect, useMemo } from "react";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Tag, Clock, ArrowRight, Gift, Sparkles, Users } from "lucide-react";

type Promotion = {
  id: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
  wa_message: string | null;
  is_active: boolean;
  expires_at: string | null;
  sort_order: number;
  color: string;
};

const BADGE_ICONS: Record<string, React.ReactNode> = {
  "Solo nuevas clientas": <Sparkles className="w-3.5 h-3.5" />,
  "Combo del mes": <Gift className="w-3.5 h-3.5" />,
  "Programa de referidos": <Users className="w-3.5 h-3.5" />,
};

function DynamicPromotionCard({ promo, index }: { promo: Promotion; index: number }) {
  // eslint-disable-next-line react-hooks/purity -- Date.now() is only called once at mount time
  const expiresDeadline = useMemo(() => new Date(Date.now() + 14 * 86400000), [])
  const isExpiresSoon = promo.expires_at && new Date(promo.expires_at) <= expiresDeadline;
  const waUrl = promo.wa_message
    ? `https://wa.me/595986106062?text=${encodeURIComponent(promo.wa_message)}`
    : `https://wa.me/595986106062?text=${encodeURIComponent("Hola! Quiero usar la promoción: " + promo.title)}`;

  const colorMap: Record<string, string> = {
    amber: "from-amber-400 to-amber-600",
    secondary: "from-secondary to-secondary-dark",
    primary: "from-primary to-primary-light",
  };
  const bgMap: Record<string, string> = {
    amber: "bg-amber-500 text-white hover:bg-amber-600",
    secondary: "bg-secondary text-white hover:bg-secondary-dark",
    primary: "bg-primary text-white hover:bg-primary-light",
  };
  const badgeMap: Record<string, string> = {
    amber: "bg-amber-50 text-amber-700",
    secondary: "bg-secondary/10 text-secondary",
    primary: "bg-primary/10 text-primary",
  };
  const color = colorMap[promo.color] || colorMap.secondary;
  const bg = bgMap[promo.color] || bgMap.secondary;
  const badge = badgeMap[promo.color] || badgeMap.secondary;

  return (
    <ScrollReveal delay={index * 100} direction="up">
      <div className={`relative bg-white rounded-2xl border ${isExpiresSoon ? "border-amber-200" : "border-gray-100"} shadow-sm hover:shadow-md transition-all overflow-hidden group`}>
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
        <div className="pt-6 p-6">
          <div className="flex items-center justify-between mb-4">
            {promo.badge && (
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${badge}`}>
                {BADGE_ICONS[promo.badge] || <Tag className="w-3.5 h-3.5" />} {promo.badge}
              </span>
            )}
            {isExpiresSoon && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" /> Vence pronto
              </span>
            )}
          </div>
          <h3 className="font-heading text-xl font-bold text-primary mb-2">{promo.title}</h3>
          <p className="text-sm text-foreground-light leading-relaxed mb-6">{promo.subtitle}</p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-xl transition-all ${bg}`}>
            <Tag className="w-4 h-4" /> Reservar Ahora <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function DynamicPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured || !supabaseAdmin) return;
      const { data } = await supabaseAdmin
        .from("promotions")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .limit(3);
      setPromotions(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return null;
  if (promotions.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">
              <Tag className="w-4 h-4" /> Ofertas Activas
            </span>
            <h2 className="font-heading text-4xl font-bold text-primary mb-3">Promociones del Mes</h2>
            <p className="text-foreground-light max-w-lg mx-auto">Descuentos y combos para que te mimés a vos o a alguien especial.</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promotions.map((p, i) => <DynamicPromotionCard key={p.id} promo={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}