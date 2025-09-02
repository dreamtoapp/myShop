// Google Maps types
export interface GoogleMapsMap {
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  addListener: (event: string, callback: (event: any) => void) => void;
}

export interface GoogleMapsMarker {
  setMap: (map: GoogleMapsMap | null) => void;
  setIcon: (icon: any) => void;
  setAnimation: (animation: any) => void;
  addListener: (event: string, callback: (event: any) => void) => void;
  get: (key: string) => any;
  set: (key: string, value: any) => void;
}

export interface GoogleMapsMapMouseEvent {
  latLng: { lat: () => number; lng: () => number } | null;
}

// Location types
export interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface LocationData {
  coordinates: Location;
  address: string;
  landmark: string;
  deliveryNote: string;
}

// Accuracy information type
export interface AccuracyInfo {
  level: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'UNRELIABLE';
  color: string;
  icon: string;
  text: string;
}

// Location progress type
export interface LocationProgress {
  accuracy: number;
  attempts: number;
  isSearching: boolean;
  message: string;
}

// Geolocation result type
export interface GeolocationResult {
  location: Location;
  address: string;
  userMarker: GoogleMapsMarker;
  selectedMarker: GoogleMapsMarker;
  accuracyInfo: AccuracyInfo;
}

// Component props
export interface GoogleMapProps {
  className?: string;
  clientName?: string;
  // Optional Google Maps API key passed from parent; falls back to env when absent
  googleMapsApiKey?: string;
  // Optional controlled initial values
  initialLatitude?: string;
  initialLongitude?: string;
  initialAddress?: string;
  initialLandmark?: string;
  initialDeliveryNote?: string;
  // Notify parent whenever any of the values change inside the map component
  onLocationChange?: (data: {
    latitude: string;
    longitude: string;
    address: string;
    landmark: string;
    deliveryNote: string;
  }) => void;
  // Optional external save handler invoked when user presses Save
  onSave?: (data: LocationData) => void;
  // If true, skip auto geolocation detection
  disableAutoLocation?: boolean;
}

export interface AutoLocationRowProps {
  userLocation: Location | null;
  onRecenter: () => void;
  locationProgress?: LocationProgress | null;
}

export interface SelectedLocationHeaderProps {
  selectedLocation: Location | null;
}

export interface LocationFormProps {
  selectedLocation: Location | null;
  editableAddress: string;
  setEditableAddress: (address: string) => void;
  landmark: string;
  setLandmark: (landmark: string) => void;
  deliveryNote: string;
  setDeliveryNote: (note: string) => void;
  onSave: () => void;
  onClear: () => void;
}

export interface LocationCardProps {
  userLocation: Location | null;
  selectedLocation: Location | null;
  editableAddress: string;
  setEditableAddress: (address: string) => void;
  landmark: string;
  setLandmark: (landmark: string) => void;
  deliveryNote: string;
  setDeliveryNote: (note: string) => void;
  onRecenter: () => void;
  onSave: () => void;
  onClear: () => void;
  locationProgress?: LocationProgress | null;
}

// Global type declarations
declare global {
  interface Window {
    google?: any;
    initMap?: () => void;
  }
}
