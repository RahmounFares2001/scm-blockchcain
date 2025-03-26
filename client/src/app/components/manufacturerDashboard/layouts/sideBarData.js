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
        href: '/manufacturerDashboard'
    },
    {
      id: 2,
      title: "MANUFACT",
      name: 'Material Orders',
      activeName: "materialOrders",
      icon: <LiaTruckLoadingSolid />,
      href: '/manufacturerDashboard/materialOrders'
    },
    ,
    {
      id: 3,
      title: undefined,
      name: 'Product Orders',
      activeName: "productOrders",
      icon: <TbPrismPlus />,
      href: '/manufacturerDashboard/productOrders'
    },
    {
      id: 5,
      title: "ACCOUNT DETAILS",
      name: "Account",
      activeName: "account",
      icon: <CiUser />,
      href: '/manufacturerDashboard/account'
    },
    
]

export default sideBarData