import { useCallback } from 'react';
import { Location, GoogleMapsMap, GoogleMapsMarker, GoogleMapsMapMouseEvent } from './types';

// Hook for Google Maps API
export const useGoogleMaps = () => {
  const getGoogleMaps = useCallback((): any => {
    if (typeof window === 'undefined' || !window.google) {
      return null;
    }
    return window.google;
  }, []);

  return { getGoogleMaps };
};

// Hook for address geocoding
export const useGeocoding = () => {
  const { getGoogleMaps } = useGoogleMaps();

  const getAddressFromCoordinates = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const google = getGoogleMaps();
      if (!google?.maps?.Geocoder) {
        return 'العنوان غير متوفر';
      }

      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({
        location: { lat, lng },
        language: 'ar'
      });

      if (!result.results[0]) {
        return 'العنوان غير متوفر';
      }

      const addressComponents = result.results[0].address_components;
      const getComponent = (types: string[]) =>
        addressComponents.find((comp: { types: string[]; long_name: string }) =>
          types.some(type => comp.types.includes(type)))?.long_name || '';

      const streetNumber = getComponent(['street_number']);
      const route = getComponent(['route']);
      const neighborhood = getComponent(['neighborhood', 'sublocality_level_1']);
      const locality = getComponent(['locality']);

      const addressParts = [
        streetNumber && route ? `${streetNumber} ${route}` : route,
        neighborhood,
        locality
      ].filter(Boolean);

      return addressParts.length > 0 ? addressParts.join(', ') : 'العنوان غير متوفر';
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'العنوان غير متوفر';
    }
  }, [getGoogleMaps]);

  return { getAddressFromCoordinates };
};

// Hook for marker creation
export const useMarkerCreation = () => {
  const { getGoogleMaps } = useGoogleMaps();
  const { getAddressFromCoordinates } = useGeocoding();

  const createUserMarker = useCallback((location: Location, map: GoogleMapsMap): GoogleMapsMarker => {
    const google = getGoogleMaps();
    if (!google?.maps?.Marker) {
      throw new Error('Google Maps Marker not available');
    }

    const marker = new google.maps.Marker({
      position: location,
      map: map,
      title: "موقعك الحالي",
      label: {
        text: "🎯",
        color: "hsl(var(--foreground))",
        fontWeight: "bold",
        fontSize: "18px"
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "hsl(var(--primary))",
        fillOpacity: 0.3,
        strokeColor: "hsl(var(--primary))",
        strokeWeight: 4,
        scale: 20
      },
      zIndex: 1000,
      animation: google.maps.Animation.DROP
    });

    // Enhanced animation sequence
    setTimeout(() => {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null);
        // Add subtle pulsing effect
        let pulseCount = 0;
        const pulseInterval = setInterval(() => {
          if (pulseCount >= 3) {
            clearInterval(pulseInterval);
            return;
          }
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "hsl(var(--primary))",
            fillOpacity: 0.3,
            strokeColor: "hsl(var(--primary))",
            strokeWeight: 4,
            scale: 20 + (pulseCount % 2) * 2
          });
          pulseCount++;
        }, 800);
      }, 2000);
    }, 300);

    return marker;
  }, [getGoogleMaps]);

  const createSelectedMarker = useCallback((location: Location, map: GoogleMapsMap, clientName: string): GoogleMapsMarker => {
    const google = getGoogleMaps();
    if (!google?.maps?.Marker) {
      throw new Error('Google Maps Marker not available');
    }

    const marker = new google.maps.Marker({
      position: location,
      map: map,
      title: `${clientName} - الموقع المحدد`,
      draggable: true,
      label: {
        text: "❤️",
        color: "hsl(var(--foreground))",
        fontWeight: "bold",
        fontSize: "16px"
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "hsl(var(--destructive))",
        fillOpacity: 0.3,
        strokeColor: "hsl(var(--destructive))",
        strokeWeight: 3,
        scale: 18
      },
      zIndex: 999
    });

    // Add drag listeners
    const dragStartListener = marker.addListener('dragstart', () => {
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "hsl(var(--warning))",
        fillOpacity: 0.3,
        strokeColor: "hsl(var(--warning))",
        strokeWeight: 3,
        scale: 22
      });
      marker.setAnimation(google.maps.Animation.BOUNCE);
    });

    const dragEndListener = marker.addListener('dragend', async (dragEvent: GoogleMapsMapMouseEvent) => {
      if (!dragEvent.latLng) return;

      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "hsl(var(--destructive))",
        fillOpacity: 0.3,
        strokeColor: "hsl(var(--destructive))",
        strokeWeight: 3,
        scale: 18
      });
      marker.setAnimation(null);

      const updatedLocation = {
        lat: dragEvent.latLng.lat(),
        lng: dragEvent.latLng.lng()
      };

      // Note: This would need to be handled by parent component
      // For now, we'll just log the update
      console.log('Marker dragged to:', updatedLocation);
    });

    // Store listeners for cleanup
    marker.set('dragStartListener', dragStartListener);
    marker.set('dragEndListener', dragEndListener);

    return marker;
  }, [getGoogleMaps, getAddressFromCoordinates]);

  return { createUserMarker, createSelectedMarker };
};

// Enhanced accuracy validation function
const getAccuracyLevel = (accuracy: number) => {
  if (accuracy <= 3) return { level: 'EXCELLENT', color: 'text-green-500', icon: '🎯', text: 'دقة ممتازة' };
  if (accuracy <= 8) return { level: 'GOOD', color: 'text-green-400', icon: '📍', text: 'دقة جيدة' };
  if (accuracy <= 15) return { level: 'ACCEPTABLE', color: 'text-yellow-500', icon: '📌', text: 'دقة مقبولة' };
  if (accuracy <= 25) return { level: 'POOR', color: 'text-orange-500', icon: '⚠️', text: 'دقة ضعيفة' };
  return { level: 'UNRELIABLE', color: 'text-red-500', icon: '❌', text: 'دقة غير موثوقة' };
};

// Progressive accuracy strategy
const getLocationWithProgressiveAccuracy = async (): Promise<GeolocationPosition> => {
  // Strategy 1: Maximum accuracy with longer timeout
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 25000,        // Increased from 10000
        maximumAge: 0          // Always fresh
      });
    });

    // If accuracy is excellent or good, use it immediately
    if (position.coords.accuracy <= 8) {
      console.log('High accuracy achieved:', position.coords.accuracy, 'meters');
      return position;
    }

    console.log('Moderate accuracy achieved:', position.coords.accuracy, 'meters');
    return position;
  } catch (error) {
    console.warn('High accuracy failed, trying fallback strategy');
  }

  // Strategy 2: Fallback with acceptable accuracy
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 30000      // Reduced from 60000
      });
    });

    console.log('Fallback accuracy achieved:', position.coords.accuracy, 'meters');
    return position;
  } catch (error) {
    console.warn('Fallback strategy also failed');
    throw error;
  }
};

// Hook for enhanced geolocation
export const useGeolocation = () => {
  const { getAddressFromCoordinates } = useGeocoding();
  const { createUserMarker, createSelectedMarker } = useMarkerCreation();

  const getUserLocation = useCallback(async (map: GoogleMapsMap, clientName: string) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return null;
    }

    try {
      // Use progressive accuracy strategy
      const position = await getLocationWithProgressiveAccuracy();

      // Validate and log accuracy
      const accuracyInfo = getAccuracyLevel(position.coords.accuracy);
      console.log(`Location accuracy: ${accuracyInfo.text} (${position.coords.accuracy.toFixed(1)}m)`);

      // Warn if accuracy is poor
      if (position.coords.accuracy > 25) {
        console.warn('Poor accuracy detected. Consider retrying or using manual location selection.');
      }

      const currentLocation: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      map.setCenter(currentLocation);
      map.setZoom(15);

      // Get address and create markers
      const [address, userMarker, selectedMarker] = await Promise.all([
        getAddressFromCoordinates(currentLocation.lat, currentLocation.lng),
        createUserMarker(currentLocation, map),
        createSelectedMarker(currentLocation, map, clientName)
      ]);

      return {
        location: currentLocation,
        address,
        userMarker,
        selectedMarker,
        accuracyInfo
      };

    } catch (error) {
      // Enhanced error handling with specific messages
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.warn('Geolocation permission denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            console.warn('Geolocation position unavailable - check device GPS');
            break;
          case error.TIMEOUT:
            console.warn('Geolocation request timed out - GPS may need more time');
            break;
          default:
            console.warn('Geolocation error:', error.message);
        }
      } else {
        console.warn('Unexpected geolocation error:', error);
      }
      return null;
    }
  }, [getAddressFromCoordinates, createUserMarker, createSelectedMarker]);

  return { getUserLocation };
};
