import { 
  Droplets, 
  Flame, 
  Heart, 
  Car, 
  Building2, 
  Mountain,
  Snowflake,
  Wind,
  TriangleAlert,
  type LucideIcon
} from 'lucide-react';

export interface HazardType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const HAZARD_TYPES: HazardType[] = [
  {
    id: 'flood',
    name: 'Flood',
    description: 'Rising water levels, flash floods',
    icon: Droplets,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
  },
  {
    id: 'fire',
    name: 'Fire',
    description: 'Building fires, wildfires',
    icon: Flame,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
  },
  {
    id: 'medical',
    name: 'Medical',
    description: 'Health emergencies, injuries',
    icon: Heart,
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
  },
  {
    id: 'road-accident',
    name: 'Road Accident',
    description: 'Vehicle collisions, traffic incidents',
    icon: Car,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'collapse',
    name: 'Building Collapse',
    description: 'Structural failures, debris',
    icon: Building2,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
  },
  {
    id: 'earthquake',
    name: 'Earthquake',
    description: 'Seismic activity, aftershocks',
    icon: Mountain,
    color: '#78716c',
    bgColor: 'rgba(120, 113, 108, 0.15)',
  },
  {
    id: 'extreme-cold',
    name: 'Extreme Cold',
    description: 'Freezing temperatures, hypothermia risk',
    icon: Snowflake,
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
  },
  {
    id: 'blizzard',
    name: 'Blizzard',
    description: 'Heavy snowfall, low visibility',
    icon: Wind,
    color: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.15)',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    description: 'Snow slides, mountain hazards',
    icon: TriangleAlert,
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
  },
];

export function getHazardById(id: string): HazardType | undefined {
  return HAZARD_TYPES.find(h => h.id === id);
}

const BACKEND_HAZARD_MAP: Record<string, string> = {
  'FLOOD': 'flood',
  'FIRE': 'fire',
  'MEDICAL_EMERGENCY': 'medical',
  'ROAD_ACCIDENT': 'road-accident',
  'BUILDING_COLLAPSE': 'collapse',
  'EARTHQUAKE': 'earthquake',
  'EXTREME_WEATHER': 'extreme-cold',
  'NATURAL_DISASTER': 'avalanche',
  'GAS_LEAK': 'gas-leak',
  'POWER_OUTAGE': 'power-outage',
  'VIOLENCE': 'violence',
  'TERRORISM': 'terrorism',
};

export function getHazardByBackendType(backendType: string): HazardType | undefined {
  const id = BACKEND_HAZARD_MAP[backendType];
  return id ? getHazardById(id) : undefined;
}

// Survival guide content (mock data)
export interface SurvivalGuideContent {
  hazardType: string;
  doNow: string[];
  doNot: string[];
  emergencyScript: string;
}

export const SURVIVAL_GUIDES: Record<string, SurvivalGuideContent> = {
  flood: {
    hazardType: 'flood',
    doNow: [
      'Move immediately to higher ground',
      'Avoid walking through moving water - 6 inches can knock you down',
      'If driving, turn around if you encounter flooded roads',
      'Disconnect electrical appliances if safe to do so',
      'Move important documents and valuables to upper floors',
      'Fill bathtubs and containers with clean water for drinking',
    ],
    doNot: [
      'Never drive through flooded roads',
      'Do not touch electrical equipment if wet',
      'Avoid walking near riverbanks or streams',
      'Do not return home until authorities say it is safe',
      'Never ignore evacuation orders',
    ],
    emergencyScript: 'I am reporting a flood emergency. My location is [ADDRESS]. The water level is approximately [HEIGHT] and [rising/stable/falling]. There are [NUMBER] people here who need assistance. We [are/are not] in immediate danger.',
  },
  fire: {
    hazardType: 'fire',
    doNow: [
      'Alert everyone and leave the building immediately',
      'Feel doors before opening - if hot, use another exit',
      'Stay low to avoid smoke inhalation',
      'Close doors behind you to slow fire spread',
      'Call emergency services once safely outside',
      'Go to your designated meeting point',
    ],
    doNot: [
      'Never use elevators during a fire',
      'Do not stop to collect belongings',
      'Never go back inside a burning building',
      'Avoid opening windows - oxygen feeds fire',
      'Do not hide in closets or under beds',
    ],
    emergencyScript: 'I am reporting a fire at [ADDRESS]. The fire is [location in building]. There are [NUMBER] people in the building. People [are/are not] trapped. We [have/have not] evacuated.',
  },
  medical: {
    hazardType: 'medical',
    doNow: [
      'Call emergency services immediately',
      'Keep the patient calm and still',
      'If not breathing, begin CPR if trained',
      'Control any visible bleeding with pressure',
      'Note the time symptoms started',
      'Gather any medications the person takes',
    ],
    doNot: [
      'Do not move the person if spine injury is suspected',
      'Never give food or water to unconscious person',
      'Do not remove impaled objects',
      'Avoid tourniquet unless trained and bleeding is life-threatening',
      'Do not leave the person alone',
    ],
    emergencyScript: 'I need medical assistance at [ADDRESS]. The patient is [AGE] years old, [conscious/unconscious], and [breathing/not breathing]. Symptoms are [DESCRIBE]. This started [TIME] ago.',
  },
  'road-accident': {
    hazardType: 'road-accident',
    doNow: [
      'Ensure your safety first - park away from traffic',
      'Call emergency services immediately',
      'Turn on hazard lights and set up warning triangles',
      'Check on injured persons but do not move them',
      'Turn off ignitions of involved vehicles if safe',
      'Document the scene with photos if possible',
    ],
    doNot: [
      'Do not move injured people unless there is immediate danger',
      'Never leave the scene of an accident',
      'Avoid confrontation with other drivers',
      'Do not admit fault at the scene',
      'Never stand in traffic lanes',
    ],
    emergencyScript: 'I am reporting a road accident at [LOCATION/INTERSECTION]. There are [NUMBER] vehicles involved. Approximately [NUMBER] people appear injured. The road [is/is not] blocked. There [is/is not] fire or fuel leak.',
  },
  collapse: {
    hazardType: 'collapse',
    doNow: [
      'Get out of the building immediately if possible',
      'If trapped, move to a doorway or under sturdy furniture',
      'Cover your nose and mouth to avoid dust inhalation',
      'Tap on pipes or walls to signal rescuers',
      'Use your phone light sparingly to conserve battery',
      'Stay calm and wait for rescue',
    ],
    doNot: [
      'Do not use elevators',
      'Avoid lighting matches or lighters (gas leak risk)',
      'Do not shout unless necessary - conserve energy',
      'Never enter partially collapsed structures',
      'Avoid areas directly above or below collapse zone',
    ],
    emergencyScript: 'I am reporting a building collapse at [ADDRESS]. The building is [TYPE/STORIES]. Approximately [NUMBER] people may be trapped. I [am/am not] inside. I [can/cannot] hear survivors.',
  },
  earthquake: {
    hazardType: 'earthquake',
    doNow: [
      'DROP to hands and knees',
      'Take COVER under sturdy furniture or against inside wall',
      'HOLD ON until shaking stops',
      'If outside, move to open area away from buildings',
      'If driving, pull over and stay in vehicle',
      'After shaking, check for injuries and hazards',
    ],
    doNot: [
      'Do not run outside during shaking',
      'Never stand in doorways (not safer than elsewhere)',
      'Avoid areas near windows, mirrors, or heavy objects',
      'Do not use elevators after an earthquake',
      'Never ignore aftershock warnings',
    ],
    emergencyScript: 'I am reporting earthquake damage at [ADDRESS]. There are [NUMBER] people here. We [have/do not have] injuries. Building damage includes [DESCRIBE]. We [need/do not need] immediate rescue.',
  },
  'extreme-cold': {
    hazardType: 'extreme-cold',
    doNow: [
      'Get to a warm shelter immediately',
      'Remove wet clothing and put on dry layers',
      'Warm the body gradually - use blankets, not direct heat',
      'Drink warm (not hot) beverages',
      'Keep moving to generate body heat if possible',
      'Check on vulnerable neighbors',
    ],
    doNot: [
      'Do not rub frostbitten skin',
      'Never use alcohol to warm up (it lowers body temperature)',
      'Avoid overexertion in cold - sweating causes heat loss',
      'Do not ignore shivering - it is an early warning',
      'Never leave heating sources unattended',
    ],
    emergencyScript: 'I need cold weather assistance at [ADDRESS]. The person is showing signs of [hypothermia/frostbite]. Symptoms include [DESCRIBE]. They have been exposed for approximately [TIME]. Indoor temperature is [TEMP].',
  },
  blizzard: {
    hazardType: 'blizzard',
    doNow: [
      'Stay indoors and avoid travel',
      'Keep emergency supplies accessible',
      'Conserve heating fuel by closing off unused rooms',
      'Keep a window slightly open for ventilation if using fuel heaters',
      'Check pipes to prevent freezing',
      'Keep phone charged for emergencies',
    ],
    doNot: [
      'Do not venture outside unless absolutely necessary',
      'Never use generators or grills indoors',
      'Avoid overexertion when shoveling snow',
      'Do not ignore carbon monoxide detector warnings',
      'Never let heating fuel run completely out',
    ],
    emergencyScript: 'I am stranded due to blizzard at [ADDRESS]. There are [NUMBER] people here including [children/elderly/medical needs]. We [have/do not have] heat. Our supplies will last approximately [TIME]. We [need/do not need] immediate rescue.',
  },
  avalanche: {
    hazardType: 'avalanche',
    doNow: [
      'If caught, try to move to the side of the slide',
      'Grab onto trees or rocks if possible',
      'Create an air pocket around your face as snow settles',
      'Try to stay near the surface by swimming motion',
      'Once stopped, try to dig upward toward sky',
      'Conserve energy and air if buried',
    ],
    doNot: [
      'Do not panic - stay as calm as possible',
      'Never travel alone in avalanche terrain',
      'Avoid crossing avalanche paths one at a time',
      'Do not assume the danger has passed after one slide',
      'Never enter closed terrain or ignore warnings',
    ],
    emergencyScript: 'I am reporting an avalanche at [LOCATION]. Approximately [NUMBER] people may be buried. Last seen location was [DESCRIBE]. Time of avalanche was [TIME]. We [have/do not have] rescue equipment on site.',
  },
};

export function getSurvivalGuide(hazardType: string): SurvivalGuideContent | undefined {
  if (Object.prototype.hasOwnProperty.call(SURVIVAL_GUIDES, hazardType)) {
    return SURVIVAL_GUIDES[hazardType];
  }
  return undefined;
}
