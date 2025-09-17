import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  DollarSign,
  PieChart,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  Plus,
  BarChart3,
  Eye,
  X
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Loading } from '../components/ui/Loading'
import { useAuth, useReceipts, useUI } from '../hooks/useStore'
import ReceiptUpload from '../components/ReceiptUpload'

const Dashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth()
  const { receipts, isLoading, fetchReceipts } = useReceipts()
  const { sidebarOpen, toggleSidebar, showSuccess, showError } = useUI()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [currentView, setCurrentView] = useState('overview')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    fetchReceipts()
  }, [fetchReceipts])

  const handleLogout = async () => {
    try {
      await logout()
      showSuccess('Logged out successfully')
      onNavigate('landing')
    } catch {
      showError('Logout failed')
    }
  }

  // Calculate stats from receipts
  const stats = {
    totalReceipts: receipts?.length || 0,
    totalSpent: receipts?.reduce((sum, receipt) => sum + (receipt.total || 0), 0) || 0,
    thisMonth: receipts?.filter(receipt => {
      const receiptDate = new Date(receipt.date || receipt.createdAt)
      const now = new Date()
      return receiptDate.getMonth() === now.getMonth() && receiptDate.getFullYear() === now.getFullYear()
    }).reduce((sum, receipt) => sum + (receipt.total || 0), 0) || 0,
    categories: [...new Set(receipts?.map(r => r.category).filter(Boolean) || [])].length,
    avgPerReceipt: receipts?.length > 0 ? (receipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0) / receipts.length) : 0
  }

  const Sidebar = () => (
    <motion.div
      initial={false}
      animate={{
        x: sidebarOpen ? 0 : -280,
        opacity: sidebarOpen ? 1 : 0.95
      }}
      className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 z-40 shadow-lg"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">SnapCart</h1>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="md:hidden">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'overview' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">Upload Receipt</span>
          </button>
          
          <button
            onClick={() => setCurrentView('receipts')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'receipts' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">All Receipts</span>
          </button>
          
          <button
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'analytics' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProfileModal(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </motion.div>
  )

  const Header = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentView === 'overview' ? 'Dashboard' : 
             currentView === 'receipts' ? 'All Receipts' : 'Analytics'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Receipt
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )

  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReceipts}</p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">${stats.thisMonth.toFixed(0)}</p>
                <p className="text-sm text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
                <p className="text-sm text-green-600 mt-1">+3 from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg per Receipt</p>
                <p className="text-3xl font-bold text-gray-900">${stats.avgPerReceipt.toFixed(0)}</p>
                <p className="text-sm text-red-600 mt-1">-2% from last month</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )

  const OverviewContent = () => (
    <div className="space-y-8">
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Receipts</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('receipts')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loading />
                </div>
              ) : receipts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts yet</h3>
                  <p className="text-gray-500 mb-4">Upload your first receipt to get started</p>
                  <Button onClick={() => setShowUploadModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Receipt
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {receipts.slice(0, 5).map((receipt) => (
                    <div key={receipt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {receipt.storeName || 'Unknown Store'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(receipt.date || receipt.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(receipt.total || 0).toFixed(2)}
                        </p>
                        {receipt.category && (
                          <p className="text-xs text-gray-500">{receipt.category}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowUploadModal(true)}
                className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New Receipt
              </Button>
              <Button
                onClick={() => setCurrentView('receipts')}
                variant="outline"
                className="w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Browse Receipts
              </Button>
              <Button
                onClick={() => setCurrentView('analytics')}
                variant="outline"
                className="w-full justify-start"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (currentView) {
      case 'receipts':
        return (
          <div>
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Search receipts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                  />
                </div>
                <Button onClick={() => setShowUploadModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Receipt
                </Button>
              </div>
            </div>
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Receipt list coming soon!</p>
              <p className="text-sm">Your uploaded receipts will appear here.</p>
            </div>
          </div>
        )
      case 'analytics':
        return (
          <div className="space-y-6">
            <StatsCards />
            <Card>
              <CardHeader>
                <CardTitle>Spending Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Analytics dashboard coming soon!</p>
                  <p className="text-sm">Track your spending patterns and trends.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return <OverviewContent />
    }
  }

  if (isLoading && receipts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        <Header />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <ReceiptUpload
            onSuccess={() => {
              showSuccess('Receipt uploaded and processed successfully!');
              fetchReceipts(); // Refresh the receipts list
            }}
            onClose={() => setShowUploadModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Profile Settings"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input value={user?.name || ''} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input value={user?.email || ''} readOnly />
          </div>
          <div className="pt-4">
            <Button variant="outline" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard