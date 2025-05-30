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
import { FaUsers } from "react-icons/fa";

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
      name: "Raw materiels",
      activeName: "rawMaterials",
      icon: <LiaTruckLoadingSolid />,
      href: '/adminDashboard/rawMaterials'
    },
    ,
    // {
    //   id: 4,
    //   title: undefined,
    //   name: "Add Raw materiel",
    //   activeName: "addRawMaterial",
    //   icon: <CgPlayListAdd />,
    //   href: '/adminDashboard/addRawMaterial'
    // },
    {
      id: 4,
      title: "MANUFACT",
      name: "Manufactories",
      activeName: "manufactories",
      icon: <IoConstructOutline />,
      href: '/adminDashboard/manufactories'
    },
    ,
    {
      id: 5,
      title: undefined,
      name: "Add Manufacturer",
      activeName: "addManufacturer",
      icon: <IoMdAdd />,
      href: '/adminDashboard/addManufacturer'
    },
    {
      id: 6,
      title: "DELIVERY",
      name: "Distributors",
      activeName: "distributors",
      icon: <MdOutlineDeliveryDining />,
      href: '/adminDashboard/distributors'
    },
    ,
    {
      id: 7,
      title: undefined,
      name: "Add Distributor",
      activeName: "addDistributor",
      icon: <IoMdAdd />,
      href: '/adminDashboard/addDistributor'
    },
    {
      id: 8,
      title: "ORDERS",
      name: "Material Orders",
      activeName: "materialOrders",
      icon: <LiaTruckLoadingSolid />,
      href: '/adminDashboard/materialOrders'
    },
    {
      id: 9,
      title: undefined,
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
      id: 11,
      title: undefined,
      name: "Client Orders",
      activeName: "clientOrders",
      icon: <FaUsers />,
      href: '/adminDashboard/clientOrders'
    },
    {
      id: 12,
      title: "TRACABLITY",
      name: "Track Product",
      activeName: "trackProduct",
      icon: <PiRoadHorizonBold />,
      href: '/adminDashboard/trackProduct'
    },
    
]

export default sideBarData