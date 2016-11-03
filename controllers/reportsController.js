ImgVisionApp.controller('reportsController', function($scope,$http,$timeout,$sce){

$scope.iFrameReportUrl = "";
$scope.reportCategories = [
    {reportName: "Document Data Dump Report" , url: "https://bi.dev.corp.pep.pvt/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=FhRjEFgxkAsAv0AAABCnsFAkAFBWhAAt"  },
    {reportName: "Document Transition History Data Dump Report", url:"https://bi.dev.corp.pep.pvt/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=Fit6BFj10gIARg4AABC3wfUkAFBWhAAt" },
    {reportName: "Workflow Data Dump Report", url: "https://bi.dev.corp.pep.pvt/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=FtVNB1gBOQwARg4AABA3be8kAFBWhAAt" },
    {reportName: "Workflow History Data Dump Report" , url: "https://bi.dev.corp.pep.pvt/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=Fmfx9VcUYAEARg4AABCXofUkAFBWhAAt" },
    {reportName:"Workflow Notes Data Dump Report" , url: "https://bi.dev.corp.pep.pvt/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=FhgJ.lfXzgwARg4AABD3APUkAFBWhAAt" },
    {reportName: "Workflow Past Items Data Dump Report" , url: "https://bi.dev.corp.pep.pvt/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=FgtcB1jcIQUARg4AABBnne8kAFBWhAAt" }
];
$scope.LoadReport = function(reportUrl){
    $scope.iFrameReportUrl = $sce.trustAsResourceUrl(reportUrl) ;
}

});