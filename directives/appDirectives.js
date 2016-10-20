ImgVisionApp.directive('aDisabled', function () {
    return {
        compile: function (tElement, tAttrs, transclude) {
            //Disable ngClick
            tAttrs["ngClick"] = "!(" + tAttrs["aDisabled"] + ") && (" + tAttrs["ngClick"] + ")";

            //return a link function
            return function (scope, iElement, iAttrs) {

                //Toggle "disabled" to class when aDisabled becomes true
                scope.$watch(iAttrs["aDisabled"], function (newValue) {
                    if (newValue !== undefined) {
                        iElement.toggleClass("disabled", newValue);
                    }
                });

                //Disable href on click
                iElement.on("click", function (e) {
                    if (scope.$eval(iAttrs["aDisabled"])) {
                        e.preventDefault();
                    }
                });
            };
        }
    };
});



//Re-size the modal based on the functionality
ImgVisionApp.directive('modalElement', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            $('.modal-dialog').hide();
            setTimeout(function () {
                $('.modal-dialog').addClass(attrs.modalElement).show();
                $('.modal-body').addClass(attrs.modalElement);
            }, 100);
        }
    }
});

ImgVisionApp.directive('fileInput', function ($parse, uploadServices) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileInput);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                    uploadServices.setFiletoUpload(element[0].files[0]);
                });
            });


            scope.$watch(function () {
                return element.val()
            }, function (newValue, oldValue) {

            });

        }
    };
});

ImgVisionApp.directive('validFile', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attrs, ngModel) {
            //change event is fired when file is selected
            el.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                });
            });
        }
    }
});

//Re-size the modal based on the functionality
ImgVisionApp.directive('copyLink', function ($timeout) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            copyLinkVisible: '='
        },
        link: function (scope, el, attrs) {
            scope.$watch('copyLinkVisible', function (val) {

                if (val == false) {
                    $timeout(function () {
                        el.focus();
                        el.select();
                    }, 100);

                }

            });

        }
    }
});


ImgVisionApp.directive('copyToClipboard', function ($window) {
    var body = angular.element($window.document.body);
    var textarea = angular.element('<textarea/>');
    textarea.css({
        position: 'fixed',
        opacity: '0'
    });

    function copy(toCopy) {
        textarea.val(toCopy);
        body.append(textarea);
        textarea[0].select();

        try {
            var successful = document.execCommand('copy');
            if (!successful) throw successful;
        } catch (err) {
            console.log("failed to copy", toCopy);
        }
        textarea.remove();
    }

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function (e) {
                copy(attrs.copyToClipboard);
                scope.copyToClipboardSuccess = true;
                scope.$apply(attrs.copyToClipboardSuccess);
            });
        }
    }
});


//searchFieldBoxTemplates
ImgVisionApp.directive('searchFieldBoxTemplates', function (uploadServices) {
    return {
        restrict: 'A',
        templateUrl: 'partials/searchFieldBoxesTemplate.html',
        scope: {
            searchFieldBoxTemplatesObject: "=",
            searchFieldBoxTemplatesLabel: "=",
            searchFieldBoxTemplatesType: "=",
            searchFieldBoxTemplatesSelects: "=",
            searchFieldBoxTemplatesCheck: "=",
            searchFieldBoxTemplatesOperators: "=",
            searchFieldBoxTemplatesInput: "=",
            searchFieldBoxTemplatesFormat: "=",
            searchFieldBoxTemplatesPermission: "=",
            searchFieldBoxRequired: "=",
            searchFieldBoxModule: "@"
        },
        link: function (scope, el, attrs) {

            scope.initialSearchFieldBoxRequired = scope.searchFieldBoxRequired;

            scope.fromDatePickerRequired = false;

            scope.defaultSelectBoxValue = true;

            scope.controlTypeEmitters = {
                textBox: 'text_box',
                comboBox: 'combo_box',
                date: 'date',
                checkBox: 'check_box',
                readOnly: 'ReadOnly'
            }

            scope.toLowercase = function (val) {
                return val.toLowerCase();
            }
            scope.searchFieldBoxTemplatesCheck = (scope.searchFieldBoxTemplatesCheck === 'True') ? true : scope.searchFieldBoxTemplatesCheck;
            var idx = 0;


            if (scope.searchFieldBoxModule == 'viewer' || scope.searchFieldBoxModule == 'upload') {
                angular.forEach(scope.searchFieldBoxTemplatesSelects, function (obj) {
                   
                    if (obj.ComboValue == scope.searchFieldBoxTemplatesObject) {
                        scope.searchFieldBoxTemplatesSelect = obj;
                    }
                    idx++;
                });
            }


            scope.$watch(function () {
                return uploadServices.getIndexingNotFieldsRequried()
            }, function (newValue, oldValue) {
                if (newValue == true) {
                    scope.searchFieldBoxRequired = !newValue;
                } else {
                    scope.searchFieldBoxRequired = scope.initialSearchFieldBoxRequired;
                }

            });



        },
        controller: function ($scope) {

            this.inputDate = function (val) {
                $scope.searchFieldBoxTemplatesObject = val;
            }

        }
    }
});

ImgVisionApp.directive("mydatepicker", function ($filter) {
    return {
        restrict: "E",
        require: "^searchFieldBoxTemplates",
        scope: {
            ngModel: "=",
            dateFormat: "=",
            dateOptions: "=",
            opened: "=",
            ngRequiredPicker: "=",
            placeholder: "@",
            readOnly: "="
        },
        link: function (scope, element, attrs, controller) {
            angular.element(element).find('i.fa').removeClass('fa-calendar');

            scope.open = function (event) {
                scope.opened = true;
            };

            scope.clear = function () {
                scope.ngModel = null;
            };

            scope.getDateChange = function (val, format) {
                if (val.target && val.target.value == "")
                    return false;

                var inputVal = (val.target) ? val.target.value : val;

                if ((format.split(format.slice(2, 3))[0].indexOf("dd") > -1)) {
                    if (inputVal.split(format.slice(2, 3)).length > 1)
                        inputVal = new Date(inputVal.split(format.slice(2, 3))[2], inputVal.split(format.slice(2, 3))[1] - 1, inputVal.split(inputVal.slice(2, 3))[0]);
                }
                var updatedval = $filter('date')(new Date(inputVal), format);
                scope.ngModel = updatedval;
                if (val.target) {
                    val.target.value = updatedval;
                }
                controller.inputDate(updatedval);
            }

            scope.$watch('ngRequiredPicker', function (val) {
                angular.element(element).find('input').attr('ng-required', val);
                angular.element(element).find('input').attr('required');
            });



        },
        templateUrl: 'partials/datepicker.html',
        controller: function ($scope, $element) {

            $scope.$watch('ngRequiredPicker', function (val) {

                setTimeout(function () {
                    $scope.datePickerRequired = val;
                }, 500);

            });

        }

    }
});

ImgVisionApp.directive("resizeImage", function () {
    return {
        restrict: "A",
        scope: {
            resizeImage: "="
        },
        link: function (scope, element, attrs) {

            scope.$watch('resizeImage', function (val) {
                element.animate({
                    width: val + "px"
                }, 500);
            });


        }

    }
});

ImgVisionApp.directive("loader", function () {
    return {
        restrict: "A",
        scope: {
            loaderShow: "&"
        },
        template: '<div class="loading" ng-show="show">Loading&#8230;</div>',
        link: function (scope, element, attrs) {

            scope.$watch(function () {
                return scope.loaderShow()
            }, function (newValue, oldValue) {
                scope.show = newValue;
            });

        }

    }
});

ImgVisionApp.directive("showNotification", function (commonServices) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return commonServices.getNotifyMessage()
            }, function (newValue, oldValue) {
                element.html(newValue);
            });

        }

    }
});


ImgVisionApp.directive("dropDownOpen", function () {
    return {
        restrict: "A",
        scope: {
            dropDownOpen: "="
        },
        link: function (scope, element, attrs) {

            scope.$watch(function () {
                return element.attr('class');
            }, function (newValue) {
                if (newValue.indexOf('open') != -1) {
                    scope.dropDownOpen = true;
                } else {
                    scope.dropDownOpen = false;
                }
            });

        }

    }
});

ImgVisionApp.directive("indexFieldValues", function () {
    return {
        restrict: "A",
        scope: {
            indexFieldValues: "=",
            indexFieldValuesSubmitted: "="
        },
        link: function (scope, element, attrs) {

            scope.fieldValues = [];

            scope.$watch(function () {
                return scope.indexFieldValues;
            }, function (newValue, oldValue) {

                if (newValue == true) {
                    var searchBoxes = angular.element('.search-field-boxes');
                    angular.forEach(searchBoxes, function (obj) {
                        var label = searchBoxes.find('.searchFieldLabel').text();
                        var value = searchBoxes.find('.input-text').val();
                        scope.fieldValues.push({
                            FnQueryName: label,
                            ValueAsString: value
                        });
                        scope.indexFieldValuesSubmitted = scope.fieldValues;
                    });

                }
            });

        }

    }
});



ImgVisionApp.directive("accordion", function (adminServices, uploadServices) {
    return {
        restrict: "A",
        scope: true,
        templateUrl: "partials/accordion.html",
        link: function (scope, element, attrs) {

            scope.accordionListDefaultActive = attrs.accordionListDefaultActive;
            scope.accordionList = scope.$eval(attrs.accordionList);


            scope.accordionEmitter = {
                businessArea: 'BusinessArea',
                indexing: 'Indexing',
                uploadSelect: 'uploadSelect',
                uploadOptions: 'uploadOptions'
            }

            scope.selectList = function (type) {
                if (scope.accordionListDefaultActive != type)
                    scope.accordionListDefaultActive = type;
                else
                    scope.accordionListDefaultActive = -1;
                uploadServices.setUploadAccordionIndex(type);

            }

            scope.isSet = function (type) {
                return scope.accordionListDefaultActive === type;
            }

            scope.isAccordionDisbaled = function (status) {
                if (status == 'enabled') {
                    return false
                } else {
                    return true;
                }

            }

            scope.$watch(function () {
                return uploadServices.getUploadAccordionIndex();
            }, function (newValue, oldValue) {
                scope.accordionListDefaultActive = newValue;
            });




        }

    }
});
ImgVisionApp.directive('clock', function ($interval) {
    return {
        scope: true,
        template: "<span class='clock'>{{date.now() | date: timeFormat}}</span>",
        link: function (scope, ele, attrs) {
            scope.timeFormat = 'dd/MM/yyyy hh:mm:ss a';
            scope.date = Date;
            $interval(function () {}, 1000);
        }
    };
});