/**
 * Created by Administrator on 2014/9/18.
 */
Array.prototype.Clear = function() {
    this.length = 0;
}

Array.prototype.Contain= function(obj) {
    return this.indexOf(obj) !== -1;
}

Array.prototype.RemoveAt = function(obj) {
    var index = this.indexOf(obj);
    if(index >= 0) this.removeAt(index);
}

Array.prototype.Remove = function(AttrName,AttrNameValue) {
    for(var i in this){
        if(this[i][AttrName]==AttrNameValue){
            this.splice(i,1);
            break;
        }
    }
}
