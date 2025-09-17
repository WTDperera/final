import React, { useState, useRef } from 'react';
import api from '../../utils/api';
import { motion } from "framer-motion";
import { Upload, FileText, Calendar, DollarSign, Tag, X } from "lucide-react";
import { useReceipts, useUI } from "../../hooks/useStore";
import { Button } from "../ui/Button";
import { Loading } from "../ui/Loading";
import { Modal } from '../components/ui/Modal'

export const ReceiptUpload = ({ isOpen, onClose }) => {
  const { uploadReceipt, isLoading, uploadProgress } = useReceipts()
  const { showToast } = useUI()
  const [dragOver, setDragOver] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      showToast('File size must be less than 10MB', 'error')
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      await uploadReceipt(selectedFile)
      showToast('Receipt uploaded successfully!', 'success')
      setSelectedFile(null)
      onClose()
    } catch (error) {
      showToast(error.message || 'Upload failed', 'error')
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setDragOver(false)
  }

  React.useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Receipt">
      <div className="space-y-6">
        {/* File Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop your receipt here
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse files
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload">
                <Button variant="outline" as="span">
                  Choose File
                </Button>
              </label>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isLoading}
            isLoading={isLoading}
          >
            Upload Receipt
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export const ReceiptCard = ({ receipt, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 truncate">
            {receipt.merchantName || 'Unknown Merchant'}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(receipt.date || receipt.createdAt)}
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-gray-900">
            {formatCurrency(receipt.total || 0)}
          </div>
          {receipt.category && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mt-1">
              <Tag className="w-3 h-3 mr-1" />
              {receipt.category}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onView(receipt)}>
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(receipt)}>
            Edit
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(receipt)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  )
}

export const ReceiptList = () => {
  const { receipts, fetchReceipts, deleteReceipt, isLoading } = useReceipts()
  const { showToast } = useUI()
  const [selectedReceipt, setSelectedReceipt] = React.useState(null)
  const [viewModalOpen, setViewModalOpen] = React.useState(false)

  React.useEffect(() => {
    fetchReceipts()
  }, [fetchReceipts])

  const handleDelete = async (receipt) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      try {
        await deleteReceipt(receipt._id)
        showToast('Receipt deleted successfully', 'success')
      } catch (error) {
        showToast(error.message || 'Failed to delete receipt', 'error')
      }
    }
  }

  const handleView = (receipt) => {
    setSelectedReceipt(receipt)
    setViewModalOpen(true)
  }

  const handleEdit = () => {
    // TODO: Implement edit functionality
    showToast('Edit functionality coming soon!', 'info')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loading />
      </div>
    )
  }

  if (receipts.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts yet</h3>
        <p className="text-gray-500">Upload your first receipt to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {receipts.map((receipt) => (
          <ReceiptCard
            key={receipt._id}
            receipt={receipt}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </div>

      {/* Receipt View Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Receipt Details"
        size="lg"
      >
        {selectedReceipt && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant
                </label>
                <p className="text-sm text-gray-900">
                  {selectedReceipt.merchantName || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <p className="text-sm text-gray-900">
                  ${selectedReceipt.total || '0.00'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedReceipt.date || selectedReceipt.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <p className="text-sm text-gray-900">
                  {selectedReceipt.category || 'Uncategorized'}
                </p>
              </div>
            </div>

            {selectedReceipt.items && selectedReceipt.items.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items
                </label>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Item
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedReceipt.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.description}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            ${item.price?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedReceipt.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <p className="text-sm text-gray-900">
                  {selectedReceipt.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}