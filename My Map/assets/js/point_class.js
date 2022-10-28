function Point() {
    this.list = new Array();
}
  
Point.prototype.addPoint = function(point) {
    this.list.push(point);
}

Point.prototype.prinfPoint = function(){
    this.list.forEach(element => console.log(element));
}