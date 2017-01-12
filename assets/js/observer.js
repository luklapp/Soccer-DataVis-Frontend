function ObserverSubject() {
    this.observers = [];
}

ObserverSubject.prototype.register = function(obs) {
    if(obs && typeof obs === "function") {
        this.observers.push(obs);
    }
}

ObserverSubject.prototype.unregister = function(obs) {
    this.observers = this.observers.filter(
        function(item) {
            if (item !== obs) {
                return item;
            }
        }
    );
}

ObserverSubject.prototype.notify = function(event, obj) {
    this.observers.forEach(function(observer) {
        observer(event, obj);
    });
}

const ObserverManager = new ObserverSubject();
