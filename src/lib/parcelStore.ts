import api from "./api";

export type ParcelStatus = 'pending' | 'requested' | 'accepted' | 'picked-up' | 'in-transit' | 'delivered' | 'received' | 'completed' | 'cancelled';

export interface Parcel {
  id: string;
  _id?: string; // MongoDB ID
  senderName: string;
  senderPhone?: string;
  receiverName: string;
  receiverPhone: string;
  fromLocation: string;
  toLocation: string;
  weight: number;
  size: 'small' | 'medium' | 'large' | 'very-large';
  itemCount: number;
  vehicleType?: string;
  paymentMethod: 'pay-now' | 'pay-on-delivery';
  paymentStatus: 'unpaid' | 'paid';
  description: string;
  status: ParcelStatus;
  travellerId?: string;
  travellerName?: string;
  travellerPhone?: string;
  travellerAdharNumber?: string;
  travellerAdharPhoto?: string;
  travellerPhoto?: string;
  pickupOtp?: string;
  paymentReleased?: boolean;
  parcelPhoto?: string;
  createdAt: string;
}

interface BackendParcel extends Omit<Parcel, 'id' | 'fromLocation' | 'toLocation'> {
  _id?: string;
  id?: string;
  pickupLocation?: { address: string };
  deliveryLocation?: { address: string };
  fromLocation?: string;
  toLocation?: string;
  senderPhone?: string;
  travellerPhone?: string;
  pickupOtp?: string;
}

// Convert backend parcel to frontend parcel format if needed
const mapParcel = (p: BackendParcel): Parcel => ({
  ...p,
  id: (p._id || p.id) as string,
  fromLocation: p.pickupLocation?.address || p.fromLocation || "",
  toLocation: p.deliveryLocation?.address || p.toLocation || "",
} as Parcel);

export async function createParcel(parcel: Omit<Parcel, 'id' | 'status' | 'createdAt'>, photo?: File): Promise<Parcel> {
  const formData = new FormData();
  formData.append("title", parcel.description.slice(0, 30) || "Parcel");
  formData.append("description", parcel.description);
  formData.append("weight", parcel.weight.toString());
  formData.append("size", parcel.size);
  formData.append("itemCount", parcel.itemCount.toString());
  formData.append("vehicleType", parcel.vehicleType || "");
  formData.append("pickupLocation", JSON.stringify({ lat: 0, lng: 0, address: parcel.fromLocation }));
  formData.append("deliveryLocation", JSON.stringify({ lat: 0, lng: 0, address: parcel.toLocation }));
  formData.append("price", (parcel.weight * 50 + 20).toString());
  formData.append("paymentMethod", parcel.paymentMethod);
  formData.append("paymentStatus", parcel.paymentStatus);
  formData.append("receiverPhone", parcel.receiverPhone);
  formData.append("receiverName", parcel.receiverName);
  formData.append("senderName", parcel.senderName);

  if (photo) {
    formData.append("photo", photo);
  }

  const resp = await api.post("/parcel/create-parcel", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return mapParcel(resp.data);
}

export async function getAllParcels(): Promise<Parcel[]> {
  const resp = await api.get("/parcel/my-parcels");
  return resp.data.map(mapParcel);
}

export async function getMyDeliveries(): Promise<Parcel[]> {
  const resp = await api.get("/parcel/my-deliveries");
  return resp.data.map(mapParcel);
}

export async function getParcelsByPhone(phone: string): Promise<Parcel[]> {
  const resp = await api.get(`/parcel/by-phone/${phone}`);
  return resp.data.map(mapParcel);
}

export async function updateParcelStatus(id: string, status: ParcelStatus, travellerName?: string, otp?: string): Promise<Parcel | null> {
  let endpoint = "/parcel/update-status";
  let payload: Record<string, unknown> = { parcelId: id, status, otp };

  if (status === 'requested') {
    endpoint = "/parcel/request-parcel";
    payload = { parcelId: id, travellerName };
  } else if (status === 'accepted') {
    endpoint = "/parcel/accept-request";
    payload = { parcelId: id };
  }

  const resp = await api.post(endpoint, payload);
  return mapParcel(resp.data);
}

export async function updateParcelPayment(id: string, status: 'paid' | 'unpaid'): Promise<Parcel | null> {
  const resp = await api.post("/parcel/update-payment", { parcelId: id, paymentStatus: status });
  return mapParcel(resp.data);
}

export async function markReceived(id: string): Promise<Parcel | null> {
  const resp = await api.post("/parcel/receive-confirm", { parcelId: id });
  return mapParcel(resp.data);
}



export async function requestParcel(id: string, travellerName: string): Promise<Parcel | null> {
  const resp = await api.post("/parcel/request-parcel", { parcelId: id, travellerName });
  return mapParcel(resp.data);
}

export async function acceptRequest(id: string): Promise<Parcel | null> {
  const resp = await api.post("/parcel/accept-request", { parcelId: id });
  return mapParcel(resp.data);
}

export async function deleteParcel(id: string): Promise<boolean> {
  try {
    await api.delete(`/parcel/${id}`);
    return true;
  } catch {
    return false;
  }
}

export async function releaseParcelPayment(id: string): Promise<Parcel | null> {
  const resp = await api.post("/parcel/release-payment", { parcelId: id });
  return mapParcel(resp.data);
}

export async function searchParcels(from?: string, to?: string): Promise<Parcel[]> {
  const resp = await api.get("/parcel/search", { params: { from, to } });
  return resp.data.map(mapParcel);
}
