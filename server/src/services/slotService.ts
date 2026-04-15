import mongoose from 'mongoose';
import { Booking } from '../models/Booking';
import { SlotLock } from '../models/SlotLock';
import { BlockedSlot } from '../models/BlockedSlot';
import { getAllSlotPrices } from './pricingService';
import { config } from '../config/env';
import { TurfId, SlotInfo } from '../types';

/**
 * Formats hour into a readable time label like "6:00 AM - 7:00 AM"
 */
const formatHour = (hour: number): string => {
  const startPeriod = hour >= 12 ? 'PM' : 'AM';
  const endHour = (hour + 1) % 24;
  const endPeriod = endHour >= 12 ? 'PM' : 'AM';

  const startDisplay = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const endDisplay = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;

  return `${startDisplay}:00 ${startPeriod} - ${endDisplay}:00 ${endPeriod}`;
};

/**
 * Gets the full slot grid for a turf on a specific date.
 */
export const getSlotsForDate = async (
  turfId: TurfId,
  dateStr: string
): Promise<SlotInfo[]> => {
  // Fetch all data in parallel
  const [bookedSlots, lockedSlots, blockedSlots, prices] = await Promise.all([
    Booking.find({
      turfId,
      date: dateStr,
      status: { $in: ['confirmed', 'pending'] },
    }).lean(),
    SlotLock.find({
      turfId,
      date: dateStr,
      expiresAt: { $gt: new Date() },
    }).lean(),
    BlockedSlot.find({
      turfId,
      date: dateStr,
    }).lean(),
    getAllSlotPrices(dateStr, turfId),
  ]);

  const bookedHours = new Set(bookedSlots.map((b) => b.startHour));
  const lockedHours = new Set(lockedSlots.map((l) => l.startHour));
  const blockedHours = new Set(blockedSlots.map((b) => b.startHour));

  const slots: SlotInfo[] = [];

  for (let hour = 0; hour < 24; hour++) {
    let status: SlotInfo['status'] = 'available';

    if (blockedHours.has(hour)) {
      status = 'blocked';
    } else if (bookedHours.has(hour)) {
      status = 'booked';
    } else if (lockedHours.has(hour)) {
      status = 'locked';
    }

    slots.push({
      hour,
      timeLabel: formatHour(hour),
      status,
      price: prices.get(hour) || 0,
    });
  }

  return slots;
};

/**
 * Attempts to lock a slot atomically. Returns true if successful.
 */
export const lockSlot = async (
  turfId: TurfId,
  dateStr: string,
  startHour: number,
  userId: string
): Promise<boolean> => {
  // 1. Check if slot is already booked or blocked
  const [existingBooking, existingBlock] = await Promise.all([
    Booking.findOne({
      turfId,
      date: dateStr,
      startHour,
      status: { $in: ['confirmed', 'pending'] },
    }),
    BlockedSlot.findOne({
      turfId,
      date: dateStr,
      startHour,
    }),
  ]);

  if (existingBooking || existingBlock) {
    return false;
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.slotLockDuration * 60 * 1000);

  try {
    // Atomic Upsert:
    // Only succeeds if:
    // a) No lock exists for this slot -> Insert
    // b) A lock exists but is EXPIRED -> Update
    // c) A lock exists and is OURS -> Update
    const lock = await SlotLock.findOneAndUpdate(
      {
        turfId,
        date: dateStr,
        startHour,
        $or: [
          { expiresAt: { $lte: now } },
          { userId: new mongoose.Types.ObjectId(userId) }
        ]
      },
      {
        $set: {
          userId: new mongoose.Types.ObjectId(userId),
          expiresAt
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    return !!lock;
  } catch (error) {
    // Duplicate key error (11000) or other issues mean someone else has an ACTIVE lock
    return false;
  }
};

/**
 * Releases a slot lock.
 */
export const unlockSlot = async (
  turfId: TurfId,
  dateStr: string,
  startHour: number,
  userId: string
): Promise<void> => {
  await SlotLock.deleteOne({
    turfId,
    date: dateStr,
    startHour,
    userId: new mongoose.Types.ObjectId(userId),
  });
};

/**
 * Checks if a slot is available for booking.
 */
export const isSlotAvailable = async (
  turfId: TurfId,
  dateStr: string,
  startHour: number
): Promise<boolean> => {
  const [existingBooking, existingBlock] = await Promise.all([
    Booking.findOne({
      turfId,
      date: dateStr,
      startHour,
      status: { $in: ['confirmed', 'pending'] },
    }),
    BlockedSlot.findOne({
      turfId,
      date: dateStr,
      startHour,
    }),
  ]);

  return !existingBooking && !existingBlock;
};
