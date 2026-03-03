export type ParcelStatus = 'pending' | 'requested' | 'accepted' | 'in-transit' | 'delivered';

export interface Parcel {
  id: string;
  senderName: string;
  receiverName: string;
  receiverPhone: string;
  fromLocation: string;
  toLocation: string;
  weight: number;
  description: string;
  status: ParcelStatus;
  travellerId?: string;
  travellerName?: string;
  createdAt: string;
}

const STORAGE_KEY = 'carrygo_parcels';

function getParcels(): Parcel[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveParcels(parcels: Parcel[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parcels));
}

export function createParcel(parcel: Omit<Parcel, 'id' | 'status' | 'createdAt'>): Parcel {
  const parcels = getParcels();
  const newParcel: Parcel = {
    ...parcel,
    id: crypto.randomUUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  parcels.push(newParcel);
  saveParcels(parcels);
  return newParcel;
}

export function getAllParcels(): Parcel[] {
  return getParcels();
}

export function getParcelsByPhone(phone: string): Parcel[] {
  return getParcels().filter(p => p.receiverPhone === phone);
}

export function updateParcelStatus(id: string, status: ParcelStatus, travellerName?: string): Parcel | null {
  const parcels = getParcels();
  const idx = parcels.findIndex(p => p.id === id);
  if (idx === -1) return null;
  parcels[idx].status = status;
  if (travellerName) parcels[idx].travellerName = travellerName;
  saveParcels(parcels);
  return parcels[idx];
}

export function deleteParcel(id: string): boolean {
  const parcels = getParcels();
  const filtered = parcels.filter(p => p.id !== id);
  if (filtered.length === parcels.length) return false;
  saveParcels(filtered);
  return true;
}

export function searchParcels(from?: string, to?: string): Parcel[] {
  return getParcels().filter(p => {
    const matchFrom = !from || p.fromLocation.toLowerCase().includes(from.toLowerCase());
    const matchTo = !to || p.toLocation.toLowerCase().includes(to.toLowerCase());
    return matchFrom && matchTo && (p.status === 'pending' || p.status === 'requested');
  });
}
