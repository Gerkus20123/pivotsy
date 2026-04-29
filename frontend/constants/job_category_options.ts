import { CiBank, CiDeliveryTruck, CiLocationArrow1, CiShop  } from "react-icons/ci";
import { FaHotel, FaEnvira, FaLaptopCode, FaCar, FaShippingFast, FaHandHoldingHeart, FaSuitcaseRolling, FaCashRegister } from "react-icons/fa";
import { GiOfficeChair, GiMicroscope, GiAerosol, GiTeePipe, GiPartyPopper, GiGardeningShears, GiVacuumCleaner, GiHealthNormal } from "react-icons/gi";
import { MdArchitecture, MdLocalHotel, MdCarpenter, MdOutlineRoofing, MdOutlineShoppingCart, MdEngineering, MdForklift } from "react-icons/md";
import { IoSchoolSharp } from "react-icons/io5";
import { SlEarphonesAlt, SlEnergy } from "react-icons/sl";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaBuildingUser } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import { ImManWoman } from "react-icons/im";
import { IoMdBug } from "react-icons/io";
import { TbDeviceAnalytics } from "react-icons/tb";
import { GiTechnoHeart } from "react-icons/gi";
import { MdAdminPanelSettings, MdRealEstateAgent } from "react-icons/md";
import { BsDatabaseGear, BsThreeDotsVertical } from "react-icons/bs";
import { PiNetworkLight, PiProjectorScreen, PiSecurityCamera, PiNuclearPlant, PiMedalMilitaryFill } from "react-icons/pi";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { GiMechanicGarage } from "react-icons/gi";
import { SiCardmarket } from "react-icons/si";
import { GoLaw } from "react-icons/go";
import { RiShieldUserFill } from "react-icons/ri";

export const JobCategoryOptions = [
    {"id": "admin_buiro", "name": "Administration/Biuro", "icon": CiLocationArrow1, "subcategory": [
        {"id": "secretary_reception", "name": "Secretary/reception", "icon": FaHotel},
        {"id": "admin_buiro_work", "name": "Administration And Biuro Work", "icon": GiOfficeChair}
    ]},
    {"id": "research_development", "name": "Research/Development", "icon": GiMicroscope},
    {"id": "banking", "name": "Banking", "icon": CiBank},
    {"id": "bhp_env", "name": "BHP/Environmental Engineering", "icon": FaEnvira},
    {"id": "rep_cons", "name": "Repairing/Construction", "icon": CiLocationArrow1, "subcategory": [
        {"id": "architect", "name": "Architect", "icon": MdArchitecture},
        {"id": "carpenter", "name": "Carpenter", "icon": MdCarpenter},
        {"id": "roofer", "name": "Roofer", "icon": MdOutlineRoofing},
        {"id": "glazer", "name": "Glazer", "icon": GiAerosol},
        {"id": "hydraulics", "name": "Hydraulic Worker", "icon": GiTeePipe},
    ]},
    {"id": "delivery", "name": "Delivery", "icon": CiDeliveryTruck},
    {"id": "e_commerce", "name": "E-commerce", "icon": MdOutlineShoppingCart},
    {"id": "edu", "name": "Education", "icon": IoSchoolSharp},
    {"id": "energetics", "name": "Energetics", "icon": SlEnergy},
    {"id": "fin_acc", "name": "Finances And Accounting", "icon": FaMoneyBillTrendUp},
    {"id": "franchise_entep", "name": "Franchise/Own firm", "icon": FaBuildingUser},
    {"id": "gastronomy", "name": "Gastronomy", "icon": IoFastFood},
    {"id": "hr", "name": "HR", "icon": ImManWoman},
    {"id": "hotel", "name": "Hotel industry", "icon": MdLocalHotel},
    {"id": "it", "name": "IT/Telecommunication", "icon": CiLocationArrow1, "subcategory": [
        {"id": "programmer", "name": "Programmer", "icon": FaLaptopCode},
        {"id": "tester", "name": "Tester", "icon": IoMdBug},
        {"id": "analytics", "name": "Analytics", "icon": TbDeviceAnalytics},
        {"id": "tech_support", "name": "Technical Support", "icon": GiTechnoHeart},
        {"id": "admin_syst", "name": "System Admin", "icon": MdAdminPanelSettings},
        {"id": "admin_db", "name": "Database Admin", "icon": BsDatabaseGear},
        {"id": "admin_network", "name": "Network Admin", "icon": PiNetworkLight},
        {"id": "project_manager", "name": "Project Manager", "icon": PiProjectorScreen},
    ]},
    {"id": "engineering", "name": "Engineering", "icon": MdEngineering},
    {"id": "driver", "name": "Driver", "icon": FaCar},
    {"id": "logistics", "name": "Logistics/Shipping", "icon": FaShippingFast},
    {"id": "marketing", "name": "Marketing/PR", "icon": SiCardmarket},
    {"id": "mech_varnish", "name": "Mechanics/Varnishing", "icon": GiMechanicGarage},
    {"id": "assembly_service", "name": "Assembly and service", "icon": HiMiniWrenchScrewdriver},
    {"id": "real_estate", "name": "Real estate", "icon": MdRealEstateAgent},
    {"id": "call_center", "name": "Call Center", "icon": SlEarphonesAlt},
    {"id": "security", "name": "Security", "icon": PiSecurityCamera},
    {"id": "caring", "name": "Caring", "icon": FaHandHoldingHeart},
    {"id": "party_maker", "name": "Party maker", "icon": GiPartyPopper},
    {"id": "foreign_work", "name": "Foreign work", "icon": FaSuitcaseRolling},
    {"id": "warehouse", "name": "Warehouse", "icon": MdForklift},
    {"id": "store_emp", "name": "Store employee", "icon": FaCashRegister},
    {"id": "law", "name": "Law", "icon": GoLaw},
    {"id": "production", "name": "Production", "icon": PiNuclearPlant},
    {"id": "gardening", "name": "Gardening", "icon": GiGardeningShears},
    {"id": "uniformed_services", "name": "Uniformed services", "icon": PiMedalMilitaryFill},
    {"id": "cleaning", "name": "Cleaning services", "icon": GiVacuumCleaner},
    {"id": "insurances", "name": "Insurances", "icon": RiShieldUserFill},
    {"id": "display_goods", "name": "Display/Arrangement Of Goods", "icon": CiShop},
    {"id": "health", "name": "Health", "icon": GiHealthNormal},
    {"id": "other", "name": "Other", "icon": BsThreeDotsVertical},
];