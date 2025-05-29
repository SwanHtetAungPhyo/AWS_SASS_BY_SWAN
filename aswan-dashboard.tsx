"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Copy,
  Trash2,
  Zap,
  TrendingUp,
  Eye,
  Plus,
  Settings,
  FileText,
  BarChart3,
  Home,
  Wallet,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useState } from "react"

interface ApiKey {
  id: number
  name: string
  key: string
  status: "Active" | "Limited" | "Revoked"
  requests: number
  createdAt: string
}

export default function Component() {
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 1,
      name: "Production Key",
      key: "ABCD-1234-EFGH-5678",
      status: "Active",
      requests: 1250,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Development Key",
      key: "IJKL-9012-MNOP-3456",
      status: "Active",
      requests: 340,
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      name: "Testing Key",
      key: "QRST-7890-UVWX-1234",
      status: "Limited",
      requests: 89,
      createdAt: "2024-01-25",
    },
  ])
  const [newKeyName, setNewKeyName] = useState("")
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const generateRandomKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const segments = []
    for (let i = 0; i < 4; i++) {
      let segment = ""
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      segments.push(segment)
    }
    return segments.join("-")
  }

  const handleGenerateApiKey = async () => {
    if (!newKeyName.trim()) return

    setIsGeneratingKey(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newKey: ApiKey = {
      id: apiKeys.length + 1,
      name: newKeyName,
      key: generateRandomKey(),
      status: "Active",
      requests: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyName("")
    setIsGeneratingKey(false)
  }

  const handleDeleteApiKey = (id: number) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id))
  }

  const handleConnectWallet = async () => {
    try {
      setIsGeneratingKey(true)

      // Check if Phantom is installed
      const { solana } = window as any

      if (!solana || !solana.isPhantom) {
        alert("Phantom wallet is not installed. Please install it from phantom.app")
        setIsGeneratingKey(false)
        return
      }

      // Connect to Phantom
      const response = await solana.connect()
      const publicKey = response.publicKey.toString()

      setWalletAddress(publicKey)
      setIsWalletConnected(true)
      setIsGeneratingKey(false)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setIsGeneratingKey(false)
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      const { solana } = window as any
      if (solana) {
        await solana.disconnect()
      }
      setIsWalletConnected(false)
      setWalletAddress("")
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  const navItems = [
    { name: "Dashboard", icon: Home },
    { name: "API Key Management", icon: Settings },
    { name: "API Documentation", icon: FileText },
    { name: "Usage Analytics", icon: BarChart3 },
    { name: "Settings", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeNav) {
      case "API Documentation":
        return (
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  API Documentation
                </h1>
                <p className="text-gray-400 text-xl">Complete guide to integrate ASwan KYC services</p>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-xl border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white text-3xl font-bold">SDK Integration</CardTitle>
                <p className="text-gray-400 text-lg">Choose your preferred programming language</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="javascript" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-700/50">
                    <TabsTrigger value="javascript" className="text-lg">
                      JavaScript SDK
                    </TabsTrigger>
                    <TabsTrigger value="go" className="text-lg">
                      Go SDK
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="javascript" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-white">Installation</h3>
                      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 rounded-lg p-4 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                        <code className="text-green-400 text-base font-mono">npm install @aswan/kyc-sdk</code>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-white">Usage Example</h3>
                      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-lg p-6 border border-cyan-500/30 shadow-xl shadow-cyan-500/10 overflow-x-auto">
                        <pre className="text-sm">
                          <span className="text-purple-400">const</span> <span className="text-blue-300">axios</span>{" "}
                          <span className="text-white">=</span> <span className="text-green-400">require</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">'axios'</span>
                          <span className="text-yellow-400">)</span>
                          <span className="text-white">;</span>
                          {"\n"}
                          <span className="text-purple-400">const</span> <span className="text-blue-300">crypto</span>{" "}
                          <span className="text-white">=</span> <span className="text-green-400">require</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">'crypto'</span>
                          <span className="text-yellow-400">)</span>
                          <span className="text-white">;</span>
                          {"\n\n"}
                          <span className="text-purple-400">class</span> <span className="text-cyan-300">SKYC</span>{" "}
                          <span className="text-yellow-400">{"{"}</span>
                          {"\n  "}
                          <span className="text-blue-400">constructor</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-red-300">apiKey</span>
                          <span className="text-white">,</span> <span className="text-red-300">secretKey</span>
                          <span className="text-white">,</span> <span className="text-red-300">baseUrl</span>{" "}
                          <span className="text-white">=</span>{" "}
                          <span className="text-orange-300">'https://api.kyc-service.com'</span>
                          <span className="text-yellow-400">)</span> <span className="text-yellow-400">{"{"}</span>
                          {"\n    "}
                          <span className="text-purple-400">this</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">apiKey</span> <span className="text-white">=</span>{" "}
                          <span className="text-red-300">apiKey</span>
                          <span className="text-white">;</span>
                          {"\n    "}
                          <span className="text-purple-400">this</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">secretKey</span> <span className="text-white">=</span>{" "}
                          <span className="text-red-300">secretKey</span>
                          <span className="text-white">;</span>
                          {"\n    "}
                          <span className="text-purple-400">this</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">baseUrl</span> <span className="text-white">=</span>{" "}
                          <span className="text-red-300">baseUrl</span>
                          <span className="text-white">;</span>
                          {"\n  "}
                          <span className="text-yellow-400">{"}"}</span>
                          {"\n\n  "}
                          <span className="text-purple-400">async</span>{" "}
                          <span className="text-green-400">VerifyKYC</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-white">{"{"}</span> <span className="text-red-300">userId</span>
                          <span className="text-white">,</span> <span className="text-red-300">idFile</span>
                          <span className="text-white">,</span> <span className="text-red-300">faceFile</span>{" "}
                          <span className="text-white">{"}"}</span>
                          <span className="text-yellow-400">)</span> <span className="text-yellow-400">{"{"}</span>
                          {"\n    "}
                          <span className="text-purple-400">if</span> <span className="text-yellow-400">(</span>
                          <span className="text-white">!</span>
                          <span className="text-red-300">userId</span> <span className="text-white">||</span>{" "}
                          <span className="text-white">!</span>
                          <span className="text-red-300">idFile</span> <span className="text-white">||</span>{" "}
                          <span className="text-white">!</span>
                          <span className="text-red-300">faceFile</span>
                          <span className="text-yellow-400">)</span> <span className="text-yellow-400">{"{"}</span>
                          {"\n      "}
                          <span className="text-purple-400">throw</span> <span className="text-purple-400">new</span>{" "}
                          <span className="text-cyan-300">Error</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">'Missing userId, idFile, or faceFile'</span>
                          <span className="text-yellow-400">)</span>
                          <span className="text-white">;</span>
                          {"\n    "}
                          <span className="text-yellow-400">{"}"}</span>
                          {"\n\n    "}
                          <span className="text-purple-400">const</span>{" "}
                          <span className="text-blue-300">timestamp</span> <span className="text-white">=</span>{" "}
                          <span className="text-purple-400">new</span> <span className="text-cyan-300">Date</span>
                          <span className="text-yellow-400">()</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">toISOString</span>
                          <span className="text-yellow-400">()</span>
                          <span className="text-white">;</span>
                          {"\n    "}
                          <span className="text-purple-400">const</span>{" "}
                          <span className="text-blue-300">stringToSign</span> <span className="text-white">=</span>{" "}
                          <span className="text-red-300">userId</span> <span className="text-white">+</span>{" "}
                          <span className="text-blue-300">timestamp</span> <span className="text-white">+</span>{" "}
                          <span className="text-purple-400">this</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">apiKey</span>
                          <span className="text-white">;</span>
                          {"\n    "}
                          <span className="text-purple-400">const</span>{" "}
                          <span className="text-blue-300">signature</span> <span className="text-white">=</span>{" "}
                          <span className="text-blue-300">crypto</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">createHmac</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">'sha256'</span>
                          <span className="text-white">,</span> <span className="text-purple-400">this</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">secretKey</span>
                          <span className="text-yellow-400">)</span>
                          {"\n                           "}
                          <span className="text-white">.</span>
                          <span className="text-green-400">update</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-blue-300">stringToSign</span>
                          <span className="text-yellow-400">)</span>
                          {"\n                           "}
                          <span className="text-white">.</span>
                          <span className="text-green-400">digest</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">'hex'</span>
                          <span className="text-yellow-400">)</span>
                          <span className="text-white">;</span>
                          {"\n\n    "}
                          <span className="text-purple-400">try</span> <span className="text-yellow-400">{"{"}</span>
                          {"\n      "}
                          <span className="text-purple-400">const</span> <span className="text-blue-300">response</span>{" "}
                          <span className="text-white">=</span> <span className="text-purple-400">await</span>{" "}
                          <span className="text-blue-300">axios</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">post</span>
                          <span className="text-yellow-400">(</span>
                          {"\n        "}
                          <span className="text-orange-300">{"`${this.baseUrl}/verify`"}</span>
                          <span className="text-white">,</span>
                          {"\n        "}
                          <span className="text-white">{"{"}</span> <span className="text-red-300">user_id</span>
                          <span className="text-white">:</span> <span className="text-red-300">userId</span>{" "}
                          <span className="text-white">{"}"}</span>
                          <span className="text-white">,</span>
                          {"\n        "}
                          <span className="text-white">{"{"}</span>
                          {"\n          "}
                          <span className="text-red-300">headers</span>
                          <span className="text-white">:</span> <span className="text-white">{"{"}</span>
                          {"\n            "}
                          <span className="text-orange-300">'X-API-Key'</span>
                          <span className="text-white">:</span> <span className="text-purple-400">this</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">apiKey</span>
                          <span className="text-white">,</span>
                          {"\n            "}
                          <span className="text-orange-300">'X-Signature'</span>
                          <span className="text-white">:</span> <span className="text-blue-300">signature</span>
                          <span className="text-white">,</span>
                          {"\n            "}
                          <span className="text-orange-300">'X-Timestamp'</span>
                          <span className="text-white">:</span> <span className="text-blue-300">timestamp</span>
                          <span className="text-white">,</span>
                          {"\n            "}
                          <span className="text-orange-300">'X-Selfie-Blob'</span>
                          <span className="text-white">:</span> <span className="text-red-300">faceFile</span>
                          <span className="text-white">,</span>{" "}
                          <span className="text-gray-400">// faceFile as base64</span>
                          {"\n            "}
                          <span className="text-orange-300">'X-Document-Blob'</span>
                          <span className="text-white">:</span> <span className="text-red-300">idFile</span>
                          <span className="text-white">,</span>{" "}
                          <span className="text-gray-400">// idFile as base64</span>
                          {"\n            "}
                          <span className="text-orange-300">'Content-Type'</span>
                          <span className="text-white">:</span>{" "}
                          <span className="text-orange-300">'application/json'</span>
                          <span className="text-white">,</span>
                          {"\n          "}
                          <span className="text-white">{"}"}</span>
                          <span className="text-white">,</span>
                          {"\n        "}
                          <span className="text-white">{"}"}</span>
                          {"\n      "}
                          <span className="text-yellow-400">)</span>
                          <span className="text-white">;</span>
                          {"\n      "}
                          <span className="text-purple-400">return</span>{" "}
                          <span className="text-blue-300">response</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">data</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">status</span>
                          <span className="text-white">;</span>{" "}
                          <span className="text-gray-400">// Returns "VERIFIED" or "NOT_VERIFIED"</span>
                          {"\n    "}
                          <span className="text-yellow-400">{"}"}</span> <span className="text-purple-400">catch</span>{" "}
                          <span className="text-yellow-400">(</span>
                          <span className="text-red-300">error</span>
                          <span className="text-yellow-400">)</span> <span className="text-yellow-400">{"{"}</span>
                          {"\n      "}
                          <span className="text-purple-400">if</span> <span className="text-yellow-400">(</span>
                          <span className="text-red-300">error</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">response</span>
                          <span className="text-white">?.</span>
                          <span className="text-blue-300">data</span>
                          <span className="text-white">?.</span>
                          <span className="text-blue-300">code</span> <span className="text-white">===</span>{" "}
                          <span className="text-orange-300">'ALREADY_VERIFIED'</span>
                          <span className="text-yellow-400">)</span> <span className="text-yellow-400">{"{"}</span>
                          {"\n        "}
                          <span className="text-purple-400">throw</span> <span className="text-purple-400">new</span>{" "}
                          <span className="text-cyan-300">Error</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">'User has already been verified'</span>
                          <span className="text-yellow-400">)</span>
                          <span className="text-white">;</span>
                          {"\n      "}
                          <span className="text-yellow-400">{"}"}</span>
                          {"\n      "}
                          <span className="text-purple-400">throw</span> <span className="text-purple-400">new</span>{" "}
                          <span className="text-cyan-300">Error</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">
                            {"`KYC verification failed: ${error.response?.data?.error || error.message}`"}
                          </span>
                          <span className="text-yellow-400">)</span>
                          <span className="text-white">;</span>
                          {"\n    "}
                          <span className="text-yellow-400">{"}"}</span>
                          {"\n  "}
                          <span className="text-yellow-400">{"}"}</span>
                          {"\n"}
                          <span className="text-yellow-400">{"}"}</span>
                          {"\n\n"}
                          <span className="text-blue-300">module</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">exports</span> <span className="text-white">=</span>{" "}
                          <span className="text-cyan-300">SKYC</span>
                          <span className="text-white">;</span>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="go" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-white">Installation</h3>
                      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 rounded-lg p-4 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                        <code className="text-green-400 text-base font-mono">go get github.com/swan/kyc</code>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-white">Usage Example</h3>
                      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-lg p-6 border border-green-500/30 shadow-xl shadow-green-500/10 overflow-x-auto">
                        <pre className="text-sm">
                          <span className="text-purple-400">import</span> <span className="text-yellow-400">(</span>
                          {"\n\t"}
                          <span className="text-orange-300">"fmt"</span>
                          {"\n\t"}
                          <span className="text-orange-300">"os"</span>
                          {"\n\t"}
                          <span className="text-orange-300">"github.com/swan/kyc"</span>
                          {"\n"}
                          <span className="text-yellow-400">)</span>
                          {"\n\n"}
                          <span className="text-purple-400">func</span> <span className="text-green-400">main</span>
                          <span className="text-yellow-400">()</span> <span className="text-yellow-400">{"{"}</span>
                          {"\n\t"}
                          <span className="text-blue-300">client</span> <span className="text-white">:=</span>{" "}
                          <span className="text-blue-300">skyc</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">NewSKYC</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">"your-api-key"</span>
                          <span className="text-white">,</span>{" "}
                          <span className="text-orange-300">"your-secret-key"</span>
                          <span className="text-white">,</span> <span className="text-orange-300">""</span>
                          <span className="text-yellow-400">)</span>
                          {"\n\t"}
                          <span className="text-blue-300">idFile</span>
                          <span className="text-white">,</span> <span className="text-blue-300">_</span>{" "}
                          <span className="text-white">:=</span> <span className="text-blue-300">os</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">ReadFile</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">"id.jpg"</span>
                          <span className="text-yellow-400">)</span>
                          {"\n\t"}
                          <span className="text-blue-300">faceFile</span>
                          <span className="text-white">,</span> <span className="text-blue-300">_</span>{" "}
                          <span className="text-white">:=</span> <span className="text-blue-300">os</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">ReadFile</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">"selfie.jpg"</span>
                          <span className="text-yellow-400">)</span>
                          {"\n\n\t"}
                          <span className="text-blue-300">result</span>
                          <span className="text-white">,</span> <span className="text-blue-300">err</span>{" "}
                          <span className="text-white">:=</span> <span className="text-blue-300">client</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">VerifyKYC</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-blue-300">skyc</span>
                          <span className="text-white">.</span>
                          <span className="text-cyan-300">VerifyKYCRequest</span>
                          <span className="text-yellow-400">{"{"}</span>
                          {"\n\t\t"}
                          <span className="text-red-300">UserID</span>
                          <span className="text-white">:</span> <span className="text-orange-300">"user123"</span>
                          <span className="text-white">,</span>
                          {"\n\t\t"}
                          <span className="text-red-300">IDFile</span>
                          <span className="text-white">:</span> <span className="text-blue-300">base64</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">StdEncoding</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">EncodeToString</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-blue-300">idFile</span>
                          <span className="text-yellow-400">)</span>
                          <span className="text-white">,</span>
                          {"\n\t\t"}
                          <span className="text-red-300">FaceFile</span>
                          <span className="text-white">:</span> <span className="text-blue-300">base64</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">StdEncoding</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">EncodeToString</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-blue-300">faceFile</span>
                          <span className="text-yellow-400">)</span>
                          <span className="text-white">,</span>
                          {"\n\t"}
                          <span className="text-yellow-400">{"}"}</span>
                          <span className="text-yellow-400">)</span>
                          {"\n\t"}
                          <span className="text-purple-400">if</span> <span className="text-blue-300">err</span>{" "}
                          <span className="text-white">!=</span> <span className="text-purple-400">nil</span>{" "}
                          <span className="text-yellow-400">{"{"}</span>
                          {"\n\t\t"}
                          <span className="text-blue-300">fmt</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">Fprintf</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-blue-300">os</span>
                          <span className="text-white">.</span>
                          <span className="text-blue-300">Stderr</span>
                          <span className="text-white">,</span> <span className="text-orange-300">"Error: %v\\n"</span>
                          <span className="text-white">,</span> <span className="text-blue-300">err</span>
                          <span className="text-yellow-400">)</span>
                          {"\n\t\t"}
                          <span className="text-purple-400">return</span>
                          {"\n\t"}
                          <span className="text-yellow-400">{"}"}</span>
                          {"\n\t"}
                          <span className="text-purple-400">if</span> <span className="text-blue-300">result</span>{" "}
                          <span className="text-white">==</span> <span className="text-orange-300">"VERIFIED"</span>{" "}
                          <span className="text-yellow-400">{"{"}</span>
                          {"\n\t\t"}
                          <span className="text-blue-300">fmt</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">Println</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">"Verification for KYC success"</span>
                          <span className="text-yellow-400">)</span>
                          {"\n\t"}
                          <span className="text-yellow-400">{"}"}</span> <span className="text-purple-400">else</span>{" "}
                          <span className="text-yellow-400">{"{"}</span>
                          {"\n\t\t"}
                          <span className="text-blue-300">fmt</span>
                          <span className="text-white">.</span>
                          <span className="text-green-400">Println</span>
                          <span className="text-yellow-400">(</span>
                          <span className="text-orange-300">"Verification failed:"</span>
                          <span className="text-white">,</span> <span className="text-blue-300">result</span>
                          <span className="text-yellow-400">)</span>
                          {"\n\t"}
                          <span className="text-yellow-400">{"}"}</span>
                          {"\n"}
                          <span className="text-yellow-400">{"}"}</span>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-xl border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white text-3xl font-bold">API Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">POST /verify</h3>
                  <p className="text-gray-400 text-lg">Verify user identity using document and selfie</p>
                  <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-lg p-4 border border-teal-500/30 shadow-lg shadow-teal-500/10">
                    <h4 className="text-lg font-semibold text-white mb-2">Headers:</h4>
                    <ul className="text-gray-300 space-y-1 text-base">
                      <li>
                        <code className="text-purple-400 bg-purple-500/10 px-2 py-1 rounded">X-API-Key</code>:{" "}
                        <span className="text-cyan-300">Your API key</span>
                      </li>
                      <li>
                        <code className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded">X-Signature</code>:{" "}
                        <span className="text-green-300">HMAC SHA256 signature</span>
                      </li>
                      <li>
                        <code className="text-orange-400 bg-orange-500/10 px-2 py-1 rounded">X-Timestamp</code>:{" "}
                        <span className="text-yellow-300">ISO timestamp</span>
                      </li>
                      <li>
                        <code className="text-pink-400 bg-pink-500/10 px-2 py-1 rounded">X-Selfie-Blob</code>:{" "}
                        <span className="text-red-300">Base64 encoded selfie</span>
                      </li>
                      <li>
                        <code className="text-teal-400 bg-teal-500/10 px-2 py-1 rounded">X-Document-Blob</code>:{" "}
                        <span className="text-indigo-300">Base64 encoded ID document</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Welcome, Developer!
                </h1>
                <p className="text-gray-400 text-xl">Manage your API keys and monitor your application usage</p>
                {isWalletConnected && (
                  <div className="mt-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-lg">
                      Wallet Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "OCR Requests Today",
                  value: "150",
                  change: "+12%",
                  icon: Eye,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  label: "KYC Requests This Week",
                  value: "450",
                  change: "+8%",
                  icon: TrendingUp,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  label: "Active API Keys",
                  value: apiKeys.filter((key) => key.status === "Active").length.toString(),
                  change: "0%",
                  icon: Settings,
                  color: "from-green-500 to-teal-500",
                },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card
                    key={index}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-xl border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          {stat.change}
                        </Badge>
                      </div>
                      <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-gray-400 text-base">{stat.label}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* API Key Management */}
            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-xl border-gray-600/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-4xl font-bold">API Key Management</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-105 hover:shadow-teal-500/40">
                        <Plus className="w-4 h-4 mr-2" />
                        Generate New API Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-600">
                      <DialogHeader>
                        <DialogTitle className="text-white text-2xl">Generate New API Key</DialogTitle>
                        <DialogDescription className="text-gray-400 text-lg">
                          Create a new API key for your application
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="keyName" className="text-white text-base">
                            Key Name
                          </Label>
                          <Input
                            id="keyName"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            placeholder="e.g., Production Key"
                            className="bg-gray-700 border-gray-600 text-white text-base"
                          />
                        </div>
                        <Button
                          onClick={handleGenerateApiKey}
                          disabled={!newKeyName.trim() || isGeneratingKey}
                          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-2 text-base"
                        >
                          {isGeneratingKey ? "Generating..." : "Generate API Key"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 backdrop-blur-sm border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-semibold text-white">{apiKey.name}</span>
                            <Badge
                              variant={apiKey.status === "Active" ? "default" : "secondary"}
                              className={
                                apiKey.status === "Active"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : apiKey.status === "Limited"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                            >
                              {apiKey.status}
                            </Badge>
                          </div>
                          <div className="font-mono text-gray-300 text-base mb-2">{apiKey.key}</div>
                          <div className="text-sm text-gray-400">
                            {apiKey.requests} requests this month • Created {apiKey.createdAt}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleCopy(apiKey.key)}
                                className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/20 transition-all duration-300 hover:scale-110"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copiedKey === apiKey.key ? "Copied!" : "Copy to clipboard"}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteApiKey(apiKey.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 hover:scale-110"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete API key</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() => setActiveNav("API Documentation")}
                  className="w-full mt-6 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white py-3 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Explore Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Header */}
        <header className="backdrop-blur-xl bg-gray-900/80 border-b border-gray-700/50 sticky top-0 z-50">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Zap className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ASwan
                </span>
                <div className="text-xs text-gray-400">Developer Portal</div>
              </div>
            </div>
            {!isWalletConnected ? (
              <Button
                onClick={handleConnectWallet}
                disabled={isGeneratingKey}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-2 rounded-full shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-105 hover:shadow-teal-500/40"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isGeneratingKey ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <Button
                onClick={handleDisconnectWallet}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-2 rounded-full"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            )}
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-72 min-h-screen bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-r border-gray-700/50">
            <nav className="p-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeNav === item.name
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveNav(item.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
                    />
                    <span className="text-lg font-medium">{item.name}</span>
                    {isActive && <div className="ml-auto w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>}
                  </button>
                )
              })}
            </nav>

            {/* Footer Links */}
            <div className="absolute bottom-6 left-6 space-y-3 text-base">
              {["Privacy Policy", "Terms of Service", "Contact Support"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-400 hover:text-teal-400 transition-all duration-300 hover:translate-x-1"
                >
                  {link}
                </a>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">{renderContent()}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
