/**
 * Created by szhitenev on 10.03.2017.
 */
var app = angular.module('party.table', []);

app.component('partyTable', require('./app/components/partyTableComponent/partyTableComponent.js'));
app.component('tableShell', require('./app/components/tableShellComponent/tableShellComponent.js'));
app.component('tableBody', require('./app/components/tableBodyComponent/tableBodyComponent.js'));
app.component('sidebarArea', require('./app/components/sidebarAreaComponent/sidebarAreaComponent.js'));
app.component('groupingArea', require('./app/components/groupingAreaComponent/groupingAreaComponent.js'));
app.component('columnArea', require('./app/components/columnAreaComponent/columnAreaComponent.js'));

app.directive('columnResize', [require('./app/directives/columnResizeDirective/columnResizeDirective.js')]);

//app.component('groupClipboardHandler', [require('./app/directives/groupTable/gClipboardHandlerComponent')]);
//app.component('groupColumnResizer', [require('./app/directives/groupTable/gColumnResizerComponent')]);
//app.component('gDialogDraggable', [require('./app/directives/groupTable/gDialogDraggableComponent')]);
//app.component('groupHeightAligner', [require('./app/directives/groupTable/gHeightAlignerComponent')]);
//app.component('groupVerticalScroll', [require('./app/directives/groupTable/gVerticalScrollComponent')]);
//app.component('groupHorizontalScroll', [require('./app/directives/groupTable/gHorizontalScrollComponent')]);
//app.component('groupSecondVerticalScroll', [require('./app/directives/groupTable/gSecondVerticalScrollComponent')]);
//app.component('groupEditorBinder', ['$templateCache', '$compile', require('./app/directives/groupTable/groupEditorBinderComponent')]);
//app.component('groupColumnInitWidth', [require('./app/directives/groupTable/gColumnInitWidthComponent.js')]);
//
//app.component('groupBindReportRow', [require('./app/directives/groupTable/gBindReportRowDirective.js')]);
//
//app.controller('GReportSettingsDialogController', ['$scope', '$mdDialog', 'reportOptions', require('./app/controllers/dialogs/gReportSettingsDialogController')]);
//
//app.controller('gModalController', ['$scope', '$mdDialog', 'parentScope', 'callback', require('./app/directives/groupTable/gModalComponent')]);
//app.controller('gModalReportController', ['$scope', '$mdDialog', 'parentScope', 'callback', require('./app/directives/groupTable/gModalReportComponent')]);

require('./templates.min.js');