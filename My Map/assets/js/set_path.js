function set_path(){
    let dir = document.querySelector('#direction').value;  //取得路經規劃方向
    add_log("路徑規劃方向: " + dir);

    let point_list = create_points_json();  //取得新JSON清單
    point_list.forEach(function(element){   //輸出測試
        console.log(element);
    });

    sort_points_marker_by_user();//緯度
    sort_points_marker_by_user2();//經度

    for(var i=0; i < points_marker_by_user.length; i++){
        L.marker(points_marker_by_user[i] , {
            title: i +1,
        }).addTo(map);
    };

    draw_path(points_marker_by_user);
}

//將原有座標點打包成JSON並加入編號以便debug
function create_points_json(){
    let points_json = new Array();
    for(var i=0; i<points_marker_by_user.length; i++){
        points_json.push({
            'id': i + 1,
            'point':points_marker_by_user[i]
        });
    }
    return points_json;
}

//繪製路線
function draw_path(list){
    L.polyline(list,{color: 'blue'}).addTo(map);
}