/// <reference path="../plugins/ng-grid-reorderable.js" />
/// <reference path="../ng-grid-1.0.0.debug.js" />
function MessageObject() {
    var self = this;

    this.Date = {};
    this.From = '';
    this.Subject = '';
    this.HasBeenRead = ko.observable(true);
    this.MessageId = '';
    this.image = ko.computed(function () {
        return self.HasBeenRead() === true ? "mailOpen.jpg" : "mailClosed.jpg";
    });
    this.index;
};
function mainViewModel() {
    var self = this;
    
    self.inboxData = ko.observableArray([]);
    this.createTestData = function () {
        
        var today, arr = [];
        
        today = new Date();
        
        for (i = 1; i < 50; i = i + 1) {
            
            obj = new MessageObject();
            obj.Date = new Date();
            obj.Date.setDate(today.getDate() + i);
            obj.From = "Mike Griffin " + i.toString();
            obj.Subject = "Invite to Meeting - " + i.toString();
            obj.MessageId = "00000000-0000-0000-0000-00000000000" + i.toString(); // fake my guid
            obj.HasBeenRead(false);  // this might be true when I read it from the DB
            obj.index = i;
            
            arr.push(obj);
        }
        
        // Our grid is bound to inboxData which is an observableArray
        self.inboxData(arr);
    };
    //option 1 use seleciton change callback to set read.
    self.markEmailRead = function(row){
        var entity = row.entity;
        entity.HasBeenRead(true);
        // maybe do some validation?
        return true;
    };
    self.selectedItems = ko.observableArray([]);
    self.currentMail = ko.computed(function() {
        return self.selectedItems()[0];
    });
    self.createTestData();
    this.gridOptions = { 
        data: self.inboxData,
        multiSelect: false,
        displaySelectionCheckbox: false,
        rowHeight: 50,
        enableRowReordering: false,
        enableColumnReordering: false,
        beforeSelectionChange: self.markEmailRead,
        rowTemplate: 'rowTemplate.html',
        selectedItems: self.selectedItems,
        columnDefs: [
            { field: '', width: '*', cellTemplate: 'imageCellTemplate.html' },
            { field: 'From', width: '***' },
            { field: 'Subject', width: '***************' },
            { field: 'Date', width: '***' }]
    };
}
ko.applyBindings(new mainViewModel());