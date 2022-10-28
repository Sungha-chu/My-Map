/*
各項參數
*/
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

/*JS檔案說明*/
/*
config.js: 參數檔。常用之參數與物件統一在此宣告(global)
index.js: 主程式檔。
create_and_init_map.js: 地圖檔。建置地圖及基本地圖要素。
set_points: 座標檔。框選與產生邊界座標點。
set_path.js: 路徑檔。規劃路徑。
*/