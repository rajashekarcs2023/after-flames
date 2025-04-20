import dynamic from "next/dynamic";

// Dynamically import the MapView component with SSR disabled
const MapViewDynamic = dynamic(() => import("./map-view"), {
  ssr: false,
});

export default MapViewDynamic;
