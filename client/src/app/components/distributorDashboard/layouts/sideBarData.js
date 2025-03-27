// icons
import { RxDashboard } from "react-icons/rx";

import { IoMdAdd } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { PiShippingContainer } from "react-icons/pi";
import { RiClipboardLine } from "react-icons/ri";



const sideBarData = [
    {
        id: 1,
        title: 'MAIN',
        name: 'Dashboard',
        activeName: undefined,
        icon: <RxDashboard />,
        href: '/distributorDashboard'
    },
    {
      id: 2,
      title: "DELIVERY",
      name: "Product Orders",
      activeName: "productOrders",
      icon: <PiShippingContainer />,
      href: '/distributorDashboard/productOrders'
    },
    ,
    {
      id: 3,
      title: undefined,
      name: "Client Orders",
      activeName: "clientOrders",
      icon: <RiClipboardLine />,
      href: '/distributorDashboard/clientOrders'
    },
    {
      id: 4,
      title: undefined,
      name: "Add Client Order",
      activeName: "addClientOrder",
      icon: <IoMdAdd />,
      href: '/distributorDashboard/addClientOrder'
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