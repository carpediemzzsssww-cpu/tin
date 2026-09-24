export type ObjectCategory = 'toys_charms' | 'daily_stuff' | 'paper_memories' | 'culture' | 'random_shit' | 'found_outside';
export type ProductionStatus = 'planned' | 'sample_in_progress' | 'sample_ready' | 'revision_required' | 'approved';
export interface AssetDefinition {
  id: string;
  name: string;
  category: ObjectCategory;
  family: string;
  variant: string;
  material: string;
  physical_size_mm: { width: number; height: number; depth: number };
  size_class: 'XS' | 'S' | 'M' | 'L';
  render_mode: '2.5d_cutout' | '3d_mesh';
  source_method: 'ai_pre_generated' | 'procedural_svg' | 'procedural_3d';
  source: { kind: string; record: string; url: string | null };
  author: string;
  license_status: string;
  license_note: string;
  asset_path: string | null;
  alpha_bounds: [number, number, number, number] | null;
  customizable_fields: { key: string; label: string; max_length: number }[];
  scale_limits: [number, number];
  allow_partial_overflow: boolean;
  preferred_surface: 'lid' | 'tray';
  default_layer_band: 'paper' | 'object';
  physics_feedback: string;
  status: ProductionStatus;
  sample_material: 'metal' | 'paper' | 'plastic' | 'plush' | 'transparent' | 'cable' | null;
  mvp: boolean;
}
