game.building = (function (parent) {
    building.prototype = new game.element();
    building.prototype.constructor = building;
    
    function building(p) {
        if (p) {
            if (p.type) {
                this.type = p.type;
            }
        }
    }

    return building;

})(game.element);