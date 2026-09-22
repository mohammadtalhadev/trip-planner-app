import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Trip, Activity, Expense, ItineraryDay } from '../types/trip';
import { addDaysToDate, calculateTripDays } from '../utils/date';

interface TripStoreState {
  trips: Trip[];
  currentTripId: string | null;

  // Trip Actions
  createTrip: (
    data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'days'> & { days?: ItineraryDay[] }
  ) => Trip;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  setCurrentTrip: (id: string | null) => void;

  // Day Actions
  addDay: (tripId: string) => void;
  removeDay: (tripId: string, dayId: string) => void;
  updateDayNotes: (tripId: string, dayId: string, notes: string) => void;

  // Activity Actions
  addActivity: (
    tripId: string,
    dayId: string,
    activity: Omit<Activity, 'id' | 'dayId' | 'orderIndex'>
  ) => void;
  updateActivity: (
    tripId: string,
    activityId: string,
    updates: Partial<Activity>
  ) => void;
  deleteActivity: (tripId: string, activityId: string) => void;
  toggleActivityCompleted: (tripId: string, activityId: string) => void;
  reorderActivities: (
    tripId: string,
    dayId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  moveActivity: (
    tripId: string,
    activityId: string,
    fromDayId: string,
    toDayId: string,
    newIndex?: number
  ) => void;

  // Expense Actions
  addExpense: (tripId: string, expense: Omit<Expense, 'id'>) => void;
  updateExpense: (
    tripId: string,
    expenseId: string,
    updates: Partial<Expense>
  ) => void;
  deleteExpense: (tripId: string, expenseId: string) => void;
}

// Initial demo trip matching the PDF specification (Turkey Vacation: Istanbul)
const INITIAL_DEMO_TRIPS: Trip[] = [
  {
    id: 'demo-turkey-vacation',
    name: 'Turkey Vacation',
    destination: 'Istanbul',
    destinationId: 'istanbul-turkey',
    coordinates: { lat: 41.0082, lon: 28.9784 },
    startDate: '2026-09-20',
    endDate: '2026-09-27',
    coverImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    budget: 2500,
    currency: 'USD',
    travelers: [
      { id: 't-1', name: 'Alex Johnson', email: 'alex@example.com', role: 'organizer' },
      { id: 't-2', name: 'Sarah Miller', email: 'sarah@example.com', role: 'traveler' },
      { id: 't-3', name: 'David Chen', email: 'david@example.com', role: 'traveler' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    days: [
      {
        id: 'day-1',
        dayNumber: 1,
        date: '2026-09-20',
        title: 'Historic Sultanahmet & Bosphorus',
        notes: 'Arrive at hotel around 08:00. Wear modest clothing for mosque visits.',
        activities: [
          {
            id: 'act-1-1',
            dayId: 'day-1',
            title: 'Hagia Sophia',
            time: '09:00',
            category: 'sightseeing',
            location: 'Sultanahmet Square',
            cost: 25,
            notes: 'Grand Byzantine architecture and historical mosaics',
            completed: true,
            orderIndex: 0,
          },
          {
            id: 'act-1-2',
            dayId: 'day-1',
            title: 'Blue Mosque',
            time: '11:30',
            category: 'sightseeing',
            location: 'Sultanahmet',
            cost: 0,
            notes: 'Famous Iznik blue tile interior',
            completed: true,
            orderIndex: 1,
          },
          {
            id: 'act-1-3',
            dayId: 'day-1',
            title: 'Traditional Turkish Lunch',
            time: '14:00',
            category: 'food',
            location: 'Tarihi Sultanahmet Köftecisi',
            cost: 45,
            notes: 'Authentic meatballs, piyaz bean salad, and ayran',
            completed: true,
            orderIndex: 2,
          },
          {
            id: 'act-1-4',
            dayId: 'day-1',
            title: 'Bosphorus Sunset Cruise Tour',
            time: '17:00',
            category: 'activity',
            location: 'Eminönü Pier',
            cost: 60,
            notes: 'Cruise along the strait dividing Europe and Asia',
            completed: false,
            orderIndex: 3,
          },
        ],
        expenses: [
          {
            id: 'exp-1-1',
            dayId: 'day-1',
            description: 'Sultanahmet Hotel (2 Nights Deposit)',
            amount: 320,
            currency: 'USD',
            category: 'Accommodation',
            date: '2026-09-20',
            notes: 'Boutique hotel in historic center',
          },
          {
            id: 'exp-1-2',
            dayId: 'day-1',
            description: 'Airport Taxi Transfer',
            amount: 45,
            currency: 'USD',
            category: 'Transportation',
            date: '2026-09-20',
          },
          {
            id: 'exp-1-3',
            dayId: 'day-1',
            description: 'Tarihi Köftecisi Group Lunch',
            amount: 65,
            currency: 'USD',
            category: 'Food',
            date: '2026-09-20',
          },
        ],
      },
      {
        id: 'day-2',
        dayNumber: 2,
        date: '2026-09-21',
        title: 'Bazaars & Galata District',
        notes: 'Exchange currency before entering the Grand Bazaar.',
        activities: [
          {
            id: 'act-2-1',
            dayId: 'day-2',
            title: 'Grand Bazaar (Kapalıçarşı)',
            time: '10:00',
            category: 'shopping',
            location: 'Beyazıt',
            cost: 80,
            notes: 'Explore ceramics, spices, carpets, and lamps',
            completed: false,
            orderIndex: 0,
          },
          {
            id: 'act-2-2',
            dayId: 'day-2',
            title: 'Lunch at Karaköy Waterfront',
            time: '13:00',
            category: 'food',
            location: 'Karaköy Güllüoğlu',
            cost: 50,
            notes: 'Fresh seafood sandwich and world famous pistachio baklava',
            completed: false,
            orderIndex: 1,
          },
          {
            id: 'act-2-3',
            dayId: 'day-2',
            title: 'Galata Tower Viewpoint',
            time: '16:00',
            category: 'sightseeing',
            location: 'Beyoğlu',
            cost: 30,
            notes: '360-degree panoramic view of Golden Horn and Old City',
            completed: false,
            orderIndex: 2,
          },
        ],
        expenses: [
          {
            id: 'exp-2-1',
            dayId: 'day-2',
            description: 'Grand Bazaar Handicrafts & Spices',
            amount: 150,
            currency: 'USD',
            category: 'Shopping',
            date: '2026-09-21',
          },
          {
            id: 'exp-2-2',
            dayId: 'day-2',
            description: 'Karaköy Dining & Desserts',
            amount: 70,
            currency: 'USD',
            category: 'Food',
            date: '2026-09-21',
          },
          {
            id: 'exp-2-3',
            dayId: 'day-2',
            description: 'Galata Tower Tickets (3 persons)',
            amount: 90,
            currency: 'USD',
            category: 'Activities',
            date: '2026-09-21',
          },
          {
            id: 'exp-2-4',
            dayId: 'day-2',
            description: 'International Flights (Allocated)',
            amount: 690,
            currency: 'USD',
            category: 'Transportation',
            date: '2026-09-20',
          },
        ],
      },
      {
        id: 'day-3',
        dayNumber: 3,
        date: '2026-09-22',
        title: 'Taksim & Istiklal Street',
        activities: [
          {
            id: 'act-3-1',
            dayId: 'day-3',
            title: 'Historic Tram on Istiklal Avenue',
            time: '10:30',
            category: 'transport',
            location: 'Taksim Square',
            cost: 5,
            completed: false,
            orderIndex: 0,
          },
          {
            id: 'act-3-2',
            dayId: 'day-3',
            title: 'Turkish Coffee & Pottery Workshop',
            time: '14:30',
            category: 'activity',
            location: 'Cihangir',
            cost: 45,
            completed: false,
            orderIndex: 1,
          },
        ],
        expenses: [],
      },
    ],
  },
];

export const useTripStore = create<TripStoreState>()(
  persist(
    (set) => ({
      trips: INITIAL_DEMO_TRIPS,
      currentTripId: 'demo-turkey-vacation',

      createTrip: (data) => {
        const totalDays = calculateTripDays(data.startDate, data.endDate);
        const days: ItineraryDay[] =
          data.days && data.days.length > 0
            ? data.days
            : Array.from({ length: totalDays }, (_, idx) => ({
                id: `day-${Date.now()}-${idx + 1}`,
                dayNumber: idx + 1,
                date: addDaysToDate(data.startDate, idx),
                title: `Day ${idx + 1}`,
                activities: [],
                expenses: [],
              }));

        const newTrip: Trip = {
          ...data,
          id: `trip-${Date.now()}`,
          days,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          trips: [newTrip, ...state.trips],
          currentTripId: newTrip.id,
        }));

        return newTrip;
      },

      updateTrip: (id, updates) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === id
              ? { ...trip, ...updates, updatedAt: new Date().toISOString() }
              : trip
          ),
        }));
      },

      deleteTrip: (id) => {
        set((state) => {
          const remaining = state.trips.filter((t) => t.id !== id);
          return {
            trips: remaining,
            currentTripId:
              state.currentTripId === id ? remaining[0]?.id || null : state.currentTripId,
          };
        });
      },

      setCurrentTrip: (id) => {
        set({ currentTripId: id });
      },

      addDay: (tripId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            const newDayNum = trip.days.length + 1;
            const lastDate = trip.days[trip.days.length - 1]?.date || trip.startDate;
            const newDate = addDaysToDate(lastDate, 1);

            const newDay: ItineraryDay = {
              id: `day-${Date.now()}-${newDayNum}`,
              dayNumber: newDayNum,
              date: newDate,
              title: `Day ${newDayNum}`,
              activities: [],
              expenses: [],
            };

            return {
              ...trip,
              days: [...trip.days, newDay],
              endDate: newDate,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      removeDay: (tripId, dayId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            const filtered = trip.days.filter((d) => d.id !== dayId);
            // Re-number days
            const renumbered = filtered.map((d, index) => ({
              ...d,
              dayNumber: index + 1,
            }));
            return {
              ...trip,
              days: renumbered,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updateDayNotes: (tripId, dayId, notes) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            return {
              ...trip,
              days: trip.days.map((day) =>
                day.id === dayId ? { ...day, notes } : day
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      addActivity: (tripId, dayId, activityData) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;

            return {
              ...trip,
              days: trip.days.map((day) => {
                if (day.id !== dayId) return day;

                const newActivity: Activity = {
                  ...activityData,
                  id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                  dayId,
                  orderIndex: day.activities.length,
                };

                return {
                  ...day,
                  activities: [...day.activities, newActivity],
                };
              }),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updateActivity: (tripId, activityId, updates) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;

            return {
              ...trip,
              days: trip.days.map((day) => ({
                ...day,
                activities: day.activities.map((act) =>
                  act.id === activityId ? { ...act, ...updates } : act
                ),
              })),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteActivity: (tripId, activityId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;

            return {
              ...trip,
              days: trip.days.map((day) => ({
                ...day,
                activities: day.activities
                  .filter((act) => act.id !== activityId)
                  .map((act, idx) => ({ ...act, orderIndex: idx })),
              })),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      toggleActivityCompleted: (tripId, activityId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;

            return {
              ...trip,
              days: trip.days.map((day) => ({
                ...day,
                activities: day.activities.map((act) =>
                  act.id === activityId ? { ...act, completed: !act.completed } : act
                ),
              })),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      reorderActivities: (tripId, dayId, sourceIndex, destinationIndex) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;

            return {
              ...trip,
              days: trip.days.map((day) => {
                if (day.id !== dayId) return day;

                const items = Array.from(day.activities);
                const [removed] = items.splice(sourceIndex, 1);
                items.splice(destinationIndex, 0, removed);

                return {
                  ...day,
                  activities: items.map((item, idx) => ({ ...item, orderIndex: idx })),
                };
              }),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      moveActivity: (tripId, activityId, fromDayId, toDayId, newIndex) => {
        if (fromDayId === toDayId) return;

        set((state) => {
          const trip = state.trips.find((t) => t.id === tripId);
          if (!trip) return state;

          const fromDay = trip.days.find((d) => d.id === fromDayId);
          const toDay = trip.days.find((d) => d.id === toDayId);
          if (!fromDay || !toDay) return state;

          const activity = fromDay.activities.find((a) => a.id === activityId);
          if (!activity) return state;

          const updatedFromActivities = fromDay.activities
            .filter((a) => a.id !== activityId)
            .map((a, idx) => ({ ...a, orderIndex: idx }));

          const targetActivities = Array.from(toDay.activities);
          const insertIdx =
            typeof newIndex === 'number' && newIndex >= 0
              ? Math.min(newIndex, targetActivities.length)
              : targetActivities.length;

          targetActivities.splice(insertIdx, 0, {
            ...activity,
            dayId: toDayId,
          });

          const updatedToActivities = targetActivities.map((a, idx) => ({
            ...a,
            orderIndex: idx,
          }));

          return {
            trips: state.trips.map((t) => {
              if (t.id !== tripId) return t;

              return {
                ...t,
                days: t.days.map((d) => {
                  if (d.id === fromDayId) {
                    return { ...d, activities: updatedFromActivities };
                  }
                  if (d.id === toDayId) {
                    return { ...d, activities: updatedToActivities };
                  }
                  return d;
                }),
                updatedAt: new Date().toISOString(),
              };
            }),
          };
        });
      },

      addExpense: (tripId, expenseData) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;

            const newExpense: Expense = {
              ...expenseData,
              id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            };

            // If dayId is provided, also insert into that specific day
            const updatedDays = trip.days.map((day) => {
              if (newExpense.dayId && day.id === newExpense.dayId) {
                return {
                  ...day,
                  expenses: [...day.expenses, newExpense],
                };
              }
              return day;
            });

            return {
              ...trip,
              days: updatedDays,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updateExpense: (tripId, expenseId, updates) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;

            return {
              ...trip,
              days: trip.days.map((day) => ({
                ...day,
                expenses: day.expenses.map((exp) =>
                  exp.id === expenseId ? { ...exp, ...updates } : exp
                ),
              })),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteExpense: (tripId, expenseId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;

            return {
              ...trip,
              days: trip.days.map((day) => ({
                ...day,
                expenses: day.expenses.filter((exp) => exp.id !== expenseId),
              })),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
    }),
    {
      name: 'trip-planner-trips',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
