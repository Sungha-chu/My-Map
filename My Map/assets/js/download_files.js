function download_file() {
    //藉型別陣列建構的 blob 來建立 URL
    let fileName = "path.bin";
    const data = data_package();
    let temp="";
    data.forEach(function(element){
        console.log('data:'+element);
    });
    let blob = new Blob(data, {
        type: "application/octet-stream"
    });
    var href = URL.createObjectURL(blob);
    // 從 Blob 取出資料
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = href;
    link.download = fileName;
    link.click();
}

//打包並回傳資料
function data_package(){
    let data_list = new Array();

    let data_info = new Uint8Array(8);  //檔案資訊
    data_info[0] = new Date().getMonth()+1  //月
    data_info[1] = new Date().getDate();    //日
    data_info[2] = points_on_edges_of_graphics_to_output.length;    //資料長度

    data_list.push(data_info);
    data_list.push(new Uint8Array(8));
    
    for(var i=0; i<points_on_edges_of_graphics_to_output.length; i++){
        let lat = set_data(points_on_edges_of_graphics_to_output[i].lat);
        let lat0 = lat.toString().split('.')[0];
        let lat1 = cut_lat_and_lng(lat.toString().split('.')[1]);   //傳回型態為list

        let lng = set_data(points_on_edges_of_graphics_to_output[i].lng);
        let lng0 = lng.toString().split('.')[0];
        let lng1 = cut_lat_and_lng(lng.toString().split('.')[1]);   //傳回型態為list

        let arr = new Uint8Array(8);
        arr[0] = i+1;   //現在的路線
        arr[1] = lat0;  //緯度的整數部分
        arr[2] = lat1[0];   //緯度的小數點部分(小數點後1~2位)
        arr[3] = lat1[1];   //緯度的小數點部分(小數點後3~4位)
        arr[4] = lng0;  //經度的整數部分
        arr[5] = lng1[0];   //經度的小數點部分(小數點後1~2位)
        arr[6] = lng1[1];  //經度的小數點部分(小數點後3~4位)
        arr[7] = i+2;   //下一條路線

        data_list.push(arr);

        let data_info = new Uint8Array(8);
        if(i+1 < points_on_edges_of_graphics_to_output.length){
            let dir_list = getDirection(points_on_edges_of_graphics_to_output[i], points_on_edges_of_graphics_to_output[i+1]);
            data_info[0] = dir_list[0]; //+-號
            data_info[1] = dir_list[1]; //整數部分
            data_info[2] = dir_list[2]; //小數點下一位

            let dist_list = getDistance(points_on_edges_of_graphics_to_output[i], points_on_edges_of_graphics_to_output[i+1]);   //取得兩點間距離(data_info 3~5)
            data_info[3] = dist_list[0][0];  //整數(超過255後進位)
            data_info[4] = dist_list[0][1];  //整數
            data_info[5] = dist_list[1];     //小數點後一位
        }
        if(i+2 < points_on_edges_of_graphics_to_output.length) data_info[6] = getAngle(points_on_edges_of_graphics_to_output[i], points_on_edges_of_graphics_to_output[i+1], points_on_edges_of_graphics_to_output[i+2]);   //取得現在的路線與下一條路線的夾角

        data_list.push(data_info);
    }
    return data_list;
}

function getDirection(p1, p2){
    let dir = Math.atan2(p2.lat - p1.lat, p2.lng - p1.lng);
    let list = new Array(3);

    if(dir < 0) list[0] = 1;    //向量為負值時設為1
    else list[0] = 0; //否則為0

    let dir_list = L.latLng(p1).distanceTo(L.latLng(p2)).toString().split('.');
    list[1] = dir_list[0];  //整數部分
    let dir_temp = Array.from(dir_list[1]);
    list[2] = dir_temp[1];  

    return list;
}

//取得兩點間距離(取到小數點後一位)
function getDistance(p1, p2){
    let list = new Array();
    let list_int = new Array(2);

    let distance_list = L.latLng(p1).distanceTo(L.latLng(p2)).toString().split('.');
    let distance_temp = Array.from(distance_list[1]);

    if(distance_list[0] - 255 > 0){
        let temp = Array.from(distance_list[0]);
        list_int[0] = temp[0]+temp[1];
        if(temp[3 != null])list_int[1] = temp[2]+temp[3];
        else list_int[1] = temp[2];
    }
    else {
        list_int[1] = distance_list[0];    //整數部分
    }
    
    list.push(list_int);
    list.push(distance_temp[0]);    //小數點後一位

    return list;
}

//取得兩線的夾角(現在的路線與下一條路線)
function getAngle(p1, p2, p3){
    let A = {X:p1.lng,Y:p1.lat}
    let B = {X:p2.lng,Y:p2.lat}
    let C = {X:p3.lng,Y:p3.lat}
    var AB = Math.sqrt(Math.pow(A.X - B.X, 2) + Math.pow(A.Y - B.Y, 2));
    var AC = Math.sqrt(Math.pow(A.X - C.X, 2) + Math.pow(A.Y - C.Y, 2));
    var BC = Math.sqrt(Math.pow(B.X - C.X, 2) + Math.pow(B.Y - C.Y, 2));
    var cosA = (
                Math.pow(AB, 2) + Math.pow(AC, 2) - Math.pow(BC, 2)
                ) / (
                2 * AB * AC
                );
    var angleA = Math.round( Math.acos(cosA) * 180 / Math.PI );

    return angleA;
}

//取小數點後四位
function set_data(data){
    data = data*10000;
    data = data.toString().split(".");
    return data[0]/10000;
}

//切割經度與緯度小數點部分
function cut_lat_and_lng(value){
    let data = value.toString();
    let arr = Array.from(data);
    let list = new Array();

    list.push(arr[0]+arr[1]);
    if(arr[3] != null)list.push(arr[2]+arr[3]); //避免取到undefined資料
    else list.push(arr[2]);

    return list;
}