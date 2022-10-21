function create_new_list_by_distance(){
    var distance = document.querySelector('#interval_of_distance_set_by_user').value;   //使用者輸入的間隔距離
    if(distance != ""){ //檢查使用者是否有輸入間隔距離
        switch(document.querySelector('#unit_of_distance').value){  //select選單選擇的單位
            case 'm':   //公尺
                break;
            case 'km':  //公里
                distance = distance * 1000; //公尺轉公里
                break;
        }
        while(!check_distance_ok(distance)) found_center_point();   //遞迴至間隔距離為distance
    }
    else alert("未輸入間隔距離");
    
}

//建立圖形邊上中心點座標
function found_center_point(dist){
    var temp = new Array(); //圖形邊上中心座標暫存list
    for(var i=0; i < points_marker_by_user.length; i++){
        var list = new Array();
        if(i + 1 < points_marker_by_user.length){   //座標點頭尾相接
            list.push(points_marker_by_user[i]);
            list.push(points_marker_by_user[i+1]);

            var polyline = L.polyline(list, {color: ''}).addTo(map);
            L.marker(polyline.getCenter(), {
                title: polyline.getCenter().lat + ',' + polyline.getCenter().lng,
            }).addTo(map);  //標註中心座標
            temp.push(polyline.getCenter());
        }
        else{
            list.push(points_marker_by_user[i]);    //最後一筆資料需要指向原點
            list.push(points_marker_by_user[i-i]);  //第一筆資料
            
            var polyline = L.polyline(list, {color: ''}).addTo(map);
            L.marker(polyline.getCenter(), {
                title: polyline.getCenter().lat + ',' + polyline.getCenter().lng,
            }).addTo(map);  //標註中心座標
            temp.push(polyline.getCenter());
        }
    }

    temp.forEach(function(element){  //將圖形邊上中心座標暫存list中所有資料轉入points_marker_by_user
        points_marker_by_user.push(element);
    });

    sort_list_to_calculate();
    console.log(points_marker_by_user);
    
}

//計算中心點座標之排序
function sort_list_to_calculate(){
    let temp1 = new Array();    //原座標
    let temp2 = new Array();    //新中心點座標
    for(var i = 0; i < points_marker_by_user.length / 2; i++) temp1.push(points_marker_by_user[i]); //移轉原座標資料
    for(var i = points_marker_by_user.length / 2; i < points_marker_by_user.length; i++) temp2.push(points_marker_by_user[i]);  //移轉新中心點座標資料

    points_marker_by_user = new Array();    //清空points_marker_by_user
    for(var i = 0; i < (temp1.length + temp2.length) / 2; i++){ //原始座標與新建座標穿插排序
        points_marker_by_user.push(temp1[i]);   
        points_marker_by_user.push(temp2[i]);
    }
}

//檢查距離是否達到使用者輸入之dist
function check_distance_ok(dist){
    var is_ok = true;
    for(var i = 1; i < points_marker_by_user.length; i++){
        if(points_marker_by_user[i].distanceTo(points_marker_by_user[i - 1]) > dist)is_ok = false;
    }
    return is_ok;
}

//計算座標是否坐落於框選範圍
function IsPtInPoly() {
	var iSum = 0,
		iCount;
	var dLon1, dLon2, dLat1, dLat2, dLon;
	if (points_marker_by_user.length < 3) return false;
	iCount = points_marker_by_user.length;
	for (var i = 0; i < iCount; i++) {
		if (i == iCount - 1) {
			dLon1 = points_marker_by_user[i].lng;
			dLat1 = points_marker_by_user[i].lat;
			dLon2 = points_marker_by_user[0].lng;
			dLat2 = points_marker_by_user[0].lat;
		} else {
			dLon1 = points_marker_by_user[i].lng;
			dLat1 = points_marker_by_user[i].lat;
			dLon2 = points_marker_by_user[i + 1].lng;
			dLat2 = points_marker_by_user[i + 1].lat;
		}
		//以下語句判斷A點是否在邊的兩端點的水平平行線之間，在則可能有交點，開始判斷交點是否在左射線上
		if (((user_location.lat >= dLat1) && (user_location.lat < dLat2)) || ((user_location.lat >= dLat2) && (user_location.lat < dLat1))) {
			if (Math.abs(dLat1 - dLat2) > 0) {
				//得到 A點向左射線與邊的交點的x座標：
				dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - user_location.lat)) / (dLat1 - dLat2);
				if (dLon < user_location.lng) iSum++;
			}
		}
	}
	if (iSum % 2 != 0){
        console.log(true);
        return true;
    }
    console.log(false);
	return false;
}