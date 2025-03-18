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
import { CiUser } from "react-icons/ci";




const sideBarData = [
    {
        id: 1,
        title: 'MAIN',
        name: 'Dashboard',
        activeName: undefined,
        icon: <RxDashboard />,
        href: '/supplierDashboard'
    },
    {
      id: 2,
      title: "SUPPLY",
      name: 'Material Orders',
      activeName: "materialOrders",
      icon: <TbPrismPlus />,
      href: '/supplierDashboard/materialOrders'
    },
    ,
    {
      id: 3,
      title: undefined,
      name: 'Add Material',
      activeName: "addMaterial",
      icon: <IoMdAdd />,
      href: '/supplierDashboard/addMaterial'
    },
    {
      id: 4,
      title: undefined,
      name: "Raw materiels",
      activeName: "rawMaterials",
      icon: <LiaTruckLoadingSolid />,
      href: '/supplierDashboard/rawMaterials'
    },
    {
      id: 5,
      title: "ACCOUNT DETAILS",
      name: "Account",
      activeName: "account",
      icon: <CiUser />,
      href: '/supplierDashboard/account'
    },

    
]

export default sideBarData