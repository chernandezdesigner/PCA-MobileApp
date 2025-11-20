//step 1: foundation & substructure options

export const FOUNDATION_SUBSTRUCTURE_OPTIONS = [
    { id: "piersconcrete", label: "Piers: Concrete" },
    { id: "spreadfootings", label: "Spread Footings" },
    { id: "basementscrawlspace", label: "Basements/Crawlspace" },
    { id: "wood", label: "Wood" },
    { id: "slabongrade", label: "Slab on Grade" },
    { id: "foundationwalls", label: "Foundation Walls" },
    { id: "subterraneangarage", label: "Subterranean Garage" },
] as const

export type FoundationSubstructureId = typeof FOUNDATION_SUBSTRUCTURE_OPTIONS[number]["id"]

export const BASMENT_OPTIONS = [
    { id: "concretewallsandfloor", label: "Concrete Walls and Floor" },
    { id:"CMUwallsandconcretefloor", label: "CMU Walls and Concrete Floor" },
    { id:"stonewallsandconcretefloor", label: "Stone Walls and Concrete Floor" },
    { id:"brickmasonrywallsandconcretefloor", label: "Brick Masonry Walls and Concrete Floor" },
] as const

export type BasementId = typeof BASMENT_OPTIONS[number]["id"]

//step 2: SuperStructure Options

export const lateralWallsOptions = [
    { id: "concretetiltup", label: "Concrete Tilt-up" },
    { id:"structuralsteel", label: "Structural Steel" },
    { id:"woodframed", label: "Wood Framed" },
    { id:"brickmasonry", label: "Brick Masonry" },
    { id:"CMU", label: "CMU" },
    { id:"other", label: "Other" },
] as const

export type LateralWallsId = typeof lateralWallsOptions[number]["id"]

export const groundFloorDeckingOptions = [
    { id: "concretecastinplace", label: "Concrete (Cast-in-place)" },
    { id: "concreteslabongrade", label: "Concrete (Slab on-grade)" },
    { id: "concprecast", label: "Concrete (Pre-cast)" },
    { id: "plywoodtoppedwlightweightconcrete", label: "Plywood topped w/ light weight concrete" },
    { id: "steeltoppedwlightweightconcrete", label: "Steel topped w/ light weight concrete" },
] as const

export type GroundFloorDeckingId = typeof groundFloorDeckingOptions[number]["id"]

export const upperFloorDeckingOptions = [
    { id: "concretecastinplace", label: "Concrete (Cast-in-place)" },
    { id: "concreteslabongrade", label: "Concrete (Slab on-grade)" },
    { id: "concprecast", label: "Concrete (Pre-cast)" },
    { id: "plywoodtoppedwlightweightconcrete", label: "Plywood topped w/ light weight concrete" },
    { id: "steeltoppedwlightweightconcrete", label: "Steel topped w/ light weight concrete" },
] as const

export type UpperFloorDeckingId = typeof upperFloorDeckingOptions[number]["id"]

export const mezzanineOptions = [
    { id: "concretecastinplace", label: "Concrete (Cast-in-place)" },
    { id: "plywood", label: "Plywood" },
    { id: "concprecast", label: "Concrete (Pre-cast)" },
    { id: "plywoodtoppedwlightweightconcrete", label: "Plywood topped w/ light weight concrete" },
    { id: "steeltoppedwlightweightconcrete", label: "Steel topped w/ light weight concrete" },
    { id: "steeltoppedwplywood", label: "Steel topped w/ plywood" },
] as const

export type MezzanineId = typeof mezzanineOptions[number]["id"]

export const roofframingwoodOptions = [
    { id: "rafters", label: "Rafters" },
    { id: "glulams", label: "Glu-lams" },
    { id: "purlins", label: "Purlins" },
    { id: "trusstrussjoints", label: "Truss/Truss Joints" },
    { id: "openwebsteelbarjoists", label: "Open-web steel bar joists" },
] as const

export type RoofFramingWoodId = typeof roofframingwoodOptions[number]["id"]

export const roofframingsteelOptions = [
    { id: "decking", label: "Decking" },
    { id: "columns", label: "Columns" },
    { id: "beams", label: "Beams" },
    { id: "openwebsteeltrusses", label: "Open-web steel trusses" },
    { id: "concreteframecolumnsandbeams", label: "Concrete frame (columns and beams)" },
] as const

export type RoofFramingSteelId = typeof roofframingsteelOptions[number]["id"]

export const sheathingOptions = [
    { id: "plywood", label: "Plywood" },
    { id: "osb", label: "OSB" },
    { id: "toppedwlightweightconcrete", label: "Topped w/ light weight concrete" },
] as const

export type SheathingId = typeof sheathingOptions[number]["id"]



//step 3: Roofing Options

export const ROOFING_MATERIAL_OPTIONS = [
  { id: "bur", label: "BUR" },
  { id: "standingSeamMetal", label: "Standing Seam metal" },
  { id: "corrugatedFiberglass", label: "Corrugated Fiberglass" },
  { id: "singlePlyEPDM", label: "Single-ply EPDM" },
  { id: "modifiedAsphaltBituminous", label: "Modified Asphalt Bituminous" },
  { id: "tpo", label: "TPO" },
  { id: "clayVinylTile", label: "Clay / Vinyl Tile" },
  { id: "silveryCoating", label: "Silvery coating" },
] as const

export const ROOFING_SHINGLE_OPTIONS = [
  { id: "asphaltConcrete", label: "Asphalt Concrete" },
  { id: "woodShake", label: "Wood Shake" },
  { id: "concreteTiles", label: "Concrete Tiles" },
  { id:"coatingtype", label: "Coating Type:" },
  { id: "other", label: "Other" },
] as const


export const SECONDARY_ROOF_OPTIONS = [
  { id: "awnings", label: "Awnings" },
  { id: "mansardAspShingles", label: "Mansard (Asp Shingles)" },
  { id: "mansardConcreteTiles", label: "Mansard (Concrete Tiles)" },
  { id: "mansardMetalPanels", label: "Mansard (Metal Panels)" },
  { id: "architecturalTowers", label: "Architectural Towers" },
  { id: "porteCochere", label: "Porte Cochere" },
] as const

export const FLASHING_OPTIONS = [
  { id: "metal", label: "Metal" },
  { id: "concrete", label: "Concrete" },
  { id: "tileAndType", label: "Tile & Type" },
] as const

export const CURB_MOUNTED_OPTIONS = [
  { id: "skylights", label: "Skylights" },
  { id: "smokeVents", label: "Smoke vents" },
  { id: "hvacEquip", label: "HVAC Equip." },
  { id: "antennaSatelliteDish", label: "Antenna / Satellite Dish" },
] as const

export const ROOF_STRUCTURE_OPTIONS = [
  { id: "penthouse", label: "Penthouse" },
  { id: "gazebo", label: "Gazebo" },
  { id: "roofStairwayEnclosure", label: "Roof Stairway Enclosure" },
  { id: "other", label: "Other" },
] as const

export const ATTIC_OPTIONS = [
  { id: "scuttleHole", label: "Scuttle Hole" },
  { id: "draftStops", label: "Draft Stops" },
] as const

export const ATTIC_VENT_OPTIONS = [
  { id: "turbine", label: "Turbine" },
  { id: "soffit", label: "Soffit" },
  { id: "eaveRidge", label: "Eave Ridge" },
  { id: "dormer", label: "Dormer" },
] as const

export const DRAINAGE_OPTIONS = [
  { id: "internal", label: "Internal" },
  { id: "gutter", label: "Gutter" },
  { id: "scuppers", label: "Scuppers" },
  { id: "surfaceUnderground", label: "Surface / Underground" },
] as const

export const INSULATION_OPTIONS = [
  { id: "looseFill", label: "Loose-Fill" },
  { id: "rigid", label: "Rigid" },
  { id: "batt", label: "Batt" },
] as const

// Type helpers
export type RoofingMaterialId = typeof ROOFING_MATERIAL_OPTIONS[number]["id"]
export type RoofingShingleId = typeof ROOFING_SHINGLE_OPTIONS[number]["id"]
export type SecondaryRoofId = typeof SECONDARY_ROOF_OPTIONS[number]["id"]
export type FlashingId = typeof FLASHING_OPTIONS[number]["id"]
export type CurbMountedId = typeof CURB_MOUNTED_OPTIONS[number]["id"]
export type RoofStructureId = typeof ROOF_STRUCTURE_OPTIONS[number]["id"]
export type AtticId = typeof ATTIC_OPTIONS[number]["id"]
export type AtticVentId = typeof ATTIC_VENT_OPTIONS[number]["id"]
export type DrainageId = typeof DRAINAGE_OPTIONS[number]["id"]
export type InsulationId = typeof INSULATION_OPTIONS[number]["id"]

//step 4: exterior walls options

export const EXTERIOR_WALL_MATERIAL_OPTIONS = [
  { id: "curtainWall", label: "Curtain Wall" },
  { id: "eifs", label: "EIFS" },
  { id: "stucco", label: "Stucco" },
  { id: "concretePanels", label: "Concrete Panels" },
  { id: "brickStoneVeneer", label: "Brick | Stone Veneer" },
  { id: "cmu", label: "CMU" },
  { id: "tiltUp", label: "Tilt-up" },
  { id: "other", label: "Other" },
] as const

export const SIDING_OPTIONS = [
  { id: "woodPanels", label: "Wood Panels" },
  { id: "vinyl", label: "Vinyl" },
  { id: "cementitious", label: "Cementitious" },
  { id: "composite", label: "Composite" },
  { id: "woodShake", label: "Wood Shake" },
  { id: "aluminum", label: "Aluminum" },
  { id: "transite", label: "Transite" },
  { id: "fiberboard", label: "Fiberboard" },
] as const

export const SOFFIT_OPTIONS = [
  { id: "exposed", label: "Exposed" },
  { id: "concealedWood", label: "Concealed by: Wood" },
  { id: "concealedVinyl", label: "Concealed by: Vinyl" },
  { id: "concealedMetal", label: "Concealed by: Metal" },
  { id: "other", label: "Other" },
] as const

export const SEALANT_OPTIONS = [
  { id: "typicalCaulking", label: "Typical Caulking" },
  { id: "tiltUpWallSealant", label: "Tilt-up Wall Sealant" },
  { id: "curtainWallSealant", label: "Curtain Wall Sealant" },
] as const

// Curtain Wall subsections (separate lists as requested)
export const CURTAIN_WALL_GLAZING_OPTIONS = [
  { id: "tinted", label: "Tinted" },
  { id: "clear", label: "Clear" },
  { id: "singlePane", label: "Single-pane" },
  { id: "doublePane", label: "Double-pane" },
] as const

export const CURTAIN_WALL_SPANDREL_OPTIONS = [
  { id: "metal", label: "Metal" },
  { id: "graniteVeneer", label: "Granite Veneer" },
  { id: "opaqueGlass", label: "Opaque glass" },
] as const

export const CURTAIN_WALL_MULLION_OPTIONS = [
  { id: "aluminum", label: "Aluminum" },
  { id: "bronze", label: "Bronze" },
  { id: "unknown", label: "Unknown" },
] as const

// Type helpers
export type ExteriorWallMaterialId = typeof EXTERIOR_WALL_MATERIAL_OPTIONS[number]["id"]
export type SidingId = typeof SIDING_OPTIONS[number]["id"]
export type SoffitId = typeof SOFFIT_OPTIONS[number]["id"]
export type SealantId = typeof SEALANT_OPTIONS[number]["id"]
export type CurtainWallGlazingId = typeof CURTAIN_WALL_GLAZING_OPTIONS[number]["id"]
export type CurtainWallSpandrelId = typeof CURTAIN_WALL_SPANDREL_OPTIONS[number]["id"]
export type CurtainWallMullionId = typeof CURTAIN_WALL_MULLION_OPTIONS[number]["id"]

//step 5 parking paving sidewalks options

export const PAVEMENT_OPTIONS = [
  { id: "gravel", label: "Gravel" },
  { id: "brickPaver", label: "Brick Paver" },
  { id: "asphalt", label: "Asphalt" },
  { id: "concrete", label: "Concrete" },
  { id: "asphaltSealCoatStriping", label: "Asphalt Seal Coat/striping" },
  { id: "concreteStriping", label: "Concrete striping" },
] as const

export const ENTRANCE_APRON_OPTIONS = [

  { id: "asphalt", label: "Asphalt" },
  { id: "concrete", label: "Concrete" },
  { id: "brickPaver", label: "Brick Paver" },
  { id: "gravel", label: "Gravel" },
] as const

export const CURBING_OPTIONS = [
  { id: "asphalt", label: "Asphalt" },
  { id: "concrete", label: "Concrete" },
  { id: "stone", label: "Stone" },
] as const

export const SIDEWALK_WALKWAY_OPTIONS = [
  { id: "asphalt", label: "Asphalt" },
  { id: "concrete", label: "Concrete" },
  { id: "brickPaver", label: "Brick Paver" },
  { id: "stonePaver", label: "Stone Paver" },
  { id: "concPaver", label: "Conc. Paver" },
] as const

export const SIDEWALK_RAILING_OPTIONS = [
  { id: "metal", label: "Metal" },
  { id: "wood", label: "Wood" },
  { id: "vinyl", label: "Vinyl" },
] as const

export const STEPS_STAIRS_OPTIONS = [
  { id: "concrete", label: "Concrete" },
  { id: "wood", label: "Wood" },
  { id: "metal", label: "Metal" },
  { id: "steel", label: "Steel" },
] as const

export const STEPS_STAIRS_RAILING_OPTIONS = [
  { id: "metal", label: "Metal" },
  { id: "wood", label: "Wood" },
  { id: "vinyl", label: "Vinyl" },
] as const

// Type helpers
export type PavementId = typeof PAVEMENT_OPTIONS[number]["id"]
export type EntranceApronId = typeof ENTRANCE_APRON_OPTIONS[number]["id"]
export type CurbingId = typeof CURBING_OPTIONS[number]["id"]
export type SidewalkWalkwayId = typeof SIDEWALK_WALKWAY_OPTIONS[number]["id"]
export type SidewalkRailingId = typeof SIDEWALK_RAILING_OPTIONS[number]["id"]
export type StepsStairsId = typeof STEPS_STAIRS_OPTIONS[number]["id"]
export type StepsStairsRailingId = typeof STEPS_STAIRS_RAILING_OPTIONS[number]["id"]

//step 6: parking garage structure options

export const PARKING_GARAGE_STRUCTURE_OPTIONS = [
  { id: "concreteCastInPlace", label: "Concrete (cast in-place)" },
  { id: "concretePreCast", label: "Concrete (Pre-cast)" },
  { id: "steel", label: "Steel" },
  { id: "other", label: "Other" },
] as const

export const PARKING_GARAGE_DECKING_OPTIONS = [
  { id: "concreteCastInPlace", label: "Concrete (cast in-place)" },
  { id: "concretePreCast", label: "Concrete (Pre-cast)" },
  { id: "steelToppedWithConcrete", label: "Steel topped with Concrete" },
  { id: "other", label: "Other" },
] as const

export const PARKING_GARAGE_PERIMETER_WALL_OPTIONS = [
  { id: "concreteCMU", label: "Concrete (CMU)" },
  { id: "concreteCastInPlace", label: "Concrete (cast in-place)" },
  { id: "other", label: "Other" },
] as const

export const PARKING_GARAGE_TRAFFIC_COATING_OPTIONS = [
  { id: "topDeckOnly", label: "Top deck only" },
  { id: "topDeckAndEntrance", label: "Top deck and entrance" },
  { id: "allLevels", label: "All levels" },
] as const

// Type helpers
export type ParkingGarageStructureId = typeof PARKING_GARAGE_STRUCTURE_OPTIONS[number]["id"]
export type ParkingGarageDeckingId = typeof PARKING_GARAGE_DECKING_OPTIONS[number]["id"]
export type ParkingGaragePerimeterWallId = typeof PARKING_GARAGE_PERIMETER_WALL_OPTIONS[number]["id"]
export type ParkingGarageTrafficCoatingId = typeof PARKING_GARAGE_TRAFFIC_COATING_OPTIONS[number]["id"]

//step 7 building stairs, balconies & patios options

export const STAIRS_EXTERIOR_OPTIONS = [
  { id: "concreteCastInPlace", label: "Concrete (cast in-place)" },
  { id: "wood", label: "Wood" },
  { id: "steel", label: "Steel" },
  { id: "preCastConcreteTreads", label: "Pre-cast concrete treads" },
  { id: "metalPansWithConcreteFill", label: "Metal pans w/ concrete fill" },
] as const

export const STAIRS_INTERIOR_OPTIONS = [
  { id: "concreteCastInPlace", label: "Concrete (cast in-place)" },
  { id: "wood", label: "Wood" },
  { id: "steel", label: "Steel" },
  { id: "preCastConcreteTreads", label: "Pre-cast concrete treads" },
  { id: "metalPansWithConcreteFill", label: "Metal pans w/ concrete fill" },
] as const

export const BALCONY_OPTIONS = [
  { id: "concreteCastInPlace", label: "Concrete (cast in-place)" },
  { id: "concretePreCast", label: "Concrete (pre-cast)" },
  { id: "steel", label: "Steel" },
  { id: "wood", label: "Wood" },
] as const

export const PATIO_PLAZA_OPTIONS = [
  { id: "concretePavers", label: "Concrete (pavers)" },
  { id: "concreteCastInPlace", label: "Concrete (cast in-place)" },
  { id: "brickPavers", label: "Brick pavers" },
  { id: "wood", label: "Wood" },
] as const

// Railings (identical for all 4 sections: stairs exterior, stairs interior, balconies, patios)
export const BUILDING_STAIRS_BALCONIES_RAILING_OPTIONS = [
  { id: "steel", label: "Steel" },
  { id: "wood", label: "Wood" },
] as const

// Balcony baluster spacing options (separate list as requested)
export const BALCONY_BALUSTER_SPACING_OPTIONS = [
  { id: "cantilever", label: "Cantilever" },
  { id: "integral", label: "Integral" },
  { id: "exit", label: "Exit" },
  { id: "coating", label: "Coating" },
] as const

// Type helpers
export type StairsExteriorId = typeof STAIRS_EXTERIOR_OPTIONS[number]["id"]
export type StairsInteriorId = typeof STAIRS_INTERIOR_OPTIONS[number]["id"]
export type BalconyId = typeof BALCONY_OPTIONS[number]["id"]
export type PatioPlazaId = typeof PATIO_PLAZA_OPTIONS[number]["id"]
export type BuildingStairsBalconiesRailingId = typeof BUILDING_STAIRS_BALCONIES_RAILING_OPTIONS[number]["id"]
export type BalconyBalusterSpacingId = typeof BALCONY_BALUSTER_SPACING_OPTIONS[number]["id"]

// step 8 windows options

export const WINDOW_TYPE_OPTIONS = [
  { id: "storefrontSystem", label: "Storefront System" },
  { id: "sliding", label: "Sliding" },
  { id: "casement", label: "Casement" },
  { id: "hopper", label: "Hopper" },
  { id: "singleHung", label: "Single Hung" },
  { id: "storm", label: "Storm" },
  { id: "fixed", label: "Fixed" },
  { id: "doubleHung", label: "Double Hung" },
  { id: "operable", label: "Operable" },
  { id: "awning", label: "Awning" },
  { id: "ironBars", label: "Iron Bars" },
  { id: "exteriorScreens", label: "Exterior Screens" },
] as const

export const WINDOW_GLAZING_TYPE_OPTIONS = [
  { id: "tinted", label: "Tinted" },
  { id: "opaque", label: "Opaque" },
] as const

export const WINDOW_PANE_OPTIONS = [
  { id: "singlePane", label: "Single-pane" },
  { id: "doublePane", label: "Double-pane" },
] as const

export const WINDOW_FRAME_OPTIONS = [
  { id: "metal", label: "Metal" },
  { id: "vinyl", label: "Vinyl" },
] as const

// Type helpers
export type WindowTypeId = typeof WINDOW_TYPE_OPTIONS[number]["id"]
export type WindowGlazingTypeId = typeof WINDOW_GLAZING_TYPE_OPTIONS[number]["id"]
export type WindowPaneId = typeof WINDOW_PANE_OPTIONS[number]["id"]
export type WindowFrameId = typeof WINDOW_FRAME_OPTIONS[number]["id"]

//step 9 Doors options

// Doors & Service Doors - Type subcategory
export const DOOR_TYPE_OPTIONS = [
  { id: "wood", label: "Wood" },
  { id: "metal", label: "Metal" },
  { id: "painted", label: "Painted" },
  { id: "stained", label: "Stained" },
  { id: "other", label: "Other" },
] as const



// Doors & Service Doors - Hardware subcategory
export const DOOR_HARDWARE_HANDLE_OPTIONS = [
  { id: "lever", label: "Lever" },
  { id: "knob", label: "Knob" },
] as const

export const DOOR_HARDWARE_OPERATION_OPTIONS = [
  { id: "pushPull", label: "Push/Pull" },
  { id: "panic", label: "Panic" },
] as const

// Doors & Service Doors - Frame subcategory
export const DOOR_FRAME_OPTIONS = [
  { id: "wood", label: "Wood" },
  { id: "metal", label: "Metal" },
] as const

// Hardware Type (separate section)
export const DOOR_HARDWARE_TYPE_OPTIONS = [
  { id: "commercialGrade", label: "Commercial Grade" },
  { id: "residentialGrade", label: "Residential Grade" },
] as const

// Balconies/Patios doors
export const BALCONY_PATIO_DOOR_TYPE_OPTIONS = [
  { id: "alSlidingDoors", label: "AL sliding doors" },
  { id: "french", label: "French" },
] as const

export const BALCONY_PATIO_DOOR_GLAZING_OPTIONS = [
  { id: "single", label: "Single" },
  { id: "doublePane", label: "Double Pane" },
] as const

// Overhead Doors
export const OVERHEAD_DOOR_MATERIAL_OPTIONS = [
  { id: "wood", label: "Wood" },
  { id: "metal", label: "Metal" },
] as const

export const OVERHEAD_DOOR_STYLE_OPTIONS = [
  { id: "swing", label: "Swing" },
  { id: "flush", label: "Flush" },
  { id: "rollUp", label: "Roll-up" },
] as const

export const OVERHEAD_DOOR_OPERATION_OPTIONS = [
  { id: "automaticOpeners", label: "Automatic Openers" },
  { id: "manual", label: "Manual" },
] as const

// Dock Equipment
export const DOCK_EQUIPMENT_OPTIONS = [
  { id: "bumpers", label: "Bumpers" },
  { id: "weatherSeals", label: "Weather Seals" },
  { id: "covers", label: "Covers" },
  { id: "levelersHydraulic", label: "Levelers (Hydraulic)" },
  { id: "levelersMechanical", label: "Levelers (Mechanical)" },
] as const

// Type helpers
export type DoorTypeId = typeof DOOR_TYPE_OPTIONS[number]["id"]
export type DoorHardwareHandleId = typeof DOOR_HARDWARE_HANDLE_OPTIONS[number]["id"]
export type DoorHardwareOperationId = typeof DOOR_HARDWARE_OPERATION_OPTIONS[number]["id"]
export type DoorFrameId = typeof DOOR_FRAME_OPTIONS[number]["id"]
export type DoorHardwareTypeId = typeof DOOR_HARDWARE_TYPE_OPTIONS[number]["id"]
export type BalconyPatioDoorTypeId = typeof BALCONY_PATIO_DOOR_TYPE_OPTIONS[number]["id"]
export type BalconyPatioDoorGlazingId = typeof BALCONY_PATIO_DOOR_GLAZING_OPTIONS[number]["id"]
export type OverheadDoorMaterialId = typeof OVERHEAD_DOOR_MATERIAL_OPTIONS[number]["id"]
export type OverheadDoorStyleId = typeof OVERHEAD_DOOR_STYLE_OPTIONS[number]["id"]
export type OverheadDoorOperationId = typeof OVERHEAD_DOOR_OPERATION_OPTIONS[number]["id"]
export type DockEquipmentId = typeof DOCK_EQUIPMENT_OPTIONS[number]["id"]
