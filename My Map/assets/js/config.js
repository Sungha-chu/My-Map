let user_location = null;   //使用者的座標
let map;    //地圖物件
let user_location_icon = new L.Icon({   //使用者座標icon
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25 , 41],
    iconAnchor: [12 , 41],
    popupAnchor: [1 , 34],
    shadowSize: [41 , 41],
    opacity: 1.0
});
let drawItem;   //圖層
let points_marker_by_user = new Array(); //圖形標註座標


/*暫時沒用到*/
let mouseIsClicking = false;  //滑鼠點擊狀態(預設為false)
let mouseIsMoving = false;  //滑鼠移動狀態(預設為false)
let index_for_points_list = 0;