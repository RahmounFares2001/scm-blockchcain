// icons
import { RxDashboard } from "react-icons/rx";
import { PiTruckDuotone } from "react-icons/pi";
import { LiaTruckLoadingSolid } from "react-icons/lia";
import { IoConstructOutline } from "react-icons/io5";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { SiStagetimer } from "react-icons/si";
import { TbPrismPlus } from "react-icons/tb";
import { PiRoadHorizonBold } from "react-icons/pi";

import { MdOutlineHomeWork } from "react-icons/md";


const sideBarData = [
    {
        id: 1,
        title: 'MAIN',
        name: 'Dashboard',
        activeName: undefined,
        icon: <RxDashboard />,
        href: '/dashboard'
    },
    {
      id: 2,
      title: "SUPPLY",
      name: 'Suppliers',
      activeName: "suppliers",
      icon: <PiTruckDuotone />,
      href: '/dashboard/suppliers'
    },
    {
      id: 3,
      title: undefined,
      name: "Raw materiel",
      activeName: "rawMaterial",
      icon: <LiaTruckLoadingSolid />,
      href: '/dashboard/rawMaterial'
    },
    {
      id: 4,
      title: "MANUFACT",
      name: "Manufactories",
      activeName: "manufactories",
      icon: <IoConstructOutline />,
      href: '/dashboard/manufactories'
    },
    {
      id: 5,
      title: "DELIVERY",
      name: "Distributors",
      activeName: "distributors",
      icon: <MdOutlineDeliveryDining />,
      href: '/dashboard/distributors'
    },
    {
      id: 6,
      title: "ORDERS",
      name: "Product orders",
      activeName: "productOrders",
      icon: <TbPrismPlus />,
      href: '/dashboard/productOrders'
    },
    {
      id: 7,
      title: "TRACABLITY",
      name: "All Products Stages",
      activeName: "productsStages",
      icon: <SiStagetimer />,
      href: '/dashboard/productsStages'
    },
    {
      id: 8,
      title: undefined,
      name: "Track Product",
      activeName: "trackProduct",
      icon: <PiRoadHorizonBold />,
      href: '/dashboard/trackProduct'
    },
    
]

export default sideBarData