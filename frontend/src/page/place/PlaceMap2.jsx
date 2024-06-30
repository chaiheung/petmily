import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";

export const PlaceMap2 = ({ ctprvnCd }) => {
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            initializeMap();
        } else {
            const script = document.createElement("script");
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=d5b3cb3d230c4f406001bbfad60ef4d4&libraries=services,clusterer,drawing`;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                initializeMap();
            };
        }
    }, [ctprvnCd]);

    const initializeMap = () => {
        const kakao = window.kakao;

        const mapContainer = document.getElementById("place-map");
        const mapOption = {
            center: new kakao.maps.LatLng(36.2, 128.02025),
            level: 13,
        };

        const map = new kakao.maps.Map(mapContainer, mapOption);

        if (ctprvnCd) {
            // Center the map based on the ctprvnCd
            const locations = {
                11: { lat: 37.5665, lng: 126.9780 }, // 서울특별시
                26: { lat: 35.1796, lng: 129.0756 }, // 부산광역시
                27: { lat: 35.8722, lng: 128.6025 }, // 대구광역시
                28: { lat: 37.4563, lng: 126.7052 }, // 인천광역시
                29: { lat: 35.1600, lng: 126.8514 }, // 광주광역시
                30: { lat: 36.3504, lng: 127.3845 }, // 대전광역시
                31: { lat: 35.5384, lng: 129.3114 }, // 울산광역시
                36: { lat: 35.1796, lng: 128.0756 }, // 세종특별자치시
                // Add other regions as necessary
            };

            const location = locations[ctprvnCd];
            if (location) {
                map.setCenter(new kakao.maps.LatLng(location.lat, location.lng));
            }
        }
    };

    return <Box id="place-map" width="100%" height="500px" />;
};


