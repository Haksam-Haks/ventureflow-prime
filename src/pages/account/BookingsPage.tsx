
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Check, X, Clock, CreditCard, Hotel, MapPin, Ticket } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const BookingsPage: React.FC = () => {
  const { user } = useUser();
  const [filter, setFilter] = useState<string>('all');

  // Mock data - replace with actual API call
  const bookings = [
    {
      id: 'BK-123456',
      type: 'hotel',
      name: 'Luxury Beach Resort',
      date: '2023-06-15',
      endDate: '2023-06-18',
      status: 'confirmed',
      amount: 1155,
      nights: 3,
      location: 'Maldives'
    },
    {
      id: 'BK-789012',
      type: 'restaurant',
      name: 'Oceanview Grill',
      date: '2023-07-22',
      endDate: '2023-07-22',
      status: 'cancelled',
      amount: 75,
      guests: 2,
      location: 'Miami Beach'
    },
    {
      id: 'BK-345678',
      type: 'activity',
      name: 'Guided Snorkeling Tour',
      date: '2023-08-10',
      endDate: '2023-08-10',
      status: 'pending',
      amount: 120,
      guests: 2,
      location: 'Great Barrier Reef'
    }
  ];

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.type === filter);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Please log in to view your bookings</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your upcoming and past reservations
          </p>
        </div>

        <div className="mb-6 flex overflow-x-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setFilter('hotel')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'hotel'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Hotels
            </button>
            <button
              onClick={() => setFilter('restaurant')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'restaurant'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Restaurants
            </button>
            <button
              onClick={() => setFilter('activity')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'activity'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Activities
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="divide-y divide-gray-200">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {booking.type === 'hotel' && <Hotel className="h-5 w-5 text-gray-400" />}
                          {booking.type === 'restaurant' && <CreditCard className="h-5 w-5 text-gray-400" />}
                          {booking.type === 'activity' && <Ticket className="h-5 w-5 text-gray-400" />}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mr-3">{booking.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status === 'confirmed' ? (
                            <Check className="h-3 w-3 inline mr-1" />
                          ) : booking.status === 'cancelled' ? (
                            <X className="h-3 w-3 inline mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 inline mr-1" />
                          )}
                          {booking.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                        {new Date(booking.date).toLocaleDateString()}
                        {booking.date !== booking.endDate && (
                          <span> - {new Date(booking.endDate).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                        {booking.location}
                      </div>
                      {booking.nights && (
                        <div className="mt-1 text-sm text-gray-500">
                          {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
                        </div>
                      )}
                      {booking.guests && (
                        <div className="mt-1 text-sm text-gray-500">
                          {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-semibold text-gray-900 mb-2">
                        ${booking.amount.toFixed(2)}
                      </div>
                      <div className="flex space-x-3">
                        <Link 
                          to={`/booking/${booking.type}/${booking.id}`}
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          View Details
                        </Link>
                        {booking.status === 'confirmed' && (
                          <button className="text-sm font-medium text-red-600 hover:text-red-700">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No {filter !== 'all' ? filter : ''} bookings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
