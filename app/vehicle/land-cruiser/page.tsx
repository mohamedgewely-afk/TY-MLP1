"use client";
import React, { useState } from "react";
import { PremiumMediaShowcase } from '../../../components/hero/PremiumMediaShowcase';
import { MobileStickyNav } from '../../../components/nav/MobileStickyNav';
import { DesktopActionPanel } from '../../../components/nav/DesktopActionPanel';
import { FeatureCard } from '../../../components/cards/FeatureCard';
import { ThreeDCardCarousel } from '../../../components/carousel/ThreeDCardCarousel';
import { CarBuilder } from '../../../components/builder/CarBuilder';
import { GradeCompare } from '../../../components/compare/GradeCompare';
import { RefinedTechExperience } from '../../../components/tech/RefinedTechExperience';
import { PrimaryCTAs } from '../../../components/cta/PrimaryCTAs';
import {
  FeatureModal1,
  FeatureModal2,
  FeatureModal3,
  FeatureModal4,
  FeatureModal5,
  FeatureModal6,
} from '../../../components/modals';
import { SAMPLE_VEHICLE } from '../../../data/vehicles';
import { SAMPLE_GRADES } from '../../../data/grades';
import { SAMPLE_SPECS } from '../../../data/specs';

export default function LandCruiserAppPage() {
  const [openModal, setOpenModal] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-carbon-matte text-white">
      <PremiumMediaShowcase media={SAMPLE_VEHICLE.hero} />
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
            {SAMPLE_VEHICLE.highlights.map((h) => (
              <FeatureCard key={h.id} id={h.id} title={h.title} description={h.description} media={h.media} onLearnMore={() => setOpenModal("spec")} />
            ))}
          </div>
        </div>
      </section>

      <ThreeDCardCarousel slides={SAMPLE_VEHICLE.carousel} />

      <CarBuilder grades={SAMPLE_GRADES} />

      <GradeCompare grades={SAMPLE_GRADES} specs={SAMPLE_SPECS} />

      <RefinedTechExperience />

      <PrimaryCTAs />

      <FeatureModal1 open={openModal === "image"} onClose={() => setOpenModal(null)} image={SAMPLE_VEHICLE.hero.imageUrl} />
      <FeatureModal2 open={openModal === "spec"} onClose={() => setOpenModal(null)} specs={{ "Powertrain": "V6 Hybrid", "Drive": "4WD" }} />
      <FeatureModal3 open={openModal === "video"} onClose={() => setOpenModal(null)} videoUrl={undefined} poster={SAMPLE_VEHICLE.hero.poster} />
      <FeatureModal4 open={openModal === "hotspots"} onClose={() => setOpenModal(null)} hotspots={[{ x: 20, y: 30, label: "A" }, { x: 70, y: 50, label: "B" }]} />
      <FeatureModal5 open={openModal === "qa"} onClose={() => setOpenModal(null)} qas={[{ q: "What is warranty?", a: "Standard warranty." }]} />
      <FeatureModal6 open={openModal === "spin"} onClose={() => setOpenModal(null)} image={SAMPLE_VEHICLE.hero.imageUrl} />
    </main>
  );
}