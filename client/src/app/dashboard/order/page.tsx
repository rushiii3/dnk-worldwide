"use client";

import React, { useState } from 'react';
import { Package, Search, ChevronRight, Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockOrders = [
  { 
    id: 'ORD-2301', 
    name: 'Vishal Sharma',
    date: '2025-03-28', 
    status: 'Pending', 
    itemType: 'Books and Documents - Box / Carton',
    waybill: '823002377239023'
  },
  { 
    id: 'ORD-2295', 
    name: 'Vishal Sharma',
    date: '2025-03-28', 
    status: 'Pending', 
    itemType: 'Books and Documents - Box / Carton',
    waybill: '823002377239023'
  },
  { 
    id: 'ORD-2267', 
    name: 'Vishal Sharma',
    date: '2025-03-28', 
    status: 'Pending', 
    itemType: 'Books and Documents - Box / Carton',
    waybill: '823002377239023'
  },
  { 
    id: 'ORD-2256', 
    name: 'Vishal Sharma',
    date: '2025-03-28', 
    status: 'Pending', 
    itemType: 'Books and Documents - Box / Carton',
    waybill: '823002377239023'
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;
  
  // Filter orders based on search term
  const filteredOrders = mockOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.itemType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Package className="size-6" />
          <h1 className="text-xl font-bold">My Orders</h1>
        </div>
        <div className="flex items-center">
          <div className="relative md:block hidden">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {currentOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="p-4">
              <h3 className="font-bold text-lg">{order.name}</h3>
              <p className="text-sm">{order.itemType}</p>
              <p className="text-xs text-gray-500">Waybill no. - {order.waybill}</p>
              
              <div className="flex justify-between items-center mt-4">
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  PICKUP BY {order.date.split('-')[2]} MARCH
                </div>
                <div className="text-gray-500 text-xs">
                  PICK UP {order.status}
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-1 text-xs border border-gray-300 rounded-lg py-2 px-3 bg-gray-50">
                  <Eye className="size-4" />
                  View Details
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 text-xs border border-blue-600 text-blue-600 rounded-lg py-2 px-3 bg-blue-50">
                  <RefreshCw className="size-4" />
                  Reorder
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {currentOrders.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No orders found.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 pt-4">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-300"
          >
            &lt;
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === number 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-300'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-300"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}