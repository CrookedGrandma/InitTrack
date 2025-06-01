import {
    GiAcid,
    GiChewedSkull,
    GiFire,
    GiFlatHammer,
    GiHealthIncrease,
    GiHealthNormal,
    GiHolyHandGrenade,
    GiKnifeThrust,
    GiPoisonBottle,
    GiPowerLightning,
    GiPsychicWaves,
    GiRollingEnergy,
    GiSnowflake1,
    GiSpinningSword,
    GiWindyStripes,
} from "react-icons/gi";

export const damageTypes: NameIcon[] = [
    { name: "Bludgeoning", icon: <GiFlatHammer /> },
    { name: "Piercing", icon: <GiKnifeThrust /> },
    { name: "Slashing", icon: <GiSpinningSword /> },
    { name: "Acid", icon: <GiAcid /> },
    { name: "Cold", icon: <GiSnowflake1 /> },
    { name: "Fire", icon: <GiFire /> },
    { name: "Force", icon: <GiWindyStripes /> },
    { name: "Lightning", icon: <GiPowerLightning /> },
    { name: "Necrotic", icon: <GiChewedSkull /> },
    { name: "Poison", icon: <GiPoisonBottle /> },
    { name: "Psychic", icon: <GiPsychicWaves /> },
    { name: "Radiant", icon: <GiHolyHandGrenade /> },
    { name: "Thunder", icon: <GiRollingEnergy /> },
];

export const healTypes: HealType[] = [
    { type: "normal", name: "Permanent", icon: <GiHealthNormal /> },
    { type: "temp", name: "Temporary", icon: <GiHealthIncrease /> },
];
