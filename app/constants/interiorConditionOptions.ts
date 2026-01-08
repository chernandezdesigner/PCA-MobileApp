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

//step 4 alt properties options

//hotels 

//hotels unit finishes options

export const HotelUnitFinishesOptions = [
  { id: "carpet", label: "Carpet" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "vinylCovWalls", label: "Vinyl-cov. Walls" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceilings" },
  { id: "vct", label: "VCT" },
  { id: "other", label: "Other" },
] as const

export const HotelCommonAreaListsOptions = [
  { id: "adminOffice", label: "Admin Office" },
  { id: "receptionDesk", label: "Reception Desk" },
  { id: "loungeArea", label: "Lounge Area" },
  { id: "privateOffice", label: "Private Office" },
  { id: "businessCenter", label: "Business Center" },
  { id: "retailShops", label: "Retail Shops" },
  { id: "laundry", label: "Laundry" },
  { id: "kitchen", label: "Kitchen" },
  { id: "banquetRooms", label: "Banquet Rooms" },
  { id: "banquet", label: "Banquet" },
  { id: "restrooms", label: "Restrooms" },
  { id: "other", label: "Other" },
] as const

export const HotelAdminOfficeFinishesOptions = [
    { id: "carpet", label: "Carpet" },
    { id: "sheetVinyl", label: "Sheet Vinyl" },
    { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
    { id: "ceramicTile", label: "Ceramic Tile" },
    { id: "vinylCovWalls", label: "Vinyl-cov. Walls" },
    { id: "paintedDrywallCeiling", label: "Painted Drywall Ceilings" },
    { id: "act", label: "ACT" },
    { id: "vct", label: "VCT" },
    { id: "other", label: "Other" },
  ] as const

// ============================================
// HOTEL LOUNGE FINISHES OPTIONS
// ============================================

export const HotelLoungeFinishesOptions = [
  { id: "carpet", label: "Carpet" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallClgs", label: "Painted Drywall Clgs" },
  { id: "act", label: "ACT" },
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "marliteWalls", label: "Marlite Walls" },
  { id: "other", label: "Other" },
] as const

// ============================================
// HOTEL RESTROOMS FINISHES OPTIONS
// ============================================

export const HotelRestroomsFinishesOptions = [
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallClg", label: "Painted Drywall Clg." },
  { id: "act", label: "ACT" },
  { id: "ceramicWainscot", label: "Ceramic Wainscot" },
  { id: "metalPartitions", label: "Metal partitions" },
  { id: "pLamPartitions", label: "P-Lam partitions" },
  { id: "other", label: "Other" },
] as const

// ============================================
// HOTEL KITCHEN FINISHES OPTIONS
// ============================================

export const HotelKitchenFinishesOptions = [
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallClg", label: "Painted Drywall Clg." },
  { id: "act", label: "ACT" },
  { id: "marliteWalls", label: "Marlite Walls" },
  { id: "other", label: "Other" },
] as const

// ============================================
// HOTEL GUEST LAUNDRY FINISHES OPTIONS
// ============================================

export const HotelGuestLaundryFinishesOptions = [
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "vinylWalls", label: "Vinyl- Walls" },
  { id: "paintedDrywallClgs", label: "Painted Drywall Clgs" },
  { id: "act", label: "ACT" },
  { id: "other", label: "Other" },
] as const

export const HotelGuestLaundryLocationOptions = [
  { id: "eachFloor", label: "Each Floor" },
  { id: "other", label: "Other" },
] as const

// ============================================
// HOTEL COMMERCIAL LAUNDRY FINISHES OPTIONS
// ============================================

export const HotelCommercialLaundryFinishesOptions = [
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "vinylWalls", label: "Vinyl- Walls" },
  { id: "paintedDrywallClgs", label: "Painted Drywall Clgs" },
  { id: "act", label: "ACT" },
] as const

// ============================================
// TYPE EXPORTS FOR HOTEL FINISHES
// ============================================

export type HotelUnitFinishesId = typeof HotelUnitFinishesOptions[number]["id"]
export type HotelCommonAreaListsId = typeof HotelCommonAreaListsOptions[number]["id"]
export type HotelAdminOfficeFinishesId = typeof HotelAdminOfficeFinishesOptions[number]["id"]
export type HotelLoungeFinishesId = typeof HotelLoungeFinishesOptions[number]["id"]
export type HotelRestroomsFinishesId = typeof HotelRestroomsFinishesOptions[number]["id"]
export type HotelKitchenFinishesId = typeof HotelKitchenFinishesOptions[number]["id"]
export type HotelGuestLaundryFinishesId = typeof HotelGuestLaundryFinishesOptions[number]["id"]
export type HotelGuestLaundryLocationId = typeof HotelGuestLaundryLocationOptions[number]["id"]
export type HotelCommercialLaundryFinishesId = typeof HotelCommercialLaundryFinishesOptions[number]["id"]

//hotel furniture, fixtures, and equipment options

// ============================================
// HOTEL LOBBY FF&E OPTIONS
// ============================================

export const HotelLobbyFFEOptions = [
  { id: "sofas", label: "Sofas" },
  { id: "stackableChairs", label: "Stackable Chairs" },
  { id: "tables", label: "Tables" },
  { id: "chairs", label: "Chairs" },
  { id: "foldingTables", label: "Folding Tables" },
  { id: "decorations", label: "Decorations" },
  { id: "lamps", label: "Lamps" },
  { id: "other", label: "Other" },
] as const

// ============================================
// HOTEL COMMERCIAL LAUNDRY EQUIPMENT OPTIONS
// ============================================

export const HotelCommercialLaundryEquipmentOptions = [
  { id: "washers", label: "Washers" },
  { id: "dryers", label: "Dryers" },
  { id: "gasHeatedIroner", label: "Gas-heated ironer" },
  { id: "laundryFolder", label: "Laundry folder" },
  { id: "dryCleanMachine", label: "Dry-clean machine" },
] as const

// ============================================
// HOTEL GUEST LAUNDRY EQUIPMENT OPTIONS
// ============================================

export const HotelGuestLaundryEquipmentOptions = [
  { id: "washers", label: "Washers" },
  { id: "dryers", label: "Dryers" },
  { id: "laundrySinks", label: "Laundry Sinks" },
] as const

export const HotelGuestLaundryFridgeFreezerOptions = [
  { id: "walkIn", label: "Walk-in" },
  { id: "upright", label: "Upright" },
  { id: "underCounter", label: "Under-counter" },
] as const

// ============================================
// HOTEL COMMERCIAL KITCHEN EQUIPMENT OPTIONS
// ============================================

export const HotelCommercialKitchenDishwasherOptions = [
  { id: "leased", label: "Leased" },
  { id: "owned", label: "Owned" },
] as const

export const HotelCommercialKitchenEquipmentOptions = [
  { id: "dishwasher", label: "Dishwasher" },
  { id: "exhaustHoodDuctedToExterior", label: "Exhaust hood ducted to exterior" },
  { id: "gasFryers", label: "Gas fryers" },
  { id: "grills", label: "Grills" },
  { id: "stainlessSteelWorkTablesShelving", label: "Stainless steel work tables/shelving" },
  { id: "ovens", label: "Ovens" },
  { id: "ranges", label: "Ranges" },
  { id: "steamTables", label: "Steam tables" },
  { id: "microwaveOven", label: "Microwave oven" },
  { id: "iceMachines", label: "Ice machines" },
  { id: "other", label: "Other" },
] as const

// ============================================
// HOTEL GUEST ROOM SOFT GOODS OPTIONS
// ============================================

export const HotelGuestRoomSoftGoodsOptions = [
  { id: "mattresses", label: "Mattresses" },
  { id: "linens", label: "Linens" },
  { id: "windowTreatments", label: "Window treatments" },
  { id: "decorations", label: "Decorations" },
  { id: "other", label: "Other" },
] as const

// ============================================
// HOTEL GUEST ROOM HARD GOODS OPTIONS
// ============================================

export const HotelGuestRoomHardGoodsOptions = [
  { id: "beds", label: "Beds" },
  { id: "sofa", label: "Sofa" },
  { id: "nightStands", label: "Night stands" },
  { id: "tables", label: "Tables" },
  { id: "chairs", label: "Chairs" },
  { id: "dresserDrawers", label: "Dresser drawers" },
  { id: "other", label: "Other" },
] as const

export const HotelGuestRoomTVOptions = [
  { id: "standard", label: "Standard" },
  { id: "flatScreen", label: "Flat screen" },
] as const

export const HotelGuestRoomWardrobeOptions = [
  { id: "builtIn", label: "Built-in" },
  { id: "freeStanding", label: "Free-standing" },
] as const

// ============================================
// HOTEL GUEST ROOM KITCHENS OPTIONS
// ============================================

export const HotelGuestRoomKitchenCabinetsOptions = [
  { id: "naturalWood", label: "Natural Wood" },
  { id: "compositeWood", label: "Composite Wood" },
  { id: "pLamWood", label: "P-Lam Wood" },
] as const

export const HotelGuestRoomKitchenCounterTopsOptions = [
  { id: "pLam", label: "P-Lam" },
  { id: "granite", label: "Granite" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "culturedMarble", label: "Cultured Marble" },
] as const

// ============================================
// HOTEL GUEST ROOM KITCHEN EQUIPMENT OPTIONS
// ============================================

export const HotelGuestRoomKitchenRangeOptions = [
  { id: "gas", label: "Gas" },
  { id: "electric", label: "Electric" },
] as const

export const HotelGuestRoomKitchenHoodOptions = [
  { id: "ducted", label: "Ducted" },
  { id: "ductless", label: "Ductless" },
] as const

export const HotelGuestRoomKitchenEquipmentOptions = [
  { id: "refrigerator", label: "Refrigerator" },
  { id: "range", label: "Range" },
  { id: "hood", label: "Hood" },
  { id: "dishwasher", label: "Dishwasher" },
  { id: "garbageDisposal", label: "Garbage Disposal" },
  { id: "microwave", label: "Microwave" },
  { id: "trashCompactor", label: "Trash Compactor" },
  { id: "coffeeMaker", label: "Coffee Maker" },
  { id: "other", label: "Other" },
] as const

// ============================================
// HOTEL GUEST ROOM BATHROOMS OPTIONS
// ============================================

export const HotelGuestRoomBathtubOptions = [
  { id: "steelEnameled", label: "Steel Enameled" },
  { id: "fiberglass", label: "Fiberglass" },
] as const

export const HotelGuestRoomTubSurroundsOptions = [
  { id: "ceramicTile", label: "Ceramic tile" },
  { id: "fiberglass", label: "Fiberglass" },
] as const

export const HotelGuestRoomShowersOptions = [
  { id: "ceramicTile", label: "Ceramic tile" },
  { id: "fiberglass", label: "Fiberglass" },
] as const

export const HotelGuestRoomBathroomOptions = [
  { id: "bathtubs", label: "Bathtubs" },
  { id: "tubSurrounds", label: "Tub Surrounds" },
  { id: "rollInShowers", label: "Roll-in Showers" },
  { id: "ceramicVanities", label: "Ceramic Vanities" },
  { id: "other", label: "Other" },
] as const

// ============================================
// TYPE EXPORTS FOR HOTEL FF&E
// ============================================

export type HotelLobbyFFEId = typeof HotelLobbyFFEOptions[number]["id"]
export type HotelCommercialLaundryEquipmentId = typeof HotelCommercialLaundryEquipmentOptions[number]["id"]
export type HotelGuestLaundryEquipmentId = typeof HotelGuestLaundryEquipmentOptions[number]["id"]
export type HotelGuestLaundryFridgeFreezerId = typeof HotelGuestLaundryFridgeFreezerOptions[number]["id"]
export type HotelCommercialKitchenDishwasherId = typeof HotelCommercialKitchenDishwasherOptions[number]["id"]
export type HotelCommercialKitchenEquipmentId = typeof HotelCommercialKitchenEquipmentOptions[number]["id"]
export type HotelGuestRoomSoftGoodsId = typeof HotelGuestRoomSoftGoodsOptions[number]["id"]
export type HotelGuestRoomHardGoodsId = typeof HotelGuestRoomHardGoodsOptions[number]["id"]
export type HotelGuestRoomTVId = typeof HotelGuestRoomTVOptions[number]["id"]
export type HotelGuestRoomWardrobeId = typeof HotelGuestRoomWardrobeOptions[number]["id"]
export type HotelGuestRoomKitchenCabinetsId = typeof HotelGuestRoomKitchenCabinetsOptions[number]["id"]
export type HotelGuestRoomKitchenCounterTopsId = typeof HotelGuestRoomKitchenCounterTopsOptions[number]["id"]
export type HotelGuestRoomKitchenRangeId = typeof HotelGuestRoomKitchenRangeOptions[number]["id"]
export type HotelGuestRoomKitchenHoodId = typeof HotelGuestRoomKitchenHoodOptions[number]["id"]
export type HotelGuestRoomKitchenEquipmentId = typeof HotelGuestRoomKitchenEquipmentOptions[number]["id"]
export type HotelGuestRoomBathtubId = typeof HotelGuestRoomBathtubOptions[number]["id"]
export type HotelGuestRoomTubSurroundsId = typeof HotelGuestRoomTubSurroundsOptions[number]["id"]
export type HotelGuestRoomShowersId = typeof HotelGuestRoomShowersOptions[number]["id"]
export type HotelGuestRoomBathroomId = typeof HotelGuestRoomBathroomOptions[number]["id"]


// apartments

// ============================================
// APARTMENT UNIT FINISHES OPTIONS
// ============================================

export const ApartmentUnitFinishesOptions = [
  { id: "carpet", label: "Carpet" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "vct", label: "VCT" },
  { id: "other", label: "Other" },
] as const

export const ApartmentRestroomFinishesOptions = [
  { id: "carpet", label: "Carpet" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallClg", label: "Painted Drywall Clg." },
  { id: "other", label: "Other" },
] as const

export const ApartmentKitchenFinishesOptions = [
  { id: "carpet", label: "Carpet" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallClg", label: "Painted Drywall Clg." },
  { id: "other", label: "Other" },
] as const

export const ApartmentInteriorDoorsOptions = [
  { id: "painted", label: "Painted" },
  { id: "woodFrame", label: "Wood Frame" },
  { id: "lever", label: "Lever" },
  { id: "stained", label: "Stained" },
  { id: "metalFrame", label: "Metal Frame" },
  { id: "knob", label: "Knob" },
  { id: "other", label: "Other" },
] as const

export const ApartmentWardrobeOptions = [
  { id: "sliding", label: "Sliding" },
  { id: "biFold", label: "Bi-Fold" },
] as const

// ============================================
// APARTMENT COMMON AREA FINISHES OPTIONS
// ============================================

export const ApartmentClubhouseLobbyFinishesOptions = [
  { id: "carpet", label: "Carpet" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "terrazzoFlooring", label: "Terrazzo Flooring" },
  { id: "other", label: "Other" },
] as const

export const ApartmentCorridorFinishesOptions = [
  { id: "carpet", label: "Carpet" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
  { id: "other", label: "Other" },
] as const

export const ApartmentCommonRestroomsFinishesOptions = [
  { id: "unfinished", label: "Unfinished" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "marliteWalls", label: "Marlite Walls" },
  { id: "ceramicWainscot", label: "Ceramic Wainscot" },
] as const

export const ApartmentExerciseRoomFinishesOptions = [
  { id: "carpet", label: "Carpet" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "rubberMat", label: "Rubber Mat" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
  { id: "mirroredWalls", label: "Mirrored Walls" },
  { id: "other", label: "Other" },
] as const

export const ApartmentCommonKitchenFinishesOptions = [
  { id: "unfinished", label: "Unfinished" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
  { id: "quarryTile", label: "Quarry Tile" },
  { id: "marliteWalls", label: "Marlite Walls" },
  { id: "ceramicWainscot", label: "Ceramic Wainscot" },
] as const

export const ApartmentLaundryRoomFinishesOptions = [
  { id: "unfinished", label: "Unfinished" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
] as const

export const ApartmentManagerUnitFinishesOptions = [
  { id: "carpet", label: "Carpet" },
  { id: "ceramicTile", label: "Ceramic Tile" },
  { id: "paintedDrywallWalls", label: "Painted Drywall Walls" },
  { id: "vct", label: "VCT" },
  { id: "sheetVinyl", label: "Sheet Vinyl" },
  { id: "vinylCovWalls", label: "Vinyl-Cov. Walls" },
  { id: "paintedDrywallCeiling", label: "Painted Drywall Ceiling" },
  { id: "act", label: "ACT" },
  { id: "other", label: "Other" },
] as const

// ============================================
// APARTMENT FURNITURE, FIXTURES, AND EQUIPMENT OPTIONS
// ============================================

export const ApartmentLobbyFFEOptions = [
  { id: "sofas", label: "Sofas" },
  { id: "chairs", label: "Chairs" },
  { id: "tables", label: "Tables" },
  { id: "decorations", label: "Decorations" },
  { id: "lamps", label: "Lamps" },
  { id: "tvs", label: "TVs" },
  { id: "other", label: "Other" },
] as const

export const ApartmentBusinessCenterOptions = [
  { id: "workstation", label: "Workstation" },
] as const

export const ApartmentCommonAreaLaundryEquipmentOptions = [
  { id: "washers", label: "Washers" },
  { id: "dryers", label: "Dryers" },
  { id: "laundrySinks", label: "Laundry Sinks" },
] as const

export const ApartmentLaundryOwnershipOptions = [
  { id: "owned", label: "Owned" },
  { id: "leased", label: "Leased" },
] as const

export const ApartmentLaundryProvidedByOptions = [
  { id: "tenant", label: "Tenant" },
  { id: "management", label: "Management" },
] as const

export const ApartmentLaundryLocationOptions = [
  { id: "some", label: "Some" },
  { id: "allUnits", label: "All Units" },
] as const

export const ApartmentKitchenCabinetsOptions = [
  { id: "naturalWood", label: "Natural wood" },
  { id: "compositeWood", label: "Composite wood" },
  { id: "pLamWood", label: "P-Lam wood" },
] as const

export const ApartmentKitchenCounterTopsOptions = [
  { id: "pLam", label: "P-Lam" },
  { id: "granite", label: "Granite" },
  { id: "ceramicTile", label: "Ceramic Tile" },
] as const

export const ApartmentKitchenRangeOptions = [
  { id: "gas", label: "Gas" },
  { id: "electric", label: "Electric" },
] as const

export const ApartmentKitchenHoodOptions = [
  { id: "ducted", label: "Ducted" },
  { id: "ductless", label: "Ductless" },
] as const

export const ApartmentKitchenEquipmentOptions = [
  { id: "refrigerator", label: "Refrigerator" },
  { id: "range", label: "Range" },
  { id: "hood", label: "Hood" },
  { id: "dishwasher", label: "Dishwasher" },
  { id: "garbageDisposal", label: "Garbage Disposal" },
  { id: "microwave", label: "Microwave" },
  { id: "trashCompactor", label: "Trash Compactor" },
  { id: "gasFireplace", label: "Gas fireplace" },
  { id: "other", label: "Other" },
] as const

export const ApartmentBathtubOptions = [
  { id: "steelEnameled", label: "Steel Enameled" },
  { id: "fiberglass", label: "Fiberglass" },
] as const

export const ApartmentTubSurroundsOptions = [
  { id: "ceramicTile", label: "Ceramic tile" },
  { id: "fiberglass", label: "Fiberglass" },
] as const

export const ApartmentRollInShowersOptions = [
  { id: "ceramicTile", label: "Ceramic tile" },
  { id: "fiberglass", label: "Fiberglass" },
] as const

export const ApartmentBathroomOptions = [
  { id: "cabinets", label: "Cabinets" },
  { id: "counterTops", label: "Counter-Tops" },
  { id: "bathtubs", label: "Bathtubs" },
  { id: "tubSurrounds", label: "Tub Surrounds" },
  { id: "rollInShowers", label: "Roll-in Showers" },
  { id: "ceramicVanities", label: "Ceramic Vanities" },
  { id: "other", label: "Other" },
] as const

export const ApartmentFurnishedApartmentItemsOptions = [
  { id: "linens", label: "Linens" },
  { id: "beds", label: "Beds" },
  { id: "tables", label: "Tables" },
  { id: "chairs", label: "Chairs" },
  { id: "dressers", label: "Dressers" },
  { id: "wardrobes", label: "Wardrobes" },
  { id: "nightStands", label: "Night stands" },
] as const

export const ApartmentFurnishedApartmentTVOptions = [
  { id: "standard", label: "Standard" },
  { id: "flatScreens", label: "Flat screens" },
] as const

// ============================================
// TYPE EXPORTS FOR APARTMENT OPTIONS
// ============================================

export type ApartmentUnitFinishesId = typeof ApartmentUnitFinishesOptions[number]["id"]
export type ApartmentRestroomFinishesId = typeof ApartmentRestroomFinishesOptions[number]["id"]
export type ApartmentKitchenFinishesId = typeof ApartmentKitchenFinishesOptions[number]["id"]
export type ApartmentInteriorDoorsId = typeof ApartmentInteriorDoorsOptions[number]["id"]
export type ApartmentWardrobeId = typeof ApartmentWardrobeOptions[number]["id"]

export type ApartmentClubhouseLobbyFinishesId = typeof ApartmentClubhouseLobbyFinishesOptions[number]["id"]
export type ApartmentCorridorFinishesId = typeof ApartmentCorridorFinishesOptions[number]["id"]
export type ApartmentCommonRestroomsFinishesId = typeof ApartmentCommonRestroomsFinishesOptions[number]["id"]
export type ApartmentExerciseRoomFinishesId = typeof ApartmentExerciseRoomFinishesOptions[number]["id"]
export type ApartmentCommonKitchenFinishesId = typeof ApartmentCommonKitchenFinishesOptions[number]["id"]
export type ApartmentLaundryRoomFinishesId = typeof ApartmentLaundryRoomFinishesOptions[number]["id"]
export type ApartmentManagerUnitFinishesId = typeof ApartmentManagerUnitFinishesOptions[number]["id"]

export type ApartmentLobbyFFEId = typeof ApartmentLobbyFFEOptions[number]["id"]
export type ApartmentBusinessCenterId = typeof ApartmentBusinessCenterOptions[number]["id"]
export type ApartmentCommonAreaLaundryEquipmentId = typeof ApartmentCommonAreaLaundryEquipmentOptions[number]["id"]
export type ApartmentLaundryOwnershipId = typeof ApartmentLaundryOwnershipOptions[number]["id"]
export type ApartmentLaundryProvidedById = typeof ApartmentLaundryProvidedByOptions[number]["id"]
export type ApartmentLaundryLocationId = typeof ApartmentLaundryLocationOptions[number]["id"]
export type ApartmentKitchenCabinetsId = typeof ApartmentKitchenCabinetsOptions[number]["id"]
export type ApartmentKitchenCounterTopsId = typeof ApartmentKitchenCounterTopsOptions[number]["id"]
export type ApartmentKitchenRangeId = typeof ApartmentKitchenRangeOptions[number]["id"]
export type ApartmentKitchenHoodId = typeof ApartmentKitchenHoodOptions[number]["id"]
export type ApartmentKitchenEquipmentId = typeof ApartmentKitchenEquipmentOptions[number]["id"]
export type ApartmentBathtubId = typeof ApartmentBathtubOptions[number]["id"]
export type ApartmentTubSurroundsId = typeof ApartmentTubSurroundsOptions[number]["id"]
export type ApartmentRollInShowersId = typeof ApartmentRollInShowersOptions[number]["id"]
export type ApartmentBathroomId = typeof ApartmentBathroomOptions[number]["id"]
export type ApartmentFurnishedApartmentItemsId = typeof ApartmentFurnishedApartmentItemsOptions[number]["id"]
export type ApartmentFurnishedApartmentTVId = typeof ApartmentFurnishedApartmentTVOptions[number]["id"]

