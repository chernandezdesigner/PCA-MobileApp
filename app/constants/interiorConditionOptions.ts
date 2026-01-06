// ============================================
// INTERIOR CONDITIONS - Step 1: Commercial Tenant Unit Finishes
// ============================================

// ============================================
// TENANT FLOORS, WALLS & CEILINGS OPTIONS
// ============================================

export const TENANT_FLOOR_OPTIONS = [
  { id: "carpet", label: "Carpet" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "vct", label: "VCT" },
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "marble", label: "Marble" },
] as const

export const TENANT_WALL_OPTIONS = [
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "wallpaper", label: "Wallpaper" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "woodPaneling", label: "Wood paneling" },
] as const

export const TENANT_CEILING_OPTIONS = [
  { id: "marlite", label: "Marlite" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
  { id: "decorativePanelTiles", label: "Decorative Panel Tiles" },
] as const

export const TENANT_OTHER_OPTIONS = [
  { id: "mirrors", label: "Mirrors" },
  { id: "other", label: "Other" },
] as const

// ============================================
// RESTROOM FLOORS, WALLS & CEILINGS OPTIONS
// ============================================

export const RESTROOM_FLOOR_OPTIONS = [
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "marlite", label: "Marlite" },
] as const

export const RESTROOM_WALL_OPTIONS = [
  { id: "paintedDrywallClg", label: "Painted Drywall Clg." },
  { id: "ceramicWainscot", label: "Ceramic Wainscot" },
  { id: "metalPartitions", label: "Metal partitions" },
  { id: "pLamPartitions", label: "P-Lam partitions" },
] as const

export const RESTROOM_CEILING_OPTIONS = [
  { id: "vct", label: "VCT" },
  { id: "act", label: "ACT" },
  { id: "wallpaper", label: "Wallpaper" },
  { id: "woodPaneling", label: "Wood paneling" },
  { id: "mirrors", label: "Mirrors" },
] as const

export const RESTROOM_OTHER_OPTIONS = [
  { id: "decorativePanelTiles", label: "Decorative Panel Tiles" },
  { id: "other", label: "Other" },
] as const

// ============================================
// KITCHEN FLOORS, WALLS & CEILINGS OPTIONS
// (Same as Tenant)
// ============================================

export const KITCHEN_FLOOR_OPTIONS = TENANT_FLOOR_OPTIONS
export const KITCHEN_WALL_OPTIONS = TENANT_WALL_OPTIONS
export const KITCHEN_CEILING_OPTIONS = TENANT_CEILING_OPTIONS
export const KITCHEN_OTHER_OPTIONS = TENANT_OTHER_OPTIONS

// ============================================
// WAREHOUSE FLOORS, WALLS & CEILINGS OPTIONS
// ============================================

export const WAREHOUSE_FLOOR_OPTIONS = [
  { id: "unfinishedConcreteFlooring", label: "Unfinished Concrete Flooring" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
] as const

export const WAREHOUSE_UNFINISHED_OPTIONS = [
  { id: "walls", label: "Walls" },
  { id: "ceiling", label: "Ceiling" },
] as const

export const WAREHOUSE_CEILING_OPTIONS = [
  { id: "paintedDrywallClg", label: "Painted Drywall Clg." },
  { id: "act", label: "ACT" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
] as const

export const WAREHOUSE_OTHER_OPTIONS = [
  { id: "other", label: "Other" },
] as const

// ============================================
// TYPE EXPORTS
// ============================================

export type TenantFloorId = typeof TENANT_FLOOR_OPTIONS[number]["id"]
export type TenantWallId = typeof TENANT_WALL_OPTIONS[number]["id"]
export type TenantCeilingId = typeof TENANT_CEILING_OPTIONS[number]["id"]
export type TenantOtherId = typeof TENANT_OTHER_OPTIONS[number]["id"]

export type RestroomFloorId = typeof RESTROOM_FLOOR_OPTIONS[number]["id"]
export type RestroomWallId = typeof RESTROOM_WALL_OPTIONS[number]["id"]
export type RestroomCeilingId = typeof RESTROOM_CEILING_OPTIONS[number]["id"]
export type RestroomOtherId = typeof RESTROOM_OTHER_OPTIONS[number]["id"]

export type KitchenFloorId = typeof KITCHEN_FLOOR_OPTIONS[number]["id"]
export type KitchenWallId = typeof KITCHEN_WALL_OPTIONS[number]["id"]
export type KitchenCeilingId = typeof KITCHEN_CEILING_OPTIONS[number]["id"]
export type KitchenOtherId = typeof KITCHEN_OTHER_OPTIONS[number]["id"]

export type WarehouseFloorId = typeof WAREHOUSE_FLOOR_OPTIONS[number]["id"]
export type WarehouseUnfinishedId = typeof WAREHOUSE_UNFINISHED_OPTIONS[number]["id"]
export type WarehouseCeilingId = typeof WAREHOUSE_CEILING_OPTIONS[number]["id"]
export type WarehouseOtherId = typeof WAREHOUSE_OTHER_OPTIONS[number]["id"]

// ============================================
// INTERIOR CONDITIONS - Step 2: Common Area Finishes
// ============================================

// ============================================
// LOBBY / OFFICE / MISC FLOORS, WALLS & CEILINGS OPTIONS
// (Same as Tenant but with Terrazzo Flooring added)
// ============================================

export const LOBBY_FLOOR_OPTIONS = [
  { id: "carpet", label: "Carpet" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "vct", label: "VCT" },
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "marble", label: "Marble" },
] as const

export const LOBBY_WALL_OPTIONS = [
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "wallpaper", label: "Wallpaper" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "woodPaneling", label: "Wood paneling" },
] as const

export const LOBBY_CEILING_OPTIONS = [
  { id: "marlite", label: "Marlite" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
  { id: "decorativePanelTiles", label: "Decorative Panel Tiles" },
] as const

export const LOBBY_OTHER_OPTIONS = [
  { id: "mirrors", label: "Mirrors" },
  { id: "terrazzoFlooring", label: "Terrazzo Flooring" },
  { id: "other", label: "Other" },
] as const

// ============================================
// BACK OF HOUSE, CORRIDOR, MECHANICAL ROOMS OPTIONS
// (Same as Lobby)
// ============================================

export const BACK_OF_HOUSE_FLOOR_OPTIONS = LOBBY_FLOOR_OPTIONS
export const BACK_OF_HOUSE_WALL_OPTIONS = LOBBY_WALL_OPTIONS
export const BACK_OF_HOUSE_CEILING_OPTIONS = LOBBY_CEILING_OPTIONS
export const BACK_OF_HOUSE_OTHER_OPTIONS = LOBBY_OTHER_OPTIONS

// ============================================
// COMMON AREA RESTROOMS OPTIONS
// (Same as Step 1 Restroom)
// ============================================

export const COMMON_AREA_RESTROOM_FLOOR_OPTIONS = RESTROOM_FLOOR_OPTIONS
export const COMMON_AREA_RESTROOM_WALL_OPTIONS = RESTROOM_WALL_OPTIONS
export const COMMON_AREA_RESTROOM_CEILING_OPTIONS = RESTROOM_CEILING_OPTIONS
export const COMMON_AREA_RESTROOM_OTHER_OPTIONS = RESTROOM_OTHER_OPTIONS

// ============================================
// AMENITIES OPTIONS
// ============================================

export const AMENITIES_OPTIONS = [
  { id: "mailboxes", label: "Mailboxes" },
  { id: "directory", label: "Directory" },
  { id: "other", label: "Other" },
] as const

// ============================================
// TYPE EXPORTS FOR STEP 2
// ============================================

export type LobbyFloorId = typeof LOBBY_FLOOR_OPTIONS[number]["id"]
export type LobbyWallId = typeof LOBBY_WALL_OPTIONS[number]["id"]
export type LobbyCeilingId = typeof LOBBY_CEILING_OPTIONS[number]["id"]
export type LobbyOtherId = typeof LOBBY_OTHER_OPTIONS[number]["id"]

export type BackOfHouseFloorId = typeof BACK_OF_HOUSE_FLOOR_OPTIONS[number]["id"]
export type BackOfHouseWallId = typeof BACK_OF_HOUSE_WALL_OPTIONS[number]["id"]
export type BackOfHouseCeilingId = typeof BACK_OF_HOUSE_CEILING_OPTIONS[number]["id"]
export type BackOfHouseOtherId = typeof BACK_OF_HOUSE_OTHER_OPTIONS[number]["id"]

export type CommonAreaRestroomFloorId = typeof COMMON_AREA_RESTROOM_FLOOR_OPTIONS[number]["id"]
export type CommonAreaRestroomWallId = typeof COMMON_AREA_RESTROOM_WALL_OPTIONS[number]["id"]
export type CommonAreaRestroomCeilingId = typeof COMMON_AREA_RESTROOM_CEILING_OPTIONS[number]["id"]
export type CommonAreaRestroomOtherId = typeof COMMON_AREA_RESTROOM_OTHER_OPTIONS[number]["id"]

export type AmenitiesId = typeof AMENITIES_OPTIONS[number]["id"]

// ============================================
// FURNITURE, FIXTURES, AND EQUIPMENT OPTIONS
// ============================================

export const FURNITURE_FIXTURES_EQUIPMENT_OPTIONS = [
  { id: "sofas", label: "Sofas" },
  { id: "chairs", label: "Chairs" },
  { id: "lamps", label: "Lamps" },
  { id: "decorations", label: "Decorations" },
  { id: "bathroomFixtures", label: "Bathroom Fixtures" },
  { id: "other", label: "Other" },
] as const

// ============================================
// EXERCISE ROOM FLOORS, WALLS & CEILINGS OPTIONS
// ============================================

export const EXERCISE_ROOM_FLOOR_OPTIONS = [
  { id: "carpet", label: "Carpet" },
  { id: "rubberMat", label: "Rubber Mat" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "vct", label: "VCT" },
] as const

export const EXERCISE_ROOM_WALL_OPTIONS = [
  { id: "mirroredWalls", label: "Mirrored Walls" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
] as const

export const EXERCISE_ROOM_CEILING_OPTIONS = [
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
] as const

export const EXERCISE_ROOM_OTHER_OPTIONS = [
  { id: "other", label: "Other" },
] as const

// ============================================
// COMMON KITCHEN FLOORS, WALLS & CEILINGS OPTIONS
// ============================================

export const COMMON_KITCHEN_FLOOR_OPTIONS = [
  { id: "unfinished", label: "Unfinished" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "quarryTile", label: "Quarry Tile" },
] as const

export const COMMON_KITCHEN_WALL_OPTIONS = [
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "marliteWalls", label: "Marlite Walls" },
  { id: "ceramicWainscot", label: "Ceramic Wainscot" },
] as const

export const COMMON_KITCHEN_CEILING_OPTIONS = [
  { id: "vct", label: "VCT" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
] as const

// ============================================
// TYPE EXPORTS FOR ADDITIONAL STEP 2 SECTIONS
// ============================================

export type FurnitureFixturesEquipmentId = typeof FURNITURE_FIXTURES_EQUIPMENT_OPTIONS[number]["id"]

export type ExerciseRoomFloorId = typeof EXERCISE_ROOM_FLOOR_OPTIONS[number]["id"]
export type ExerciseRoomWallId = typeof EXERCISE_ROOM_WALL_OPTIONS[number]["id"]
export type ExerciseRoomCeilingId = typeof EXERCISE_ROOM_CEILING_OPTIONS[number]["id"]
export type ExerciseRoomOtherId = typeof EXERCISE_ROOM_OTHER_OPTIONS[number]["id"]

export type CommonKitchenFloorId = typeof COMMON_KITCHEN_FLOOR_OPTIONS[number]["id"]
export type CommonKitchenWallId = typeof COMMON_KITCHEN_WALL_OPTIONS[number]["id"]
export type CommonKitchenCeilingId = typeof COMMON_KITCHEN_CEILING_OPTIONS[number]["id"]

