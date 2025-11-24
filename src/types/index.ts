export interface Shortcut {
  id?: number;
  keys: string;
  description: string;
  category: string;
  app_name: string;
  learned: boolean;
}

export interface App {
  id?: number;
  name: string;
  icon?: string;
}

export interface Category {
  id?: number;
  name: string;
  display_order?: number;
}

export interface ShortcutFilter {
  app_name?: string;
  category?: string;
  learned?: boolean;
  search?: string;
}

export interface LearningProgress {
  total_shortcuts: number;
  learned_shortcuts: number;
  mastery_percentage: number;
  recently_learned: Shortcut[];
  needs_practice: Shortcut[];
}