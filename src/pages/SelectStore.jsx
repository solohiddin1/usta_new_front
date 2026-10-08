import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { t, getUser } from '../i18n/translations';
import { api } from '../api/client';

// Custom marker icon using standard leaflet assets or icon_loc_1
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapController({ coords }) {
  const map = useRef(null);
  useEffect(() => {
    // dynamically pan if coords change
  }, [coords]);
  return null;
}

export default function SelectStore() {
  const navigate = useNavigate();
  const user = getUser();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (user) {
      api.get(`/user/stores/${user.chat_id}`)
        .then((res) => {
          setStores(res.data);
          if (res.data.length > 0) {
            const currentStored = (() => {
              try {
                return JSON.parse(localStorage.getItem('store'));
              } catch {
                return null;
              }
            })();
            const initial = (currentStored && res.data.find((s) => s.id === currentStored.id)) || res.data[0];
            setSelectedStore(initial);
          }
        })
        .catch((err) => {
          console.error('Failed to load stores', err);
        });
    }
  }, [user?.chat_id]);

  useEffect(() => {
    if (selectedStore && mapRef.current) {
      const lat = parseFloat(selectedStore.latitude);
      const lng = parseFloat(selectedStore.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.setView([lat, lng], 14);
      }
    }
  }, [selectedStore]);

  const handleSelectStore = (store) => {
    setSelectedStore(store);
  };

  const handleConfirm = () => {
    if (selectedStore) {
      localStorage.setItem('store', JSON.stringify(selectedStore));
    }
  };

  if (!user) {
    return (
      <div className="Map">
        <div className="map_up">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="all_name">{t('h_16')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const backUrl = `/?lang=${user.lang || 'ru'}&chatId=${user.chat_id}`;
  const defaultLat = selectedStore ? parseFloat(selectedStore.latitude) || 41.311081 : 41.311081;
  const defaultLng = selectedStore ? parseFloat(selectedStore.longitude) || 69.240562 : 69.240562;

  return (
    <div className="Map">
      <div className="map_up">
        <div className="container">
          <div className="row">
            <div className="col-12 d-flex align-items-center">
              <Link className="all_back" to="/cart">
                <img src="/img/icon_back.png" alt="Back" />
              </Link>
              <div className="all_name">{t('h_11')}</div>
            </div>

            <div className="col-12">
              <div id="map_in" className="map_in">
                <MapContainer
                  center={[defaultLat, defaultLng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  ref={mapRef}
                  style={{ height: '400px', width: '100%', borderRadius: 12 }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {selectedStore && (
                    <Marker
                      position={[
                        parseFloat(selectedStore.latitude) || defaultLat,
                        parseFloat(selectedStore.longitude) || defaultLng,
                      ]}
                      icon={markerIcon}
                    >
                      <Popup>{selectedStore.name}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              <div className="map_name">{t('h_12')}</div>

              {stores?.map((store, idx) => {
                const isSelected = selectedStore && selectedStore.id === store.id;
                return (
                  <div
                    key={store.id || idx}
                    onClick={() => handleSelectStore(store)}
                    className={`map_box ${isSelected ? 'active' : ''}`}
                  >
                    <img src="/img/icon_loc_1.png" alt="Location" />
                    <span>{store.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="map_down">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Link onClick={handleConfirm} to="/cart" className="map_buy">
                {t('h_9')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
