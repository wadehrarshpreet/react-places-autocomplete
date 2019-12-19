export const geocodeByAddress = address => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status !== OK) {
        reject(status);
      }
      resolve(results);
    });
  });
};

export const getLatLng = result => {
  return new Promise((resolve, reject) => {
    try {
      const latLng = {
        lat:
          typeof result.geometry.location.lat === 'function'
            ? result.geometry.location.lat()
            : result.geometry.location.lat,
        lng:
          typeof result.geometry.location.lng === 'function'
            ? result.geometry.location.lng()
            : result.geometry.location.lng,
      };
      resolve(latLng);
    } catch (e) {
      reject(e);
    }
  });
};

export const geocodeByPlaceId = (placeId, getPlaceUrl) => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;

  return new Promise((resolve, reject) => {
    let url = getPlaceUrl;
    if (!url) {
      geocoder.geocode({ placeId }, (results, status) => {
        if (status !== OK) {
          reject(status);
        }
        resolve(results);
      });
      return;
    }
    fetch(url)
      .then(response => response.json())
      .then(function(data) {
        if (data.status == 'OK') {
          let result = [];
          result.push(data.result);
          resolve(result);
        } else {
          geocoder.geocode({ placeId }, (results, status) => {
            if (status !== OK) {
              reject(status);
            }
            resolve(results);
          });
        }
      })
      .catch(function() {
        geocoder.geocode({ placeId }, (results, status) => {
          if (status !== OK) {
            reject(status);
          }
          resolve(results);
        });
      });
  });
};
