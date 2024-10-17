// @ts-nocheck
'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Menu, Coins, Leaf, Search, Bell, User, ChevronDown, LogIn, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { createUser, getUnreadNotifications, markNotificationAsRead, getUserByEmail, getUserBalance } from "@/utils/db/actions"

const clientId = 'BFMbt3kCWsNMX2ulUbMsnJQPGG38ucdDHcx3GJbx5JblDaxEnwvGsI6shv1ykOY54EJvtbFFKN1awsA0VaG3iRQ'

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
});

const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
    privateKeyProvider,
});

interface HeaderProps {
    onMenuClick: () => void
    totalEarnings: number
}

export default function Header({ onMenuClick, totalEarnings }: HeaderProps) {
    const [provider, setProvider] = useState<IProvider | null>(null)
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userInfo, setUserInfo] = useState<any>(null)
    const pathname = usePathname()
    const [notification, setNotification] = useState<Notification[]>([])
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal()
                setProvider(web3auth.provider)

                if (web3auth.connected) {
                    setLoading(true)
                    const user = await web3auth.getUserInfo()
                    setUserInfo(user)

                    if (user.email) {
                        localStorage.setItem('userEmail', user.email)
                        try {
                            await createUser(user.email, user.name || 'Anonymous user')
                        } catch (error) {
                            console.log('Error creating user', error)
                        }
                    }
                }
            } catch (error) {
                console.log('Error intializing web3auth', error)
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    useEffect(() => {
        const fetchNotifications = async () => {
            if (userInfo && userInfo.email) {
                const user = await getUserByEmail(userInfo.email)
                if (user) {
                    const unreadNotifications = await getUnreadNotifications(user.id);
                    setNotifications(unreadNotifications);
                }
            }
        }
        fetchNotifications()

        // Set up periodic checking for new notifications
        const notificationInterval = setInterval(fetchNotifications, 30000); // Check every 30 seconds

        return () => clearInterval(notificationInterval);

    }, [userInfo])

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="mr-2 md:mr-4">
                        <Menu className="h-6 w-6" />
                    </Button>
                    <Link href="/" className="flex items-center">
                        <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
                        <div className="flex flex-col">
                            <span className="font-bold text-base md:text-lg text-gray-800">Waste Management</span>
                            <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">ETHOnline24</span>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 max-w-xl mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="flex items-center">

                    <Button variant="ghost" size="icon" className="mr-2">
                        <Search className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-2 relative">
                                <Bell className="h-5 w-5" />
                                <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">

                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">

                            <DropdownMenuItem
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium"></span>
                                    <span className="text-sm text-gray-500"></span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>No new notifications</DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
                        <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
                        <span className="font-semibold text-sm md:text-base text-gray-800">

                        </span>
                    </div>

                    <Button className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base">
                        Login
                        <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="flex items-center">
                                <User className="h-5 w-5 mr-1" />
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem >

                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/settings">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem >Sign Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}