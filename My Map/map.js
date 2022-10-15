function create_map(){
     // *** 放置地圖
     let zoom = 15; // 0 - 18
     let center = [25.0854061,121.5615012]; // 中心點座標
     map = L.map('map').setView(center, zoom);

     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '© OpenStreetMap', // 商用時必須要有版權出處
     zoomControl: true , //Show - + button
     }).addTo(map);
 
    create_layer_of_map();  //建立不同種類的地圖
    get_user_location();    //取得使用者位置    【公司座標點: 23.4647148,120.4314508】
}

//建立不同種類地圖
function create_layer_of_map(){
    var baselayers = {
        'OpenStreetMap.Mapnik': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        'OpenStreetMap.DE': L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'),
        'OpenStreetMap.CH': L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png'),
        'OpenStreetMap.France':  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'),
        'OpenStreetMap.HOT': L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'),
        'OpenStreetMap.BZH': L.tileLayer('https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png'),
        'OpenTopoMap': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png')
    };
    var overlays = {};
    L.control.layers(baselayers, overlays).addTo(map);
    baselayers['OpenStreetMap.Mapnik'].addTo(map);
}

//取得使用者座標
function get_user_location(){
    map.locate({
        setView: true, // 是否讓地圖跟著移動中心點
        watch: false, // 是否要一直監測使用者位置
        maxZoom: 0, // 最大的縮放值
        enableHighAccuracy: true, // 是否要高精準度的抓位置
        timeout: 10000 // 觸發locationerror事件之前等待的毫秒數
    });

    map.on('locationfound', onLocationFound);   // 成功監聽到使用者的位置時觸發
    map.on('locationerror', onLocationError);   // 失敗時觸發
}

function onLocationFound(e) {
    user_location = e.latlng;    //設定使用者座標
    console.log(user_location);
    if(user_location != null)mark_user();
}

function onLocationError(e) {
    alert("無法取得座標");
}

function mark_user(){
    //map.flyTo(user_location);
    const marker = L.marker(user_location, {
        title: 'Hi',
        opacity: 1.0
    }).addTo(map);
    
}