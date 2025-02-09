// icons
import { RxDashboard } from "react-icons/rx";
import { PiTruckDuotone } from "react-icons/pi";
import { LiaTruckLoadingSolid } from "react-icons/lia";
import { IoConstructOutline } from "react-icons/io5";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { SiStagetimer } from "react-icons/si";
import { TbPrismPlus } from "react-icons/tb";
import { PiRoadHorizonBold } from "react-icons/pi";

import { IoMdAdd } from "react-icons/io";
import { CgPlayListAdd } from "react-icons/cg";
import { BiCartAdd } from "react-icons/bi";



const sideBarData = [
    {
        id: 1,
        title: 'MAIN',
        name: 'Dashboard',
        activeName: undefined,
        icon: <RxDashboard />,
        href: '/adminDashboard'
    },
    {
      id: 2,
      title: "SUPPLY",
      name: 'Suppliers',
      activeName: "suppliers",
      icon: <PiTruckDuotone />,
      href: '/adminDashboard/suppliers'
    },
    ,
    {
      id: 3,
      title: undefined,
      name: 'Add Suppliers',
      activeName: "addSupplier",
      icon: <IoMdAdd />,
      href: '/adminDashboard/addSupplier'
    },
    {
      id: 3,
      title: undefined,
      name: "Raw materiel",
      activeName: "rawMaterial",
      icon: <LiaTruckLoadingSolid />,
      href: '/adminDashboard/rawMaterial'
    },
    ,
    {
      id: 4,
      title: undefined,
      name: "Add Raw materiel",
      activeName: "addRawMaterial",
      icon: <CgPlayListAdd />,
      href: '/adminDashboard/addRawMaterial'
    },
    {
      id: 5,
      title: "MANUFACT",
      name: "Manufactories",
      activeName: "manufactories",
      icon: <IoConstructOutline />,
      href: '/adminDashboard/manufactories'
    },
    ,
    {
      id: 6,
      title: undefined,
      name: "Add Manufacturer",
      activeName: "addManufacturer",
      icon: <IoMdAdd />,
      href: '/adminDashboard/addManufacturer'
    },
    {
      id: 7,
      title: "DELIVERY",
      name: "Distributors",
      activeName: "distributors",
      icon: <MdOutlineDeliveryDining />,
      href: '/adminDashboard/distributors'
    },
    ,
    {
      id: 8,
      title: undefined,
      name: "Add Distributor",
      activeName: "addDistributor",
      icon: <IoMdAdd />,
      href: '/adminDashboard/addDistributor'
    },
    {
      id: 9,
      title: "ORDERS",
      name: "Product orders",
      activeName: "productOrders",
      icon: <TbPrismPlus />,
      href: '/adminDashboard/productOrders'
    },
    ,
    {
      id: 10,
      title: undefined,
      name: "Add order",
      activeName: "addOrder",
      icon: <BiCartAdd />,
      href: '/adminDashboard/addOrder'
    },
    {
      id: 7,
      title: "TRACABLITY",
      name: "All Products Stages",
      activeName: "productsStages",
      icon: <SiStagetimer />,
      href: '/adminDashboard/productsStages'
    },
    {
      id: 8,
      title: undefined,
      name: "Track Product",
      activeName: "trackProduct",
      icon: <PiRoadHorizonBold />,
      href: '/adminDashboard/trackProduct'
    },
    
]

export default sideBarData