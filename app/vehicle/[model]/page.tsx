"use client";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import * as vehiclesData from "../../../data/vehicles";
import { PremiumMediaShowcase } from "../../../components/hero/PremiumMediaShowcase";
import { MobileStickyNav } from "../../../components/nav/MobileStickyNav";
import { DesktopActionPanel } from "../../../components/nav/DesktopActionPanel";
import { FeatureCard } from "../../../components/cards/FeatureCard";
import { ThreeDCardCarousel } from "../../../components/carousel/ThreeDCardCarousel";
import { CarBuilder } from "../../../components/builder/CarBuilder";
import { GradeCompare } from "../../../components/compare/GradeCompare";
import { RefinedTechExperience } from "../../../components/tech/RefinedTechExperience";
import { PrimaryCTAs } from "../../../components/cta/PrimaryCTAs";
import {
  FeatureModal1,
  FeatureModal2,
  FeatureModal3,
  FeatureModal4,
  FeatureModal5,
  FeatureModal6,
} from "../../../components/modals";
import { SAMPLE_GRADES } from "../../../data/grades";
import { SAMPLE_SPECS } from "../../../data/specs";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function findVehicle(model: string | undefined) {
  if (!model) return null;
  const candidates: any[] = [];

  for (const v of Object.values(vehiclesData)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      candidates.push(...v);
    } else if (typeof v === "object") {
      const hasSlug = "slug" in v || "id" in v || "name" in v;
      if (hasSlug) {
        candidates.push(v);
      } else {
        candidates.push(...Object.values(v));
      }
    }
  }

  const uniq = Array.from(new Set(candidates));

  return (
    uniq.find((x: any) => (x.slug && x.slug === model) || (x.id && String(x.id) === model) || (x.name && slugify(String(x.name)) === model)) ||
    null
  );
}

export default function VehicleModelPage() {
  const params = useParams();
  const model = params?.model as string | undefined;
  const [openModal, setOpenModal] = useState<string | null>(null);

  const vehicle = useMemo(() => findVehicle(model), [model]);

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-carbon-matte text-white p-8">
        <h1 className="text-2xl font-semibold">Vehicle not found</h1>
        <p className="mt-2">No vehicle matched “{model}”. Check your data/vehicles exports or the slug.</p>
      </main>
    );
  }

  const hero = vehicle.hero ?? {};
  const highlights = vehicle.highlights ?? [];
  const carousel = vehicle.carousel ?? [];

  return (
    <main className="min-h-screen bg-carbon-matte text-white">
      <PremiumMediaShowcase media={hero} />
      <MobileStickyNav />
      <DesktopActionPanel
        onReserve={() => alert("Reserve stub")}
        onBuild={() => alert("Open builder stub")}
        onCompare={() => alert("Open compare stub")}
        onTestDrive={() => alert("Test drive stub")}
        onShare={() => alert("Share stub")}
      />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold">Highlights</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h: any) => (
              <FeatureCard key={h.id ?? h.title} id={h.id} title={h.title} description={h.description} media={h.media} onLearnMore={() => setOpenModal("spec")} />
            ))}
          </div>
        </div>
      </section>

      <ThreeDCardCarousel slides={carousel} />

      <CarBuilder grades={SAMPLE_GRADES} />

      <GradeCompare grades={SAMPLE_GRADES} specs={SAMPLE_SPECS} />

      <RefinedTechExperience />

      <PrimaryCTAs />

      <FeatureModal1 open={openModal === "image"} onClose={() => setOpenModal(null)} image={hero.imageUrl} />
      <FeatureModal2 open={openModal === "spec"} onClose={() => setOpenModal(null)} specs={{ "Powertrain": "V6 Hybrid", "Drive": "4WD" }} />
      <FeatureModal3 open={openModal === "video"} onClose={() => setOpenModal(null)} videoUrl={undefined} poster={hero.poster} />
      <FeatureModal4 open={openModal === "hotspots"} onClose={() => setOpenModal(null)} hotspots={[{ x: 20, y: 30, label: "A" }, { x: 70, y: 50, label: "B" }]} />
      <FeatureModal5 open={openModal === "qa"} onClose={() => setOpenModal(null)} qas={[{ q: "What is warranty?", a: "Standard warranty." }]} />
      <FeatureModal6 open={openModal === "spin"} onClose={() => setOpenModal(null)} image={hero.imageUrl} />
    </main>
  );
}