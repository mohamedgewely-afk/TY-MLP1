
import React, { memo } from "react";
import OptimizedSceneCard from "./OptimizedSceneCard";

interface SceneData {
  id: string;
  title: string;
  scene: string;
  image: string;
  description: string;
  specs: Record<string, string>;
}

interface DesktopGalleryGridProps {
  scenes: SceneData[];
  activeIdx: number;
  onSceneSelect: (scene: SceneData, index: number) => void;
  onSceneFocus: (index: number) => void;
  expandLabel: string;
  openSceneLabel: (scene: string) => string;
}

const DesktopGalleryGrid = memo(({
  scenes,
  activeIdx,
  onSceneSelect,
  onSceneFocus,
  expandLabel,
  openSceneLabel,
}: DesktopGalleryGridProps) => {
  if (scenes.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
      {scenes.map((scene, idx) => (
        <OptimizedSceneCard
          key={scene.id}
          data={scene}
          active={idx === activeIdx}
          tabIndex={idx === activeIdx ? 0 : -1}
          onEnter={() => onSceneSelect(scene, idx)}
          onFocus={() => onSceneFocus(idx)}
          ariaLabel={openSceneLabel(scene.scene)}
          expandLabel={expandLabel}
          isDesktop={true}
        />
      ))}
    </div>
  );
});

DesktopGalleryGrid.displayName = "DesktopGalleryGrid";

export default DesktopGalleryGrid;
